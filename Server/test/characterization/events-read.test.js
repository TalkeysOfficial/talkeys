// Pins the success bodies of event reads before they move into events.service.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const h = require("../helpers/setup");

test.before(h.start);
test.beforeEach(h.reset);

const as = (user) => ({ Authorization: h.authHeader(user).Authorization });

test("getEventById returns the decorated event", async () => {
  const event = await h.makeEvent({ totalSeats: 10 });
  const res = await request(h.app).get(`/getEventById/${event._id}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.data.availableSeats, 10);
  assert.equal(res.body.data.likes, 0);
  assert.ok(Array.isArray(res.body.data.passTypes));
  assert.equal(typeof res.body.data.minTicketPrice, "number");
  assert.equal(typeof res.body.data.status, "string");
});

test("admin event list returns decorated events with pagination", async () => {
  const admin = await h.makeUser({ role: "admin" });
  await h.makeEvent();
  const res = await request(h.app).get("/admin/events").set(as(admin));
  assert.equal(res.status, 200);
  assert.equal(res.body.data.events.length, 1);
  const [first] = res.body.data.events;
  assert.equal(first.likes, 0);
  assert.ok(Array.isArray(first.passTypes));
  assert.equal(typeof first.minTicketPrice, "number");
  assert.deepEqual(res.body.data.pagination, { total: 1, page: 1, pages: 1, limit: 200 });
});
