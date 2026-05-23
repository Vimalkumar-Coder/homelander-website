import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";
import { createApp } from "./app.js";

function createTestApp(overrides = {}) {
  return createApp({
    saveChurchMember: async () => {},
    saveCitizenComplaint: async () => {},
    ...overrides
  });
}

test("health route reports readiness", async () => {
  const response = await request(createTestApp()).get("/api/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: "ready" });
});

test("church membership route rejects incomplete pledges", async () => {
  const response = await request(createTestApp())
    .post("/api/church-members")
    .send({
      fullName: "A",
      email: "invalid",
      country: "",
      loyaltyMessage: "short"
    });

  assert.equal(response.status, 422);
  assert.ok(response.body.fields.fullName);
  assert.ok(response.body.fields.email);
  assert.ok(response.body.fields.country);
  assert.ok(response.body.fields.loyaltyMessage);
});

test("church membership route stores sanitized data", async () => {
  let storedMember;
  const response = await request(
    createTestApp({
      saveChurchMember: async (member) => {
        storedMember = member;
      }
    })
  )
    .post("/api/church-members")
    .send({
      fullName: "  Jane Citizen  ",
      email: "  JANE@EXAMPLE.COM ",
      country: " United States ",
      loyaltyMessage: " I stand ready for the next broadcast. "
    });

  assert.equal(response.status, 201);
  assert.deepEqual(storedMember, {
    fullName: "Jane Citizen",
    email: "jane@example.com",
    country: "United States",
    loyaltyMessage: "I stand ready for the next broadcast."
  });
});

test("complaint route forwards validated reports", async () => {
  let storedComplaint;
  const response = await request(
    createTestApp({
      saveCitizenComplaint: async (complaint) => {
        storedComplaint = complaint;
      }
    })
  )
    .post("/api/citizen-complaints")
    .send({
      fullName: "John Witness",
      email: "john@example.com",
      location: "Brooklyn, New York",
      complaintDescription:
        "A hostile drone crossed the avenue and endangered the morning commute."
    });

  assert.equal(response.status, 201);
  assert.equal(storedComplaint.location, "Brooklyn, New York");
});

