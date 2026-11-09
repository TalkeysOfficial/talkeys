// Characterizes the pass lifecycle: booking, PhonePe webhook/callback/status check, expiry.
// Documented in docs/ARCHITECTURE.md section 1. Defects are pinned, not fixed.
const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const request = require("supertest");
const h = require("../helpers/setup");
const { cleanupExpiredPasses } = require("../../src/controllers/passes.controller");

test.before(h.start);
test.beforeEach(h.reset);

const book = (user, body) =>
  request(h.app).post("/api/book-ticket").set(h.authHeader(user)).send(body);
const webhook = (event, merchantOrderId, headers = {}) =>
  request(h.app)
    .post("/api/payment/webhook")
    .set({ "Content-Type": "application/json", ...headers })
    .send(JSON.stringify({ event, payload: { merchantOrderId, orderId: "OMO-FAKE", amount: 10000 } }));

async function bookPaid(overrides = {}) {
  const user = await h.makeUser();
  const event = await h.makeEvent({ isPaid: true, ticketPrice: 100, ...overrides });
  const res = await book(user, { eventId: String(event._id) });
  assert.equal(res.status, 200);
  return { user, event, merchantOrderId: res.body.data.merchantOrderId, passId: res.body.data.passId };
}

test.describe("bookTicket guards", () => {
  test("no token -> 403", async () => {
    const res = await request(h.app).post("/api/book-ticket").send({});
    assert.equal(res.status, 403);
  });
  test("missing eventId -> 400", async () => {
    const res = await book(await h.makeUser(), {});
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "User ID and Event ID are required");
  });
  test("malformed eventId -> 400", async () => {
    const res = await book(await h.makeUser(), { eventId: "nope" });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "Invalid Event ID");
  });
  test("unknown event -> 404", async () => {
    const res = await book(await h.makeUser(), { eventId: String(new h.mongoose.Types.ObjectId()) });
    assert.equal(res.status, 404);
    assert.equal(res.body.error, "Event not found");
  });
  test("team event without teamCode -> 400", async () => {
    const event = await h.makeEvent({ isTeamEvent: true });
    const res = await book(await h.makeUser(), { eventId: String(event._id) });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "Team code is required for this event");
  });
  test("sold out -> 400 and no pass is created", async () => {
    const event = await h.makeEvent({ totalSeats: 1, registrationCount: 1 });
    const res = await book(await h.makeUser(), { eventId: String(event._id) });
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "Insufficient tickets available");
    assert.equal(await h.Pass.countDocuments(), 0);
  });
});

test.describe("bookTicket transitions", () => {
  test("free event: none -> Active, QR issued, seat taken", async () => {
    const user = await h.makeUser();
    const event = await h.makeEvent();
    const res = await book(user, { eventId: String(event._id) });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.paymentRequired, false);
    const pass = await h.Pass.findById(res.body.data.passId);
    assert.deepEqual([pass.status, pass.passStatus, pass.paymentStatus], ["active", "active", "completed"]);
    assert.ok(pass.passUUID);
    assert.equal(pass.qrStrings.length, 1);
    assert.equal((await h.Event.findById(event._id)).registrationCount, 1);
  });

  test("paid event: none -> Pending, no QR, PhonePe order created, 20 min expiry", async () => {
    const { event, passId } = await bookPaid();
    const pass = await h.Pass.findById(passId);
    assert.deepEqual([pass.status, pass.passStatus, pass.paymentStatus], ["pending", "inactive", "pending"]);
    assert.equal(pass.passUUID, undefined);
    assert.equal(pass.qrStrings.length, 0);
    assert.equal(pass.paymentUrl, "https://pay.test/checkout");
    const minutes = Math.round((pass.expiresAt - pass.createdAt) / 60000);
    assert.equal(minutes, 20);
    assert.equal((await h.Event.findById(event._id)).registrationCount, 1);
  });

  test("order creation failure: Pending -> PaymentFailed, seat released, HTTP 500", async () => {
    h.phonepe.createFails = true;
    const user = await h.makeUser();
    const event = await h.makeEvent({ isPaid: true, ticketPrice: 100 });
    const res = await book(user, { eventId: String(event._id) });
    assert.equal(res.status, 500);
    const pass = await h.Pass.findOne({ eventId: event._id });
    assert.deepEqual([pass.status, pass.passStatus, pass.paymentStatus], ["payment_failed", "inactive", "failed"]);
    assert.equal(pass.seatsReserved, false);
    assert.equal((await h.Event.findById(event._id)).registrationCount, 0);
  });

  test("characterization: same user can book the same event repeatedly (no duplicate guard)", async () => {
    const user = await h.makeUser();
    const event = await h.makeEvent();
    await book(user, { eventId: String(event._id) });
    const second = await book(user, { eventId: String(event._id) });
    assert.equal(second.status, 200);
    assert.equal(await h.Pass.countDocuments({ userId: user._id }), 2);
  });

  test("characterization: closed registration does not block booking", async () => {
    const event = await h.makeEvent({ isRegistrationOpen: false, isLive: false });
    const res = await book(await h.makeUser(), { eventId: String(event._id) });
    assert.equal(res.status, 200);
  });
});

test.describe("webhook", () => {
  test("completed: Pending -> Active, QR + UUID, activePasses +1", async () => {
    const { user, merchantOrderId, passId } = await bookPaid();
    const res = await webhook("checkout.order.completed", merchantOrderId);
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { success: true, event: "checkout.order.completed" });
    const pass = await h.Pass.findById(passId);
    assert.deepEqual([pass.status, pass.passStatus, pass.paymentStatus], ["active", "active", "completed"]);
    assert.ok(pass.passUUID);
    assert.equal(pass.qrStrings.length, 1);
    assert.ok(pass.confirmedAt);
    // characterization: `activePasses` is not in the User schema, so the $inc is silently dropped
    assert.equal((await h.User.collection.findOne({ _id: user._id })).activePasses, undefined);
  });

  test("completed replay is idempotent", async () => {
    const { user, merchantOrderId, passId } = await bookPaid();
    await webhook("checkout.order.completed", merchantOrderId);
    const before = await h.Pass.findById(passId);
    const res = await webhook("checkout.order.completed", merchantOrderId);
    assert.equal(res.status, 200);
    const after = await h.Pass.findById(passId);
    assert.equal(after.passUUID, before.passUUID);
    assert.equal((await h.User.collection.findOne({ _id: user._id })).activePasses, undefined);
  });

  test("failed: Pending -> PaymentFailed, seat released", async () => {
    const { event, merchantOrderId, passId } = await bookPaid();
    const res = await webhook("checkout.order.failed", merchantOrderId);
    assert.equal(res.status, 200);
    const pass = await h.Pass.findById(passId);
    assert.deepEqual([pass.status, pass.passStatus, pass.paymentStatus], ["payment_failed", "inactive", "failed"]);
    assert.equal(pass.seatsReserved, false);
    assert.equal((await h.Event.findById(event._id)).registrationCount, 0);
  });

  test("failed after completed does not downgrade the pass", async () => {
    const { merchantOrderId, passId } = await bookPaid();
    await webhook("checkout.order.completed", merchantOrderId);
    await webhook("checkout.order.failed", merchantOrderId);
    const pass = await h.Pass.findById(passId);
    assert.equal(pass.paymentStatus, "completed");
    assert.equal(pass.status, "active");
  });

  test("late completed after failed: PaymentFailed -> Active, seat re-reserved", async () => {
    const { event, merchantOrderId, passId } = await bookPaid();
    await webhook("checkout.order.failed", merchantOrderId);
    await webhook("checkout.order.completed", merchantOrderId);
    const pass = await h.Pass.findById(passId);
    assert.equal(pass.paymentStatus, "completed");
    assert.equal(pass.seatsReserved, true);
    assert.equal((await h.Event.findById(event._id)).registrationCount, 1);
    // characterization: pass-type counters are not re-reserved, see docs/ARCHITECTURE.md section 1
    const type = (await h.Event.findById(event._id)).passTypes[0];
    assert.equal(type.bookedQuantity, 0);
  });

  test("unknown merchantOrderId -> 500", async () => {
    const res = await webhook("checkout.order.completed", "TKT_missing");
    assert.equal(res.status, 500);
  });

  test("payload without event or merchantOrderId -> 400", async () => {
    const res = await request(h.app)
      .post("/api/payment/webhook")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ foo: 1 }));
    assert.equal(res.status, 400);
  });

  test("the legacy /payment/webhook path behaves the same", async () => {
    const { merchantOrderId, passId } = await bookPaid();
    const res = await request(h.app)
      .post("/payment/webhook")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ event: "checkout.order.completed", payload: { merchantOrderId } }));
    assert.equal(res.status, 200);
    assert.equal((await h.Pass.findById(passId)).paymentStatus, "completed");
  });

  test("characterization: with no webhook credentials configured, anyone can confirm a payment", async () => {
    assert.equal(process.env.PHONEPE_WEBHOOK_USERNAME, "");
    const { merchantOrderId, passId } = await bookPaid();
    const res = await webhook("checkout.order.completed", merchantOrderId); // no Authorization header
    assert.equal(res.status, 200);
    assert.equal((await h.Pass.findById(passId)).paymentStatus, "completed");
  });

  test("characterization: confirmation ignores the paid amount", async () => {
    const { merchantOrderId, passId } = await bookPaid();
    const res = await request(h.app)
      .post("/api/payment/webhook")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ event: "checkout.order.completed", payload: { merchantOrderId, amount: 1 } }));
    assert.equal(res.status, 200);
    assert.equal((await h.Pass.findById(passId)).paymentStatus, "completed");
  });

  test.describe("with credentials configured", () => {
    test.beforeEach(() => {
      process.env.PHONEPE_WEBHOOK_USERNAME = "hook-user";
      process.env.PHONEPE_WEBHOOK_PASSWORD = "hook-pass";
    });
    test.afterEach(() => {
      process.env.PHONEPE_WEBHOOK_USERNAME = "";
      process.env.PHONEPE_WEBHOOK_PASSWORD = "";
    });

    test("missing Authorization -> 401", async () => {
      const { merchantOrderId } = await bookPaid();
      const res = await webhook("checkout.order.completed", merchantOrderId);
      assert.equal(res.status, 401);
      assert.equal(res.body.error, "Authorization header missing");
    });
    test("wrong signature -> 401 and pass untouched", async () => {
      const { merchantOrderId, passId } = await bookPaid();
      const res = await webhook("checkout.order.completed", merchantOrderId, {
        Authorization: "SHA256 " + "0".repeat(64),
      });
      assert.equal(res.status, 401);
      assert.equal((await h.Pass.findById(passId)).paymentStatus, "pending");
    });
    test("SHA256(username:password) signature -> 200", async () => {
      const { merchantOrderId, passId } = await bookPaid();
      const signature = crypto.createHash("sha256").update("hook-user:hook-pass").digest("hex");
      const res = await webhook("checkout.order.completed", merchantOrderId, {
        Authorization: `SHA256 ${signature}`,
      });
      assert.equal(res.status, 200);
      assert.equal((await h.Pass.findById(passId)).paymentStatus, "completed");
    });
  });
});

test.describe("payment callback redirect", () => {
  const callback = (id) => request(h.app).get(`/api/payment/callback/${id}`).redirects(0);

  test("COMPLETED -> 302 /ticket/success and pass confirmed", async () => {
    const { merchantOrderId, passId } = await bookPaid();
    h.phonepe.state = "COMPLETED";
    const res = await callback(merchantOrderId);
    assert.equal(res.status, 302);
    assert.match(res.headers.location, new RegExp(`^http://frontend.test/ticket/success\\?passId=${passId}&uuid=`));
    assert.equal((await h.Pass.findById(passId)).paymentStatus, "completed");
  });
  test("FAILED -> 302 /ticket/failure and pass failed", async () => {
    const { merchantOrderId, passId } = await bookPaid();
    h.phonepe.state = "FAILED";
    const res = await callback(merchantOrderId);
    assert.equal(res.status, 302);
    assert.equal(res.headers.location, `http://frontend.test/ticket/failure?passId=${passId}&orderId=${merchantOrderId}`);
    assert.equal((await h.Pass.findById(passId)).status, "payment_failed");
  });
  test("PENDING -> 302 /ticket/pending, pass untouched", async () => {
    const { merchantOrderId, passId } = await bookPaid();
    const res = await callback(merchantOrderId);
    assert.equal(res.status, 302);
    assert.equal(res.headers.location, `http://frontend.test/ticket/pending?orderId=${merchantOrderId}`);
    assert.equal((await h.Pass.findById(passId)).paymentStatus, "pending");
  });
  test("PhonePe response without a state -> 200 HTML redirect to /ticket/error (a page the Client does not have)", async () => {
    const { merchantOrderId } = await bookPaid();
    h.phonepe.state = "";
    // the app labels every non-multipart response application/json, even this HTML page
    const res = await callback(merchantOrderId).parse((r, cb) => {
      let body = "";
      r.on("data", (chunk) => (body += chunk));
      r.on("end", () => cb(null, body));
    });
    assert.equal(res.status, 200);
    assert.match(res.headers["content-type"], /application\/json/);
    assert.match(res.body, /frontend\.test\/ticket\/error\?reason=/);
  });
});

test.describe("getTicketStatus", () => {
  test("malformed id -> 400, unknown id -> 404", async () => {
    assert.equal((await request(h.app).get("/api/ticket-status/nope")).status, 400);
    const res = await request(h.app).get(`/api/ticket-status/${new h.mongoose.Types.ObjectId()}`);
    assert.equal(res.status, 404);
  });

  test("pending pass is resolved against PhonePe and returns a QR link", async () => {
    const { passId } = await bookPaid();
    h.phonepe.state = "COMPLETED";
    const res = await request(h.app).get(`/api/ticket-status/${passId}`); // no auth header
    assert.equal(res.status, 200);
    assert.equal(res.body.data.pass.paymentStatus, "completed");
    assert.match(res.body.data.qrCode, /^http:\/\/api\.test\/verify-ticket\/[0-9a-f-]{36}$/);
    // characterization: public endpoint returns the owner's contact details
    assert.ok(res.body.data.pass.userId.email);
  });

  test("still pending -> qrCode null", async () => {
    const { passId } = await bookPaid();
    const res = await request(h.app).get(`/api/ticket-status/${passId}`);
    assert.equal(res.body.data.pass.paymentStatus, "pending");
    assert.equal(res.body.data.qrCode, null);
  });
});

test.describe("cleanupExpiredPasses", () => {
  test("expired Pending -> Expired, seat released", async () => {
    const { passId, event } = await bookPaid();
    await h.Pass.updateOne({ _id: passId }, { expiresAt: new Date(Date.now() - 1000) });
    await cleanupExpiredPasses();
    const pass = await h.Pass.findById(passId);
    assert.deepEqual([pass.status, pass.passStatus, pass.paymentStatus], ["expired", "expired", "failed"]);
    assert.equal((await h.Event.findById(event._id)).registrationCount, 0);
  });

  test("unexpired Pending is untouched", async () => {
    const { passId } = await bookPaid();
    await cleanupExpiredPasses();
    assert.equal((await h.Pass.findById(passId)).paymentStatus, "pending");
  });
});

test("characterization: a second unpaid booking fails while another unpaid pass exists (unique qrStrings.id index is not sparse)", async () => {
  const first = await bookPaid();
  const user = await h.makeUser();
  const res = await book(user, { eventId: String(first.event._id) });
  assert.equal(res.status, 500);
  assert.match(res.body.message, /E11000 duplicate key/);
  assert.equal(await h.Pass.countDocuments(), 1);
});
