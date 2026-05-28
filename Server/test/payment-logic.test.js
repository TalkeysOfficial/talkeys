const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");

const { _test } = require("../src/controllers/passes.controller");

test("PhonePe test credentials default to sandbox endpoints", () => {
  const previousEnv = process.env.PHONEPE_ENV;
  const previousClientId = process.env.PHONEPE_CLIENT_ID;

  delete process.env.PHONEPE_ENV;
  process.env.PHONEPE_CLIENT_ID = "TEST-client-id";

  assert.equal(
    _test.getPhonePeConfig().BASE_URL,
    "https://api-preprod.phonepe.com/apis/pg-sandbox",
  );

  process.env.PHONEPE_ENV = previousEnv;
  process.env.PHONEPE_CLIENT_ID = previousClientId;
});

test("explicit production PhonePe env uses production endpoints without whitespace", () => {
  const previousEnv = process.env.PHONEPE_ENV;

  process.env.PHONEPE_ENV = "production";

  assert.equal(
    _test.getPhonePeConfig().BASE_URL,
    "https://api.phonepe.com/apis/pg",
  );

  process.env.PHONEPE_ENV = previousEnv;
});

test("PhonePe credentials are trimmed and can explicitly decode base64 secrets", () => {
  const previousClientId = process.env.PHONEPE_CLIENT_ID;
  const previousClientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const previousClientSecretEncoding = process.env.PHONEPE_CLIENT_SECRET_ENCODING;
  const previousClientVersion = process.env.PHONEPE_CLIENT_VERSION;

  process.env.PHONEPE_CLIENT_ID = ' "TEST-client-id" ';
  process.env.PHONEPE_CLIENT_SECRET = Buffer.from("secret-value").toString("base64");
  process.env.PHONEPE_CLIENT_SECRET_ENCODING = "base64";
  process.env.PHONEPE_CLIENT_VERSION = " 2 ";

  const credentials = _test.getPhonePeCredentials();

  assert.equal(credentials.clientId, "TEST-client-id");
  assert.equal(credentials.clientSecret, "secret-value");
  assert.equal(credentials.clientVersion, "2");

  process.env.PHONEPE_CLIENT_ID = previousClientId;
  process.env.PHONEPE_CLIENT_SECRET = previousClientSecret;
  process.env.PHONEPE_CLIENT_SECRET_ENCODING = previousClientSecretEncoding;
  process.env.PHONEPE_CLIENT_VERSION = previousClientVersion;
});

test("friend list is capped and normalized", () => {
  const friends = Array.from({ length: 12 }, (_, index) => ({
    name: index === 0 ? "" : `Friend ${index}`,
    email: `friend${index}@example.com`,
  }));

  const sanitized = _test.sanitizeFriends(friends);

  assert.equal(sanitized.length, 9);
  assert.equal(sanitized[0].name, "Friend");
  assert.equal(sanitized[8].email, "friend8@example.com");
});

test("basic-pass gated events come from env configuration", () => {
  const previousEventIds = process.env.BASIC_PASS_REQUIRED_EVENT_IDS;

  process.env.BASIC_PASS_REQUIRED_EVENT_IDS = " event-a, event-b ,, ";

  assert.deepEqual(_test.basicPassRequiredEventIds(), ["event-a", "event-b"]);

  process.env.BASIC_PASS_REQUIRED_EVENT_IDS = previousEventIds;
});

test("QR strings are generated for buyer and friends as unscanned entries", () => {
  const qrStrings = _test.buildQRStrings(
    { name: "Buyer" },
    [{ name: "A" }, { name: "B" }],
  );

  assert.equal(qrStrings.length, 3);
  assert.equal(qrStrings[0].personName, "Buyer");
  assert.equal(qrStrings[1].personType, "friend");
  assert.equal(qrStrings[2].qrScanned, false);
  assert.match(qrStrings[0].id, /^[0-9a-f-]{36}$/);
});

test("PhonePe status normalizer supports wrapped and top-level responses", () => {
  assert.deepEqual(
    _test.normalizePhonePeStatus({
      data: { state: "COMPLETED", orderId: "order-1", amount: 1000 },
    }),
    {
      state: "COMPLETED",
      orderId: "order-1",
      amount: 1000,
      paymentDetails: [],
      reason: undefined,
    },
  );

  assert.equal(
    _test.normalizePhonePeStatus({ state: "FAILED", reason: "DECLINED" }).reason,
    "DECLINED",
  );
});

test("webhook signature uses SHA256 username:password", () => {
  const signature = crypto
    .createHash("sha256")
    .update("ritesh:ritesh123")
    .digest("hex");

  assert.equal(
    _test.validateWebhookSignature("ritesh", "ritesh123", signature),
    true,
  );
  assert.equal(
    _test.validateWebhookSignature("ritesh", "ritesh123", "bad-signature"),
    false,
  );
});
