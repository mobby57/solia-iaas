import request from "supertest";
import express from "express";
import tenantUserRoutes from "../routes/tenantUserRoutes.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use("/tenantusers", tenantUserRoutes);

describe("TenantUser Routes - Critical Path Tests", () => {
  let server;
  let createdTenantUserId;

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_URI || "mongodb://localhost:27017/testdb");
    server = app.listen(4003);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    server.close();
  });

  test("POST /tenantusers - create tenant user", async () => {
    const response = await request(app)
      .post("/tenantusers")
      .send({ tenantId: new mongoose.Types.ObjectId(), userId: new mongoose.Types.ObjectId(), role: "admin" });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    createdTenantUserId = response.body._id;
  });

  test("GET /tenantusers - get all tenant users", async () => {
    const response = await request(app).get("/tenantusers");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("GET /tenantusers/:id - get tenant user by id", async () => {
    const response = await request(app).get(`/tenantusers/${createdTenantUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", createdTenantUserId);
  });

  test("PUT /tenantusers/:id - update tenant user by id", async () => {
    const response = await request(app)
      .put(`/tenantusers/${createdTenantUserId}`)
      .send({ role: "user" });
    expect(response.status).toBe(200);
    expect(response.body.role).toBe("user");
  });

  test("DELETE /tenantusers/:id - delete tenant user by id", async () => {
    const response = await request(app).delete(`/tenantusers/${createdTenantUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Tenant user deleted");
  });

  test("GET /tenantusers/:id - get deleted tenant user returns 404", async () => {
    const response = await request(app).get(`/tenantusers/${createdTenantUserId}`);
    expect(response.status).toBe(404);
  });
});
