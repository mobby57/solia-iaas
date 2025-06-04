import Fastify from 'fastify';
import fastifySwagger from '../plugins/swagger';
import { graphqlPlugin } from './graphql/graphqlPlugin';
import { verifyJWT } from './middlewares/verifyJWT';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user.routes';

const server = Fastify({
  logger: true,
});

// Register Swagger plugin
server.register(fastifySwagger);

// Register JWT verification middleware globally
server.addHook('preHandler', verifyJWT);

// Register REST routes
server.register(authRoutes, { prefix: '/auth' });
server.register(userRoutes, { prefix: '/users' });

// Register GraphQL plugin
server.register(graphqlPlugin, { prefix: '/graphql' });

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.log.info('Server listening on http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

export default server;
