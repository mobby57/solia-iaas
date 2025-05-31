"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBaseData = seedBaseData;
const prisma_1 = __importDefault(require("../../src/lib/prisma"));
/**
 * Seed base data required for tests, such as Roles and Organizations.
 */
async function seedBaseData() {
    // Create default roles if not exist
    const roles = ['admin', 'donor', 'user', 'operator', 'manager', 'association'];
    for (const roleName of roles) {
        const existingRole = await prisma_1.default.role.findUnique({ where: { name: roleName } });
        if (!existingRole) {
            await prisma_1.default.role.create({ data: { name: roleName, tenantId: 'default-tenant' } });
        }
    }
    // Create a default organization if none exists
    const orgCount = await prisma_1.default.organization.count();
    if (orgCount === 0) {
        await prisma_1.default.organization.create({
            data: {
                name: 'Default Org',
                tenantId: 'default-tenant',
            },
        });
    }
}
