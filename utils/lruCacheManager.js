import { LRUCache } from "lru-cache";
import { Connection } from "mongoose";

const cacheOptions = {
  max: 5000,
  maxAge: 1000 * 60 * 60,
};

const connectionCache = new LRUCache(cacheOptions);

const setCacheConnection = (tenantId, dbConn) => {
  console.log("Setting connection cache for ", tenantId);
  connectionCache.set(tenantId, dbConn);
};

const getCacheConnection = (tenantId) => {
  return connectionCache.get(tenantId);
};

const getCacheValuesArr = () => {
  return connectionCache.values();
};

export { setCacheConnection, getCacheConnection, getCacheValuesArr };
