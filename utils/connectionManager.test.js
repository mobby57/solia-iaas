import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import * as connectionManager from "./connectionManager.js";
import * as lruCacheManager from "./lruCacheManager.js";
import * as tenantRepo from "../repositories/tenant.js";

vi.mock("./initDBConnection.js", () => ({
  initAdminDbConnection: vi.fn(),
  initTenantDBConnection: vi.fn(),
}));

import { initAdminDbConnection, initTenantDBConnection } from "./initDBConnection.js";

describe("connectionManager", () => {
  let adminDbConnectionMock;
  let tenantConnectionMock;
  let tenantListMock;

  beforeEach(() => {
    adminDbConnectionMock = { close: vi.fn() };
    tenantConnectionMock = { close: vi.fn() };
    tenantListMock = [
      { _id: "tenant1", name: "Tenant One", dbUri: "uri1" },
      { _id: "tenant2", name: "Tenant Two", dbUri: "uri2" },
    ];

    vi.clearAllMocks();

    initAdminDbConnection.mockResolvedValue(adminDbConnectionMock);
    initTenantDBConnection.mockResolvedValue(tenantConnectionMock);

    vi.spyOn(tenantRepo, "getTenantsRepo").mockResolvedValue(tenantListMock);
    vi.spyOn(tenantRepo, "getATenantRepo").mockImplementation((dbConn, { _id }) => {
      const tenant = tenantListMock.find(t => t._id === _id);
      return Promise.resolve(tenant || null);
    });

    vi.spyOn(lruCacheManager, "setCacheConnection").mockImplementation(() => {});
    vi.spyOn(lruCacheManager, "getCacheConnection").mockImplementation(() => null);
    vi.spyOn(lruCacheManager, "getCacheValuesArr").mockImplementation(() => []);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("connectAllDb initializes admin and tenant connections and caches them", async () => {
    await connectionManager.connectAllDb();

    expect(initAdminDbConnection).toHaveBeenCalledWith("your admin db uri");
    expect(tenantRepo.getTenantsRepo).toHaveBeenCalledWith(adminDbConnectionMock, { name: 1, dbUri: 1, _id: 1 });
    expect(initTenantDBConnection).toHaveBeenCalledTimes(tenantListMock.length);
    expect(lruCacheManager.setCacheConnection).toHaveBeenCalledTimes(tenantListMock.length);
  });

  it("getConnectionForTenant returns cached connection if available", async () => {
    const cachedConnection = { id: "cached" };
    lruCacheManager.getCacheConnection.mockReturnValueOnce(cachedConnection);

    const connection = await connectionManager.getConnectionForTenant("tenant1");

    expect(lruCacheManager.getCacheConnection).toHaveBeenCalledWith("tenant1");
    expect(connection).toBe(cachedConnection);
  });

  it("getConnectionForTenant fetches tenant data and caches connection on cache miss", async () => {
    lruCacheManager.getCacheConnection.mockReturnValueOnce(null);
    initTenantDBConnection.mockResolvedValueOnce(tenantConnectionMock);

    // Set adminDbConnection mock using setter
    connectionManager.setAdminDbConnection(adminDbConnectionMock);

    const connection = await connectionManager.getConnectionForTenant("tenant1");

    expect(lruCacheManager.getCacheConnection).toHaveBeenCalledWith("tenant1");
    expect(tenantRepo.getATenantRepo).toHaveBeenCalledWith(connectionManager.getAdminConnection(), { _id: "tenant1" }, { dbUri: 1, name: 1 });
    expect(initTenantDBConnection).toHaveBeenCalledWith("uri1", "Tenant One");
    expect(connection).toBe(tenantConnectionMock);
  });

  it("getConnectionForTenant returns null if tenant data not found", async () => {
    lruCacheManager.getCacheConnection.mockReturnValueOnce(null);
    vi.spyOn(tenantRepo, "getATenantRepo").mockResolvedValueOnce(null);

    const connection = await connectionManager.getConnectionForTenant("unknownTenant");

    expect(connection).toBeNull();
  });

  it("getAdminConnection returns the adminDbConnection", () => {
    // Set adminDbConnection mock using setter
    connectionManager.setAdminDbConnection(adminDbConnectionMock);

    const adminConn = connectionManager.getAdminConnection();
    expect(adminConn).toBe(adminDbConnectionMock);
  });

  it("gracefulShutdown closes all tenant and admin connections", async () => {
    const tenantConn1 = { close: vi.fn() };
    const tenantConn2 = { close: vi.fn() };
    lruCacheManager.getCacheValuesArr.mockReturnValue([tenantConn1, tenantConn2]);

    // Set adminDbConnection mock using setter
    connectionManager.setAdminDbConnection(adminDbConnectionMock);

    // Call exported gracefulShutdown directly
    await connectionManager.gracefulShutdown();

    // Test the close calls manually:
    for (const conn of [tenantConn1, tenantConn2]) {
      expect(conn.close).toHaveBeenCalled();
    }
    expect(adminDbConnectionMock.close).toHaveBeenCalled();
  });
});
