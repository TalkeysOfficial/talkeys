// Characterizes event reads, derived status, likes and admin create/update/delete.
// Documented in docs/ARCHITECTURE.md sections 2-3.
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const h = require("../helpers/setup");

test.before(h.start);
test.beforeEach(h.reset);

const validBody = (overrides = {}) => ({
  name: "Created Event",
  location: "Hall A",
  mode: "offline",
  visibility: "public",
  duration: "2 hours",
  startDate: new Date(Date.now() + 864e5).toISOString(),
  startTime: "10:00",
  startRegistrationDate: new Date(Date.now() - 864e5).toISOString(),
  totalSeats: 5,
  slots: 1,
  ...overrides,
});
const as = (user) => ({ Authorization: h.authHeader(user).Authorization });

test.describe("public reads", () => {
  test("getEvents: derived status replaces the stored status field", async () => {
    await h.makeEvent({ status: "cancelled" });
    const res = await request(h.app).get("/getEvents");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "success");
    // characterization: stored status (draft/published/cancelled) is overwritten by getStatus()
    assert.equal(res.body.data.events[0].status, "live");
  });

  test("derived status: closed / coming soon / live / ended", async () => {
    const cases = [
      [{ isRegistrationOpen: false }, "registration_closed"],
      [{ startRegistrationDate: new Date(Date.now() + 864e5) }, "coming_soon"],
      [{ isLive: true }, "live"],
      [{ isLive: false }, "ended"],
    ];
    for (const [overrides, expected] of cases) {
      const event = await h.makeEvent(overrides);
      assert.equal(event.getStatus(), expected);
    }
  });

  test("getEvents: availableSeats = totalSeats - registrationCount, filters by mode", async () => {
    await h.makeEvent({ totalSeats: 10, registrationCount: 3, mode: "online" });
    await h.makeEvent({ mode: "offline" });
    const res = await request(h.app).get("/getEvents").query({ mode: "online" });
    assert.equal(res.body.data.events.length, 1);
    assert.equal(res.body.data.events[0].availableSeats, 7);
  });

  test("drafts and private events are not listed, even when visibility=private is requested", async () => {
    await h.makeEvent({ status: "draft", visibility: "public" });
    await h.makeEvent({ status: "published", visibility: "private" });
    const visible = await h.makeEvent({ status: "published", visibility: "public" });
    for (const query of [{}, { visibility: "private" }]) {
      const res = await request(h.app).get("/getEvents").query(query);
      assert.deepEqual(res.body.data.events.map((e) => e._id), [String(visible._id)]);
    }
  });

  test("getEvents: operator objects in filters are ignored, search is a literal, sortBy is whitelisted", async () => {
    await h.makeEvent({ name: "Alpha", mode: "online" });
    await h.makeEvent({ name: "Beta (x)", mode: "offline" });
    const ops = await request(h.app).get("/getEvents?mode[$ne]=online");
    assert.equal(ops.body.data.events.length, 2);
    const regex = await request(h.app).get("/getEvents").query({ search: ".*" });
    assert.equal(regex.body.data.events.length, 0);
    const literal = await request(h.app).get("/getEvents").query({ search: "(x)" });
    assert.equal(literal.body.data.events.length, 1);
    const sorted = await request(h.app).get("/getEvents").query({ sortBy: "$where" });
    assert.equal(sorted.status, 200);
  });

  test("getEventById: a draft is a 404", async () => {
    const draft = await h.makeEvent({ status: "draft" });
    assert.equal((await request(h.app).get(`/getEventById/${draft._id}`)).status, 404);
  });

  test("getEventById: unknown id -> 404 shape", async () => {
    const res = await request(h.app).get(`/getEventById/${new h.mongoose.Types.ObjectId()}`);
    assert.equal(res.status, 404);
  });
});

test.describe("likes", () => {
  test("like then unlike toggles membership on the user", async () => {
    const user = await h.makeUser();
    const event = await h.makeEvent();
    const like = await request(h.app).get(`/likeEvent/${event._id}`).set(as(user));
    assert.equal(like.status, 200);
    assert.equal((await h.User.findById(user._id)).likedEvents.map(String).includes(String(event._id)), true);
    const unlike = await request(h.app).get(`/unlikeEvent/${event._id}`).set(as(user));
    assert.equal(unlike.status, 200);
    assert.equal((await h.User.findById(user._id)).likedEvents.length, 0);
  });
});

test.describe("admin management", () => {
  const route = "/admin/events";

  test("role user -> 403, no token -> 403", async () => {
    assert.equal((await request(h.app).post(route).send({})).status, 403);
    const res = await request(h.app).post(route).set(as(await h.makeUser())).send(validBody());
    assert.equal(res.status, 403);
  });

  test("invalid body -> 400 with validation errors", async () => {
    const admin = await h.makeUser({ role: "admin" });
    const res = await request(h.app).post(route).set(as(admin)).send({});
    assert.equal(res.status, 400);
    assert.equal(res.body.status, "error");
  });

  test("create -> 201 and stored", async () => {
    const admin = await h.makeUser({ role: "admin" });
    const res = await request(h.app).post(route).set(as(admin)).send(validBody());
    assert.equal(res.status, 201, JSON.stringify(res.body));
    assert.equal(await h.Event.countDocuments(), 1);
    assert.equal(res.body.data.status, "published");
  });

  test("/addEvent is an alias for create", async () => {
    const admin = await h.makeUser({ role: "admin" });
    const res = await request(h.app).post("/addEvent").set(as(admin)).send(validBody());
    assert.equal(res.status, 201);
  });

  test("update: malformed id 400, unknown id 404, stale lastKnownUpdatedAt 409, fresh 200", async () => {
    const admin = await h.makeUser({ role: "admin" });
    const event = await h.makeEvent();
    assert.equal((await request(h.app).put("/admin/events/nope").set(as(admin)).send({})).status, 400);
    const missing = await request(h.app).put(`/admin/events/${new h.mongoose.Types.ObjectId()}`).set(as(admin)).send({ name: "x" });
    assert.equal(missing.status, 404);
    const stale = await request(h.app)
      .put(`/admin/events/${event._id}`)
      .set(as(admin))
      .send({ name: "Renamed", lastKnownUpdatedAt: new Date(0).toISOString() });
    assert.equal(stale.status, 409);
    const fresh = await request(h.app)
      .put(`/admin/events/${event._id}`)
      .set(as(admin))
      .send({ name: "Renamed", lastKnownUpdatedAt: event.updatedAt.toISOString() });
    assert.equal(fresh.status, 200);
    assert.equal((await h.Event.findById(event._id)).name, "Renamed");
  });

  test("partial update keeps omitted fields", async () => {
    const admin = await h.makeUser({ role: "admin" });
    const event = await h.makeEvent({ isLive: true, isRegistrationOpen: true });
    const res = await request(h.app).put(`/admin/events/${event._id}`).set(as(admin)).send({ name: "Only name" });
    assert.equal(res.status, 200);
    const saved = await h.Event.findById(event._id);
    assert.equal(saved.name, "Only name");
    assert.equal(saved.isLive, true);
    assert.equal(saved.isRegistrationOpen, true);
  });

  test("delete: removes the event, even with existing passes (no guard)", async () => {
    const admin = await h.makeUser({ role: "admin" });
    const event = await h.makeEvent();
    const res = await request(h.app).delete(`/deleteSpecificEvent/${event._id}`).set(as(admin));
    assert.equal(res.status, 200);
    assert.equal(await h.Event.countDocuments(), 0);
    assert.equal((await request(h.app).delete(`/deleteSpecificEvent/${event._id}`).set(as(admin))).status, 404);
  });
});
