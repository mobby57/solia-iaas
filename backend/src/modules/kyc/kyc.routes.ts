import { FastifyInstance } from 'fastify';
import {
  getKycFieldConfigsByRole,
  createKycFieldConfig,
  updateKycFieldConfig,
  deleteKycFieldConfig,
} from './kyc.controller';

export async function kycRoutes(fastify: FastifyInstance) {
  fastify.get('/kyc/field-configs/role/:roleId', getKycFieldConfigsByRole);

  fastify.post('/kyc/field-configs', createKycFieldConfig);

  fastify.put('/kyc/field-configs/:id', updateKycFieldConfig);

  fastify.delete('/kyc/field-configs/:id', deleteKycFieldConfig);
}
