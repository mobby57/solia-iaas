import fastifySwagger from '@fastify/swagger';
import fp from 'fastify-plugin';

export const swaggerPlugin = fp(async (fastify) => {
  fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Solia IaaS API',
        description: 'API documentation for Solia IaaS backend',
        version: '1.0.0',
      },
    },
  });

  // Ensuite, tu dois aussi enregistrer swagger-ui pour exposer la doc :
  // Exemple minimal :
  await fastify.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
});
