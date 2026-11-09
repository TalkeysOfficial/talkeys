// Characterizes check-in scanning (POST /accept) and organizer approval.
// Documented in docs/ARCHITECTURE.md section 1.
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const h = require("../helpers/setup");

test.before(h.start);
test.beforeEach(h.reset);

async function confirmedPass(overrides = {}) {
  const user = await h.makeUser();
  const event = await h.makeEvent();
  const pass = await h.Pass.create({
    userId: user._id,
    eventId: event._id,
    status: "active",
    passStatus: "active",
    paymentStatus: "completed",
    merchantOrderId: `TKT_${Math.random()}`,
    ticketCount: 1,
    amount: 0,
    ...overrides,
  });
  return { user, event, pass };
}
// Check-in is admin-only; the scanner is always an admin, whoever owns the pass.
const accept = async (_owner, body, path = "/accept", scanner) =>
  request(h.app).post(path).set(h.authHeader(scanner ?? (await h.makeUser({ role: "admin" })))).send(body);

test.describe("Accept (check-in scan)", () => {
  test("no token -> 403", async () => {
    assert.equal((await request(h.app).post("/accept").send({})).status, 403);
  });
  test("missing uuid -> 400, missing qrId -> 400", async () => {
    const user = await h.makeUser();
    const noUuid = await accept(user, {});
    assert.equal(noUuid.status, 400);
    assert.equal(noUuid.body.error, "Pass UUID is required");
    const noQr = await accept(user, { uuid: "x" });
    assert.equal(noQr.status, 400);
    assert.equal(noQr.body.error, "QR ID is required");
  });
  test("unknown uuid -> 404", async () => {
    const res = await accept(await h.makeUser(), { uuid: "nope", qrId: "x" });
    assert.equal(res.status, 404);
    assert.equal(res.body.error, "Pass not found");
  });
  test("unpaid pass -> 400", async () => {
    const { user, pass } = await confirmedPass({ status: "pending", passStatus: "inactive", paymentStatus: "pending" });
    // pre-save issues a UUID for "pending" only when confirmed, so give it one directly
    await h.Pass.updateOne({ _id: pass._id }, { passUUID: "u-unpaid" });
    const res = await accept(user, { uuid: "u-unpaid", qrId: "x" });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "Pass is not active");
  });
  test("unknown qr -> 404", async () => {
    const { user, pass } = await confirmedPass();
    const res = await accept(user, { uuid: pass.passUUID, qrId: "nope" });
    assert.equal(res.status, 404);
    assert.equal(res.body.error, "QR code not found");
  });

  test("single QR: scan -> 200, qrScanned and isScanned set; rescan -> 409", async () => {
    const { user, pass } = await confirmedPass();
    const qrId = pass.qrStrings[0].id;
    const ok = await accept(user, { uuid: pass.passUUID, qrId });
    assert.equal(ok.status, 200);
    assert.equal(ok.body.message, "Pass scanned successfully");
    const saved = await h.Pass.findById(pass._id);
    assert.equal(saved.qrStrings[0].qrScanned, true);
    assert.ok(saved.qrStrings[0].scannedAt);
    assert.equal(saved.isScanned, true);
    assert.ok(saved.timeScanned);
    const again = await accept(user, { uuid: pass.passUUID, qrId });
    assert.equal(again.status, 409);
    assert.equal(again.body.error, "QR code already scanned");
  });

  test("two QRs: isScanned only after the last one", async () => {
    const { user, pass } = await confirmedPass({ friends: [{ name: "Friend" }], ticketCount: 2 });
    assert.equal(pass.qrStrings.length, 2);
    await accept(user, { uuid: pass.passUUID, qrId: pass.qrStrings[0].id });
    assert.equal((await h.Pass.findById(pass._id)).isScanned, false);
    await accept(user, { uuid: pass.passUUID, qrId: pass.qrStrings[1].id });
    assert.equal((await h.Pass.findById(pass._id)).isScanned, true);
  });

  test("lowercase /accept and /Accept are the same handler", async () => {
    const { user, pass } = await confirmedPass();
    const res = await accept(user, { uuid: pass.passUUID, qrId: pass.qrStrings[0].id }, "/Accept");
    assert.equal(res.status, 200);
  });

  test("role user cannot check people in -> 403", async () => {
    const { pass } = await confirmedPass();
    const stranger = await h.makeUser({ role: "user" });
    const res = await accept(null, { uuid: pass.passUUID, qrId: pass.qrStrings[0].id }, "/accept", stranger);
    assert.equal(res.status, 403);
    assert.equal((await h.Pass.findById(pass._id)).qrStrings[0].qrScanned, false);
  });

  test("characterization: scanning silently re-activates a revoked pass", async () => {
    const { user, pass } = await confirmedPass({ status: "revoked", passStatus: "revoked" });
    const res = await accept(user, { uuid: pass.passUUID, qrId: pass.qrStrings[0].id });
    assert.equal(res.status, 200);
    const saved = await h.Pass.findById(pass._id);
    assert.deepEqual([saved.status, saved.passStatus], ["active", "active"]);
  });
});

test.describe("scanner admin routes", () => {
  test("/CanScan: user 403 (role middleware), admin 200", async () => {
    const user = await h.makeUser();
    const denied = await request(h.app).get("/CanScan").set(h.authHeader(user));
    assert.equal(denied.status, 403);
    const admin = await h.makeUser({ role: "admin" });
    const ok = await request(h.app).get("/CanScan").set(h.authHeader(admin));
    assert.equal(ok.status, 200);
    assert.equal(ok.body.message, "User can scan passes");
  });
  test("/regisDetails counts only completed passes", async () => {
    await confirmedPass({ amount: 100, friends: [{ name: "F" }], ticketCount: 2 });
    const admin = await h.makeUser({ role: "admin" });
    const res = await request(h.app).get("/regisDetails").set(h.authHeader(admin));
    assert.equal(res.status, 200);
    assert.deepEqual(
      [res.body.orders, res.body.passes, res.body.amount, res.body.y2kPasses],
      [1, 2, 100, 0],
    );
  });
});

test.describe("organizer approveParticipant", () => {
  const approve = (user, id) =>
    request(h.app).put(`/dashboard/approve-participant/${id}`).set(h.authHeader(user)).send();

  test("role user -> 403 from checkRole", async () => {
    const res = await approve(await h.makeUser(), new h.mongoose.Types.ObjectId());
    assert.equal(res.status, 403);
  });
  test("malformed id -> 400, unknown id -> 404", async () => {
    const organizer = await h.makeUser({ role: "organizer", email: "organizer@test.dev" });
    assert.equal((await approve(organizer, "nope")).status, 400);
    assert.equal((await approve(organizer, new h.mongoose.Types.ObjectId())).status, 404);
  });
  test("organizer of another event -> 403 Access denied", async () => {
    const { pass } = await confirmedPass();
    const other = await h.makeUser({ role: "organizer", email: "someone-else@test.dev" });
    const res = await approve(other, pass._id);
    assert.equal(res.status, 403);
    assert.equal(res.body.message, "Access denied");
  });
  test("approval of an unpaid pass is refused and leaves it untouched", async () => {
    const { pass } = await confirmedPass({ status: "pending", passStatus: "inactive", paymentStatus: "pending" });
    const organizer = await h.makeUser({ role: "organizer", email: "organizer@test.dev" });
    const res = await approve(organizer, pass._id);
    assert.equal(res.status, 409);
    const saved = await h.Pass.findById(pass._id);
    assert.deepEqual([saved.status, saved.passStatus, saved.paymentStatus], ["pending", "inactive", "pending"]);
  });
  test("approval of a paid pass sets status=active", async () => {
    const { pass } = await confirmedPass({ status: "pending", paymentStatus: "completed" });
    const organizer = await h.makeUser({ role: "organizer", email: "organizer@test.dev" });
    const res = await approve(organizer, pass._id);
    assert.equal(res.status, 200);
    assert.equal(res.body.message, "Participant approved");
    assert.equal((await h.Pass.findById(pass._id)).status, "active");
  });
});
