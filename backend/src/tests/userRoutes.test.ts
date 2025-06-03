/// <reference types="vitest" />
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import userRoutes from "../routes/userRoutes";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

describe("User Routes - Critical Path Tests", () => {
  let server: any;
  let createdUserId: any;

  beforeAll(async () => {
    // increase timeout to 30 seconds for long running hook
    await new Promise((resolve) => setTimeout(resolve, 100)); // small delay to avoid race conditions
    try {
      await mongoose.connect(process.env.TEST_DB_URI || "mongodb://localhost:27017/testdb", { serverSelectionTimeoutMS: 30000 });
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
    server = app.listen(4002);
  }, 30000);

  afterAll(async () => {
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.dropDatabase();
      }
    } catch (error) {
      console.error("Failed to drop database:", error);
    }
    await mongoose.disconnect();
    if (server) {
      server.close();
    }
  }, 30000);

  test("POST /users - create user", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "TestUser", email: "testuser@example.com" });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.name).toBe("TestUser");
    createdUserId = response.body._id;
  });

  test("GET /users - get all users", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("GET /users/:id - get user by id", async () => {
    const response = await request(app).get(`/users/${createdUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", createdUserId);
  });

  test("PUT /users/:id - update user by id", async () => {
    const response = await request(app)
      .put(`/users/${createdUserId}`)
      .send({ name: "UpdatedUser" });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("UpdatedUser");
  });

  test("DELETE /users/:id - delete user by id", async () => {
    const response = await request(app).delete(`/users/${createdUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User deleted");
  });

  test("GET /users/:id - get deleted user returns 404", async () => {
    const response = await request(app).get(`/users/${createdUserId}`);
    expect(response.status).toBe(404);
  });
});
