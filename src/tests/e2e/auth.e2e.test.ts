import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { orm } from "../../shared/db/orm.js";

describe("Auth E2E", () => {
  beforeAll(async () => {
    const generator = orm.getSchemaGenerator();
    // Recreate test schema from scratch to keep tests deterministic.
    await generator.refreshDatabase();
  });

  afterAll(async () => {
    await orm.close(true);
  });

  it("registers and logs in a cliente account", async () => {
    const unique = Date.now();
    const email = `e2e_${unique}@test.com`;
    const password = "Test123456!";

    const registerResponse = await request(app)
      .post("/api/accounts/register")
      .send({
        email,
        password,
        nombre: "E2E User",
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body?.data?.identifier).toBe(email.toLowerCase());

    const loginResponse = await request(app).post("/api/accounts/login").send({
      identifier: email,
      password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body?.token).toEqual(expect.any(String));
    expect(loginResponse.body?.data?.identifier).toBe(email.toLowerCase());
  });

  it("rejects invalid credentials", async () => {
    const response = await request(app).post("/api/accounts/login").send({
      identifier: "not-found@test.com",
      password: "invalid-password",
    });

    expect(response.status).toBe(401);
  });
});
