import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'Solia IaaS API',
        description:
          'API pour la gestion du fundraising (multi-tenant, utilisateurs, missions, dons, etc.)',
        version: '1.0.0',
        contact: {
          name: 'Équipe Solia',
          url: 'https://solia.io',
          email: 'support@solia.io',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Développement local',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string', format: 'email' },
              password: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              role: { type: 'string', enum: ['operator', 'manager', 'donor', 'organization'] },
              kyc: { type: 'object', additionalProperties: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              tenantId: { type: 'string' },
            },
            required: [
              'id',
              'email',
              'password',
              'firstName',
              'lastName',
              'role',
              'createdAt',
              'updatedAt',
              'tenantId',
            ],
          },
          Organization: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              email: { type: 'string', format: 'email' },
              phone: { type: 'string' },
              website: { type: 'string' },
              address: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              tenantId: { type: 'string' },
            },
            required: ['id', 'name', 'email', 'createdAt', 'updatedAt', 'tenantId'],
          },
          Donation: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              amount: { type: 'number' },
              method: { type: 'string', enum: ['cash', 'credit_card', 'bank_transfer'] },
              donorId: { type: 'string' },
              operatorId: { type: 'string' },
              missionId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              tenantId: { type: 'string' },
            },
            required: [
              'id',
              'amount',
              'method',
              'donorId',
              'operatorId',
              'missionId',
              'createdAt',
              'updatedAt',
              'tenantId',
            ],
          },
          Mission: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              startDate: { type: 'string', format: 'date-time' },
              endDate: { type: 'string', format: 'date-time' },
              status: { type: 'string', enum: ['pending', 'active', 'completed'] },
              organizationId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              tenantId: { type: 'string' },
            },
            required: [
              'id',
              'name',
              'startDate',
              'endDate',
              'status',
              'organizationId',
              'createdAt',
              'updatedAt',
              'tenantId',
            ],
          },
          Task: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              assignedTo: { type: 'string' },
              dueDate: { type: 'string', format: 'date-time' },
              status: { type: 'string', enum: ['todo', 'in_progress', 'done'] },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              tenantId: { type: 'string' },
            },
            required: [
              'id',
              'title',
              'assignedTo',
              'dueDate',
              'status',
              'createdAt',
              'updatedAt',
              'tenantId',
            ],
          },
          Comment: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              content: { type: 'string' },
              authorId: { type: 'string' },
              targetType: { type: 'string', enum: ['user', 'donation', 'task', 'mission'] },
              targetId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              tenantId: { type: 'string' },
            },
            required: [
              'id',
              'content',
              'authorId',
              'targetType',
              'targetId',
              'createdAt',
              'updatedAt',
              'tenantId',
            ],
          },
          Tag: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              color: { type: 'string' },
              targetType: { type: 'string', enum: ['user', 'donation', 'task', 'mission'] },
              targetId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              tenantId: { type: 'string' },
            },
            required: [
              'id',
              'name',
              'targetType',
              'targetId',
              'createdAt',
              'updatedAt',
              'tenantId',
            ],
          },
        },
      },
      security: [{ bearerAuth: [] }],
      tags: [
        { name: 'Users', description: 'Gestion des utilisateurs' },
        { name: 'Organizations', description: 'Gestion des organisations' },
        { name: 'Donations', description: 'Gestion des dons' },
        { name: 'Missions', description: 'Gestion des missions' },
        { name: 'Tasks', description: 'Gestion des tâches' },
        { name: 'Comments', description: 'Gestion des commentaires' },
        { name: 'Tags', description: 'Gestion des tags' },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: true,
    },
  });
});
