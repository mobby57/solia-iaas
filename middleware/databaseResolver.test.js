import { describe, it, expect, vi, beforeEach } from "vitest";
import { databaseResolver } from "./databaseResolver.js";
import * as misc from "../utils/misc.js";
import * as connectionManager from "../utils/connectionManager.js";

describe("databaseResolver middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      url: "/api/resource",
      headers: {},
    };
    res = {};
    next = vi.fn();
  });

  it("should call next immediately for login route", async () => {
    req.url = "/api/login";
    await databaseResolver(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should verify JWT and get connection for tenant, then attach dbConnection to req", async () => {
    const fakePayload = { tenantId: "tenant123" };
    const fakeConnection = { id: "dbConnection" };

    vi.spyOn(misc, "verifyJWT").mockReturnValue(fakePayload);
    vi.spyOn(connectionManager, "getConnectionForTenant").mockReturnValue(fakeConnection);

    req.headers.jwt = "valid.jwt.token";

    await databaseResolver(req, res, next);

    expect(misc.verifyJWT).toHaveBeenCalledWith("valid.jwt.token");
    expect(connectionManager.getConnectionForTenant).toHaveBeenCalledWith("tenant123");
    expect(req.dbConnection).toBe(fakeConnection);
    expect(next).toHaveBeenCalled();
  });

  it("should handle missing JWT token gracefully", async () => {
    req.headers.jwt = undefined;
    vi.spyOn(misc, "verifyJWT").mockImplementation(() => {
      throw new Error("No token provided");
    });

    try {
      await databaseResolver(req, res, next);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("No token provided");
    }
  });

  it("should handle invalid JWT token gracefully", async () => {
    req.headers.jwt = "invalid.token";
    vi.spyOn(misc, "verifyJWT").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    try {
      await databaseResolver(req, res, next);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe("Invalid token");
    }
  });
});
