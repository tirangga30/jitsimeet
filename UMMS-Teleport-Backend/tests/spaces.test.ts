import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { uploadToSpaces, listSpacesFiles } from "../src/services/spaces.service.js";

describe("Spaces Security & File Storage Tests", () => {
  test("uploadToSpaces gracefully handles unconfigured storage and sanitizes filename", async () => {
    const buffer = Buffer.from("fake image bytes");
    const uploaded = await uploadToSpaces(buffer, "patient report@2026!.png", "image/png", "emrs");

    assert.ok(uploaded.key.startsWith("emrs/"), "File must be placed in requested target folder");
    assert.ok(uploaded.name.includes("patient_report_2026_.png"), "Filename must be sanitized without special characters");
    assert.equal(uploaded.size, buffer.byteLength);
    assert.ok(uploaded.url, "URL must be returned");
  });

  test("listSpacesFiles returns empty list for empty folder", async () => {
    const result = await listSpacesFiles("");
    assert.deepEqual(result, []);
  });
});
