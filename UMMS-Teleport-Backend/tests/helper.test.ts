import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildJitsiJwt } from "../src/helper/helper.js";
import jwt from "jsonwebtoken";

describe("Helper & JWT Generation Tests", () => {
  test("buildJitsiJwt generates a valid HS256 JWT with correct claims", () => {
    process.env.JITSI_APP_ID = "test-app-id";
    process.env.JITSI_APP_SECRET = "test-app-secret-1234567890";
    process.env.JITSI_DOMAIN = "meet.example.com";

    const token = buildJitsiJwt({
      room: "room-test-101",
      userId: "user-456",
      name: "Dr. Test",
      email: "dr.test@example.com",
      moderator: true,
      affiliation: "owner",
      type: "provider",
    });

    assert.ok(typeof token === "string", "Token must be a string");
    assert.ok(token.split(".").length === 3, "Token must be standard JWT with 3 parts");

    const decoded = jwt.verify(token, "test-app-secret-1234567890") as any;
    assert.equal(decoded.iss, "test-app-id");
    assert.equal(decoded.sub, "meet.example.com");
    assert.equal(decoded.room, "room-test-101");
    assert.equal(decoded.context.user.name, "Dr. Test");
    assert.equal(decoded.context.user.moderator, true);
    assert.equal(decoded.context.user.affiliation, "owner");
    assert.equal(decoded.context.user.type, "provider");
  });

  test("buildJitsiJwt correctly handles non-moderator participants", () => {
    process.env.JITSI_APP_ID = "test-app-id";
    process.env.JITSI_APP_SECRET = "test-app-secret-1234567890";

    const token = buildJitsiJwt({
      room: "room-guest-202",
      userId: "guest-789",
      name: "Family Member",
      moderator: false,
      affiliation: "member",
      type: "family",
    });

    const decoded = jwt.verify(token, "test-app-secret-1234567890") as any;
    assert.equal(decoded.context.user.moderator, false);
    assert.equal(decoded.context.user.affiliation, "member");
    assert.equal(decoded.context.user.type, "family");
  });
});
