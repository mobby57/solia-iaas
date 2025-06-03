import { describe, test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { buildApp } from "../index";
import { Server } from "http";

describe("Tenant Routes - Critical Path Tests", () => {
  let server: Server;
  let createdTenantId: any;

  beforeAll(async () => {
    const app = await buildApp();
    server = await new Promise<Server>((resolve, reject) => {
      const s = app.listen({ port: 0 }, () => resolve(s as unknown as Server));
    });
  });

  afterAll(async () => {
    await server.close();
  });

  test("Create a new tenant", async () => {
    const response = await request(server).post("/tenants").send({ name: "Test Tenant" });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Test Tenant");
    createdTenantId = response.body._id;
  });

  test("Get all tenants", async () => {
    const response = await request(server).get("/tenants");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("Get tenant by id", async () => {
    const response = await request(server).get(`/tenants/${createdTenantId}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(createdTenantId);
  });
});
