// Characterizes login/JWT, roles, team membership and the organizer dashboard.
// Documented in docs/ARCHITECTURE.md sections 4-5.
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const h = require("../helpers/setup");

test.before(h.start);
test.beforeEach(h.reset);

const as = (user) => h.authHeader(user);
// every non-multipart response is labelled application/json, so plain-text bodies need a raw parser
const rawText = (res, cb) => {
  let body = "";
  res.on("data", (chunk) => (body += chunk));
  res.on("end", () => cb(null, body));
};

test.describe("POST /verify (Google login)", () => {
  const login = (authorization) => {
    const req = request(h.app).post("/verify");
    return authorization ? req.set("Authorization", authorization) : req;
  };

  test("no header or non-Bearer header -> 403", async () => {
    assert.equal((await login()).status, 403);
    assert.equal((await login("Basic abc")).status, 403);
  });
  test("invalid Google token -> 401", async () => {
    const res = await login("Bearer garbage");
    assert.equal(res.status, 401);
    assert.equal(res.body.message, "Invalid Google token");
  });
  test("first login creates a role=user account and returns a JWT that verifyToken accepts", async () => {
    const res = await login("Bearer google:new@test.dev:Newbie");
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "Newbie");
    const user = await h.User.findOne({ email: "new@test.dev" });
    assert.equal(user.role, "user");
    assert.equal(jwt.verify(res.body.accessToken, process.env.SECRET).email, "new@test.dev");
    const profile = await request(h.app).get("/dashboard/profile").set("Authorization", `Bearer ${res.body.accessToken}`);
    assert.equal(profile.status, 200);
  });
  test("repeat login reuses the account", async () => {
    await login("Bearer google:again@test.dev:A");
    await login("Bearer google:again@test.dev:A");
    assert.equal(await h.User.countDocuments({ email: "again@test.dev" }), 1);
  });
});

test.describe("verifyToken and checkRole", () => {
  test("no token 403, bad token 401, token for unknown email 404", async () => {
    assert.equal((await request(h.app).get("/getAllLikedEvents")).status, 403);
    const bad = await request(h.app).get("/getAllLikedEvents").set("Authorization", "Bearer nope");
    assert.equal(bad.status, 401);
    const ghost = jwt.sign({ email: "ghost@test.dev" }, process.env.SECRET);
    const res = await request(h.app).get("/getAllLikedEvents").set("Authorization", `Bearer ${ghost}`);
    assert.equal(res.status, 404);
  });
  test("token signed with another secret -> 401", async () => {
    const user = await h.makeUser();
    const forged = jwt.sign({ email: user.email }, "other-secret");
    const res = await request(h.app).get("/getAllLikedEvents").set("Authorization", `Bearer ${forged}`);
    assert.equal(res.status, 401);
  });
  test("organizer is not an admin: admin routes 403; admin is not an organizer: dashboard organizer routes 403", async () => {
    const organizer = await h.makeUser({ role: "organizer" });
    const admin = await h.makeUser({ role: "admin" });
    assert.equal((await request(h.app).get("/admin/events").set(as(organizer))).status, 403);
    assert.equal((await request(h.app).post("/dashboard/create-event").set(as(admin)).send({})).status, 403);
  });
  test("logout is public and only clears a cookie", async () => {
    const res = await request(h.app).get("/logout").parse(rawText);
    assert.equal(res.status, 200);
    assert.equal(res.body, "Logged out");
  });
  test("unknown path: 403 without a token or for a plain user (checkRole(admin) runs first); 404 JSON only for admins", async () => {
    assert.equal((await request(h.app).get("/nope")).status, 403);
    assert.equal((await request(h.app).get("/nope").set(as(await h.makeUser()))).status, 403);
    const res = await request(h.app).get("/nope").set(as(await h.makeUser({ role: "admin" })));
    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { status: false, message: "Endpoint Not Found" });
  });
});

test.describe("dashboard profile", () => {
  test("GET strips tokens", async () => {
    const res = await request(h.app).get("/dashboard/profile").set(as(await h.makeUser()));
    assert.equal(res.status, 200);
    assert.equal(res.body.accessToken, undefined);
    assert.equal(res.body.refreshToken, undefined);
  });
  test("characterization: PATCH response includes the user's stored tokens", async () => {
    const user = await h.makeUser({ accessToken: "stored-access", refreshToken: "stored-refresh" });
    const res = await request(h.app).patch("/dashboard/profile").set(as(user)).send({ about: "hi" });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "success");
    assert.equal(res.body.user.accessToken, "stored-access");
    assert.equal(res.body.user.refreshToken, "stored-refresh");
  });
});

test.describe("organizer ownership", () => {
  const organizerOf = (event) => h.makeUser({ role: "organizer", email: event.organizerEmail });

  test("non-owner organizer: edit 403, participants 403, analytics 403", async () => {
    const event = await h.makeEvent();
    const other = await h.makeUser({ role: "organizer", email: "other@test.dev" });
    assert.equal((await request(h.app).put(`/dashboard/edit-event/${event._id}`).set(as(other)).send({ name: "x" })).status, 403);
    assert.equal((await request(h.app).get(`/dashboard/participants/${event._id}`).set(as(other))).status, 403);
    assert.equal((await request(h.app).get(`/dashboard/event-analytics/${event._id}`).set(as(other))).status, 403);
  });
  test("owner organizer can list participants", async () => {
    const event = await h.makeEvent();
    const owner = await organizerOf(event);
    const res = await request(h.app).get(`/dashboard/participants/${event._id}`).set(as(owner));
    assert.equal(res.status, 200);
  });
});

test.describe("team membership", () => {
  const create = (user, body) => request(h.app).post("/createTeam").set(as(user)).send(body);
  const join = (user, body) => request(h.app).post("/joinTeam").set(as(user)).send(body);

  test("createTeam guards: name, phone, unknown event, non-team event", async () => {
    const user = await h.makeUser();
    const event = await h.makeEvent({ isTeamEvent: true, slots: 2 });
    const solo = await h.makeEvent();
    assert.equal((await create(user, { eventId: event._id, teamName: "A", phoneNumber: "9999999999" })).status, 400);
    assert.equal((await create(user, { eventId: event._id, teamName: "Team", phoneNumber: "1" })).status, 400);
    assert.equal((await create(user, { eventId: new h.mongoose.Types.ObjectId(), teamName: "Team", phoneNumber: "9999999999" })).status, 404);
    const res = await create(user, { eventId: solo._id, teamName: "Team", phoneNumber: "9999999999" });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "This event does not support team registration");
  });

  test("create -> Open (leader is member 1, capacity = event.slots); second team for same user 400", async () => {
    const user = await h.makeUser();
    const event = await h.makeEvent({ isTeamEvent: true, slots: 2 });
    const res = await create(user, { eventId: event._id, teamName: "Alpha", phoneNumber: "9999999999" });
    assert.equal(res.status, 201);
    assert.equal(res.body.team.maxMembers, 2);
    assert.equal(res.body.team.teamMembers?.length ?? res.body.team.members?.length, 1);
    const again = await create(user, { eventId: event._id, teamName: "Beta", phoneNumber: "9999999999" });
    assert.equal(again.status, 400);
    assert.equal(again.body.error, "User is already in a team for this event");
  });

  test("join: Open -> Full; further joins rejected; leader re-join is idempotent", async () => {
    const [leader, second, third] = [await h.makeUser(), await h.makeUser(), await h.makeUser()];
    const event = await h.makeEvent({ isTeamEvent: true, slots: 2 });
    const { body } = await create(leader, { eventId: event._id, teamName: "Alpha", phoneNumber: "9999999999" });
    const joined = await join(second, { teamCode: body.teamCode.toLowerCase(), phoneNumber: "8888888888" });
    assert.equal(joined.status, 200);
    assert.equal((await h.Team.findOne({ teamCode: body.teamCode })).teamMembers.length, 2);
    const full = await join(third, { teamCode: body.teamCode, phoneNumber: "7777777777" });
    assert.equal(full.status, 400);
    assert.equal(full.body.error, "Team is full");
    const rejoin = await join(second, { teamCode: body.teamCode, phoneNumber: "8888888888" });
    assert.equal(rejoin.status, 200);
    assert.equal((await h.Team.findOne({ teamCode: body.teamCode })).teamMembers.length, 2);
  });

  test("join guards: missing code 400, bad phone 400, unknown team 404, already in another team 400", async () => {
    const [leader, other] = [await h.makeUser(), await h.makeUser()];
    const event = await h.makeEvent({ isTeamEvent: true, slots: 3 });
    assert.equal((await join(other, { phoneNumber: "9999999999" })).status, 400);
    assert.equal((await join(other, { teamCode: "X", phoneNumber: "1" })).status, 400);
    assert.equal((await join(other, { teamCode: "NOPE", phoneNumber: "9999999999" })).status, 404);
    const a = (await create(leader, { eventId: event._id, teamName: "A1", phoneNumber: "9999999999" })).body;
    await create(other, { eventId: event._id, teamName: "B1", phoneNumber: "8888888888" });
    const res = await join(other, { teamCode: a.teamCode, phoneNumber: "8888888888" });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "User is already in a team for this event");
  });

  test("team booking: member books a team event; non-member 403; teammates become friends", async () => {
    const [leader, member, outsider] = [await h.makeUser(), await h.makeUser(), await h.makeUser()];
    const event = await h.makeEvent({ isTeamEvent: true, slots: 2, totalSeats: 10 });
    const { body } = await create(leader, { eventId: event._id, teamName: "Alpha", phoneNumber: "9999999999" });
    await request(h.app).post("/joinTeam").set(as(member)).send({ teamCode: body.teamCode, phoneNumber: "8888888888" });
    const denied = await request(h.app).post("/api/book-ticket").set(as(outsider)).send({ eventId: String(event._id), teamCode: body.teamCode });
    assert.equal(denied.status, 403);
    const ok = await request(h.app).post("/api/book-ticket").set(as(leader)).send({ eventId: String(event._id), teamCode: body.teamCode });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.data.totalTickets, 2);
    assert.equal((await h.Event.findById(event._id)).registrationCount, 2);
  });
});
