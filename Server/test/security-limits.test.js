// Origin allow-list and per-IP rate limits in src/app.js.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { app, start } = require("./helpers/setup");

test.before(start);

test("CORS echoes allowed origins and omits the header for others", async () => {
  for (const origin of ["https://www.talkeys.xyz", "https://talkeys.xyz", "http://frontend.test"]) {
    const res = await request(app).options("/getEvents").set("Origin", origin);
    assert.equal(res.headers["access-control-allow-origin"], origin);
  }
  const res = await request(app).options("/getEvents").set("Origin", "https://evil.example");
  assert.equal(res.headers["access-control-allow-origin"], undefined);
});

test("login is limited to 60 requests per minute per client IP", async () => {
  const ip = "203.0.113.7";
  for (let i = 0; i < 60; i++) {
    const res = await request(app).post("/verify").set("X-Forwarded-For", ip);
    assert.notEqual(res.status, 429);
  }
  const limited = await request(app).post("/verify").set("X-Forwarded-For", ip);
  assert.equal(limited.status, 429);
  // Another client behind the same proxy keeps its own budget.
  const other = await request(app).post("/verify").set("X-Forwarded-For", "203.0.113.8");
  assert.notEqual(other.status, 429);
});

test("JSON bodies over 1 MB are rejected before any handler runs", async () => {
  const res = await request(app)
    .post("/verify")
    .set("X-Forwarded-For", "203.0.113.50")
    .set("Content-Type", "application/json")
    .send(JSON.stringify({ pad: "x".repeat(1024 * 1024 + 10) }));
  assert.equal(res.status, 400);
  assert.equal(res.body.status, false);
});
