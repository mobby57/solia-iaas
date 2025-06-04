import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signJWT, verifyJWT, generateHash, comparePassword } from "./misc.js";

describe("utils/misc.js", () => {
  const testData = { userId: 123, role: "admin" };
  const secret = "random secret";

  it("signJWT should create a valid JWT token", () => {
    const token = signJWT(testData);
    const decoded = jwt.verify(token, secret);
    expect(decoded.userId).toBe(testData.userId);
    expect(decoded.role).toBe(testData.role);
  });

  it("verifyJWT should verify and decode a valid JWT token", () => {
    const token = jwt.sign(testData, secret);
    const decoded = verifyJWT(token);
    expect(decoded.userId).toBe(testData.userId);
    expect(decoded.role).toBe(testData.role);
  });

  it("generateHash should create a hash for a given input", async () => {
    const password = "myPassword123";
    const hash = await generateHash(password);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("comparePassword should return true for matching password and hash", async () => {
    const password = "myPassword123";
    const hash = await bcrypt.hash(password, 10);
    const result = await comparePassword(password, hash);
    expect(result).toBe(true);
  });

  it("comparePassword should return false for non-matching password and hash", async () => {
    const password = "myPassword123";
    const wrongPassword = "wrongPassword";
    const hash = await bcrypt.hash(password, 10);
    const result = await comparePassword(wrongPassword, hash);
    expect(result).toBe(false);
  });

  it("generateHash should throw error on invalid input", async () => {
    await expect(generateHash(null)).rejects.toThrow();
  });

  it("comparePassword should throw error on invalid input", async () => {
    await expect(comparePassword(null, null)).rejects.toThrow();
  });
});
