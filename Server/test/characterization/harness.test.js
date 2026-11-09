const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const h = require("../helpers/setup");

test.before(h.start);
test.beforeEach(h.reset);

test("harness only talks to a local database", () => {
  assert.ok(["127.0.0.1", "localhost"].includes(h.mongoose.connection.host));
  assert.equal(process.env.SECRET, "test-secret");
});

test("GET /getEvents returns seeded events", async () => {
  await h.makeEvent();
  const res = await request(h.app).get("/getEvents");
  assert.equal(res.status, 200);
  assert.equal(res.body.data.events.length, 1);
});

test("POST without a body reaches the handler validation (400), not a 500", async () => {
  const user = await h.makeUser();
  const res = await request(h.app).post("/createTeam").set(h.authHeader(user));
  assert.equal(res.status, 400);
});
