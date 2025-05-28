import { FastifyReply, FastifyRequest } from 'fastify';
import * as kycService from './kyc.service';
import { CreateKycSchema, UpdateKycSchema } from './kyc.schema';

export async function getKycs(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const kycs = await kycService.getKycs(tenantId);
    reply.send(kycs);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch KYC records' });
  }
}

export async function getKycById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const kyc = await kycService.getKycById(id);
    if (!kyc) {
      reply.status(404).send({ error: 'KYC record not found' });
      return;
    }
    reply.send(kyc);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch KYC record' });
  }
}

export async function createKyc(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const kycData = request.body as any;
  try {
    const kyc = await kycService.createKyc(kycData, tenantId);
    reply.status(201).send(kyc);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create KYC record' });
  }
}

export async function updateKyc(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const kycData = request.body as any;
  try {
    const kyc = await kycService.updateKyc(id, kycData);
    if (!kyc) {
      reply.status(404).send({ error: 'KYC record not found' });
      return;
    }
    reply.send(kyc);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update KYC record' });
  }
}

export async function deleteKyc(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    await kycService.deleteKyc(id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete KYC record' });
  }
}
