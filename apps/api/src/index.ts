import fastify from 'fastify';
import jwtPlugin from './plugins/jwt';
import { missionRoutes } from './routes/mission';

const app = fastify();

app.register(jwtPlugin);
app.register(missionRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3001');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
