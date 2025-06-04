import LRU from 'lru-cache';
import mongoose from 'mongoose';
import TenantSchema from '../schema/tenant.js';
import TenantUserSchema from '../schema/tenantUser.js';
import UserSchema from '../schema/users.js';

const clientOptions = {
  socketTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Log MongoDB queries
mongoose.set('debug', true);

// LRU cache for tenant connections
const tenantConnectionCache = new LRU({
  max: 50, // max number of tenant connections cached
  ttl: 1000 * 60 * 60, // 1 hour TTL for cache entries
  dispose: (db, key) => {
    if (db && db.close) {
      db.close()
        .then(() => {
          console.log(`Closed tenant connection for ${key} due to cache eviction.`);
        })
        .catch((err) => {
          console.error(`Error closing tenant connection for ${key}:`, err);
        });
    }
  },
});

let adminConnection = null;

const loadAdminModels = (db) => {
  if (!db.models.tenants) {
    db.model('tenants', TenantSchema);
  }
  if (!db.models.tenantusers) {
    db.model('tenantusers', TenantUserSchema);
  }
};

const loadTenantModels = (db) => {
  if (!db.models.users) {
    db.model('users', UserSchema);
  }
};

/**
 * Initialize or get the admin database connection.
 * @param {string} DB_URL - MongoDB connection string for admin DB.
 * @returns {Promise<mongoose.Connection>} - Mongoose connection instance.
 */
export const getAdminDbConnection = async (DB_URL) => {
  if (adminConnection) {
    return adminConnection;
  }
  try {
    const db = mongoose.createConnection(DB_URL, clientOptions);

    db.on('error', (err) => {
      console.error('Admin db error: ', err);
    });

    await new Promise((resolve, reject) => {
      db.once('open', () => {
        console.log('Admin client MongoDB Connection ok!');
        resolve();
      });
      db.on('error', reject);
    });

    loadAdminModels(db);

    adminConnection = db;
    return adminConnection;
  } catch (error) {
    console.error('Failed to initialize admin DB connection:', error);
    throw error;
  }
};

/**
 * Initialize or get a tenant database connection from cache or create new.
 * @param {string} DB_URL - MongoDB connection string for tenant DB.
 * @param {string} dbName - Tenant database name (used as cache key).
 * @returns {Promise<mongoose.Connection>} - Mongoose connection instance.
 */
export const getTenantDbConnection = async (DB_URL, dbName) => {
  const cacheKey = `${DB_URL}_${dbName}`;
  if (tenantConnectionCache.has(cacheKey)) {
    return tenantConnectionCache.get(cacheKey);
  }
  try {
    const db = mongoose.createConnection(DB_URL, {
      ...clientOptions,
      dbName,
    });

    db.on('error', (err) => {
      console.error(`Tenant ${dbName} db error: `, err);
    });

    await new Promise((resolve, reject) => {
      db.once('open', () => {
        console.log(`Tenant connection for ${dbName} MongoDB Connection ok!`);
        resolve();
      });
      db.on('error', reject);
    });

    loadTenantModels(db);

    tenantConnectionCache.set(cacheKey, db);
    return db;
  } catch (error) {
    console.error(`Failed to initialize tenant DB connection for ${dbName}:`, error);
    throw error;
  }
};
