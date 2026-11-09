// Test harness. Require this FIRST in every characterization test file: it fixes env,
// starts an in-memory Mongo and exposes the app plus fakes for every outbound call.
const fs = require("node:fs");
const path = require("node:path");
const { after, mock } = require("node:test");

// Every key of .env.example gets a dummy value, so dotenv (which never overrides a set
// variable) cannot load real secrets from Server/.env.
const keys = fs
  .readFileSync(path.resolve(__dirname, "../../.env.example"), "utf8")
  .split("\n")
  .map((line) => line.match(/^([A-Z0-9_]+)=/)?.[1])
  .filter(Boolean);
for (const key of keys) process.env[key] = "";
Object.assign(process.env, {
  NODE_ENV: "test",
  PORT: "0",
  SECRET: "test-secret",
  FRONTEND_URL: "http://frontend.test",
  BASE_URL: "http://api.test",
  GOOGLE_CLIENT_ID: "test-google-client",
  PHONEPE_ENV: "sandbox",
  PHONEPE_CLIENT_ID: "TEST-client-id",
  PHONEPE_CLIENT_SECRET: "test-client-secret",
  PHONEPE_CLIENT_VERSION: "1",
});

const axios = require("axios");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { OAuth2Client } = require("google-auth-library");

// Fake PhonePe. Any axios call that is not recognised throws, so a test can never
// reach the network by accident.
const phonepe = { state: "PENDING", calls: [], createFails: false };
mock.method(axios, "post", async (url) => {
  phonepe.calls.push(["POST", url]);
  if (/oauth|token/i.test(url)) return { data: { access_token: "fake-token" } };
  if (url.endsWith("/checkout/v2/pay")) {
    if (phonepe.createFails) throw new Error("PhonePe unavailable");
    return { data: { orderId: "OMO-FAKE", redirectUrl: "https://pay.test/checkout" } };
  }
  throw new Error(`Unstubbed axios.post: ${url}`);
});
mock.method(axios, "get", async (url) => {
  phonepe.calls.push(["GET", url]);
  if (/\/checkout\/v2\/order\/.+\/status$/.test(url)) {
    return { data: { state: phonepe.state, orderId: "OMO-FAKE", amount: 0 } };
  }
  throw new Error(`Unstubbed axios.get: ${url}`);
});

// Fake Google ID-token verification: token "google:<email>:<name>" is valid.
mock.method(OAuth2Client.prototype, "verifyIdToken", async ({ idToken }) => {
  const [prefix, email, name] = String(idToken).split(":");
  if (prefix !== "google") throw new Error("Invalid token");
  return { getPayload: () => ({ sub: `sub-${email}`, email, name: name || "Test" }) };
});

let mongod;
async function start() {
  mongod = await MongoMemoryServer.create();
  process.env.DB_URL = mongod.getUri("talkeys_test");
  await mongoose.connect(process.env.DB_URL);
  // Hard guard: tests must never touch a remote database.
  if (!["127.0.0.1", "localhost"].includes(mongoose.connection.host)) {
    throw new Error(`Refusing to run against ${mongoose.connection.host}`);
  }
}

async function reset() {
  phonepe.state = "PENDING";
  phonepe.calls.length = 0;
  phonepe.createFails = false;
  await mongoose.connection.dropDatabase();
  await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()));
}

after(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

const User = require("../../src/modules/auth/users.model");
const Event = require("../../src/modules/events/events.model");
const Pass = require("../../src/modules/passes/passes.model");
const Team = require("../../src/modules/teams/teams.model");
const app = require("../../src/app");

let seq = 0;
const tokenFor = (user) => jwt.sign({ email: user.email }, process.env.SECRET);
const authHeader = (user) => ({ Authorization: `Bearer ${tokenFor(user)}` });

async function makeUser(overrides = {}) {
  seq += 1;
  return User.create({
    name: `User ${seq}`,
    email: `user${seq}@test.dev`,
    googleId: `g${seq}`,
    accessToken: "x",
    refreshToken: "y",
    ...overrides,
  });
}

async function makeEvent(overrides = {}) {
  seq += 1;
  return Event.create({
    name: `Event ${seq}`,
    category: "tech",
    mode: "offline",
    duration: 2,
    slots: 1,
    visibility: "public",
    startDate: new Date(Date.now() + 864e5),
    startTime: "10:00",
    startRegistrationDate: new Date(Date.now() - 864e5),
    isRegistrationOpen: true,
    isLive: true,
    totalSeats: 10,
    isPaid: false,
    isTeamEvent: false,
    ticketPrice: 0,
    organizerEmail: "organizer@test.dev",
    ...overrides,
  });
}

module.exports = {
  app, mongoose, phonepe, start, reset, tokenFor, authHeader,
  makeUser, makeEvent, User, Event, Pass, Team,
};
