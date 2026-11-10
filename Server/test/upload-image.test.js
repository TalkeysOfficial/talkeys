// Event image uploads are checked by content, not by the client-sent mimetype or filename.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const request = require("supertest");
const h = require("./helpers/setup");

test.before(h.start);

const uploadsDir = path.resolve(__dirname, "../uploads");

test("rejects a file whose bytes are not an image", async () => {
  const admin = await h.makeUser({ role: "admin" });
  const before = fs.readdirSync(uploadsDir);
  const res = await request(h.app)
    .post("/admin/event-images")
    .set(h.authHeader(admin))
    .attach("image", Buffer.from("<svg onload=alert(1)>"), { filename: "x.png", contentType: "image/png" });
  assert.equal(res.status, 400);
  assert.equal(res.body.message, "Unsupported image type");
  assert.deepEqual(fs.readdirSync(uploadsDir), before);
});

test("stores a real PNG with an extension derived from its bytes", async () => {
  const admin = await h.makeUser({ role: "admin" });
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(16)]);
  const res = await request(h.app)
    .post("/admin/event-images")
    .set(h.authHeader(admin))
    .attach("image", png, { filename: "evil.html", contentType: "image/png" });
  assert.equal(res.status, 201);
  assert.match(res.body.url, /\/uploads\/\d+-[0-9a-f]{16}\.png$/);
  fs.unlinkSync(path.join(uploadsDir, path.basename(res.body.url)));
});
