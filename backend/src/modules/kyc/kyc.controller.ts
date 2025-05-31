import { FastifyReply, FastifyRequest } from 'fastify';
import {
  getKycFieldConfigsByRole,
  createKycFieldConfig,
  updateKycFieldConfig,
  deleteKycFieldConfig,
} from './kyc.service';
import { CreateKycSchema, UpdateKycSchema } from './kyc.schema';

export async function getKycFieldConfigsByRoleController(request: FastifyRequest, reply: FastifyReply) {
  const { roleId } = request.params as any;
  const tenantId = (request as any).tenantId;

  try {
    const configs = await getKycFieldConfigsByRole(roleId, tenantId);
    reply.send(configs);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch KYC field configurations' });
  }
}

export async function createKycFieldConfigController(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const kycData = request.body;

  try {
    const parsed = CreateKycSchema.parse(kycData);
    const created = await createKycFieldConfig(parsed, tenantId);
    reply.status(201).send(created);
  } catch (error) {
    reply.status(400).send({ error: 'Invalid KYC data' });
  }
}

export async function updateKycFieldConfigController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const tenantId = (request as any).tenantId;
  const kycData = request.body;

  try {
    const parsed = UpdateKycSchema.parse(kycData);
    const updated = await updateKycFieldConfig(id, { ...parsed, tenantId });
    reply.send(updated);
  } catch (error) {
    reply.status(400).send({ error: 'Invalid KYC data' });
  }
}

export async function deleteKycFieldConfigController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;

  try {
    await deleteKycFieldConfig(id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete KYC data' });
  }
}

export {
  getKycFieldConfigsByRoleController as getKycFieldConfigsByRole,
  createKycFieldConfigController as createKycFieldConfig,
  updateKycFieldConfigController as updateKycFieldConfig,
  deleteKycFieldConfigController as deleteKycFieldConfig,
};
