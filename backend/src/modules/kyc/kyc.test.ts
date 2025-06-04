import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import prisma from '../../lib/prisma';
import { cleanDatabase, disconnectDatabase } from '../../tests/testSetup';
import {
  getKycFieldConfigsByRole,
  createKycFieldConfig,
  updateKycFieldConfig,
  deleteKycFieldConfig,
} from './kyc.service';

let roleId: string;
const tenantId = '507f1f77bcf86cd799439011';

describe('KYC Field Config Service', () => {
  beforeEach(async () => {
    await cleanDatabase();

    // Create a role for relation
    const role = await prisma.role.create({
      data: {
        name: 'Test Role',
        tenantId,
      },
    });
    roleId = role.id;
  });

  afterAll(async () => {
    await cleanDatabase();
    await disconnectDatabase();
  });

  it('should create a KYC field config', async () => {
    const data = {
      roleId,
      fieldName: 'idNumber',
      fieldType: 'string',
      required: true,
      options: null,
    };
    const created = await createKycFieldConfig(data, tenantId);
    expect(created).toBeDefined();
    expect(created.fieldName).toBe('idNumber');
  });

  it('should get KYC field configs by role', async () => {
    await createKycFieldConfig(
      {
        roleId,
        fieldName: 'idNumber',
        fieldType: 'string',
        required: true,
        options: null,
      },
      tenantId,
    );

    const configs = await getKycFieldConfigsByRole(roleId, tenantId);
    expect(configs.length).toBeGreaterThan(0);
  });

  it('should update a KYC field config', async () => {
    const created = await createKycFieldConfig(
      {
        roleId,
        fieldName: 'idNumber',
        fieldType: 'string',
        required: true,
        options: null,
      },
      tenantId,
    );

    const updated = await updateKycFieldConfig(created.id, {
      fieldName: 'passportNumber',
      required: false,
    });
    expect(updated.fieldName).toBe('passportNumber');
    expect(updated.required).toBe(false);
  });

  it('should delete a KYC field config', async () => {
    const created = await createKycFieldConfig(
      {
        roleId,
        fieldName: 'idNumber',
        fieldType: 'string',
        required: true,
        options: null,
      },
      tenantId,
    );

    await deleteKycFieldConfig(created.id);
    const found = await prisma.kYCFieldConfig.findUnique({ where: { id: created.id } });
    expect(found).toBeNull();
  });
});
