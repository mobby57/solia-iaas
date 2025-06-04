import { FastifyRequest, FastifyReply } from 'fastify';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Extend FastifyRequest interface to include user property
declare module 'fastify' {
  interface FastifyRequest {
    readonly user?: string | JwtPayload;
  }
}

type NewType = FastifyRequest;

export default async function verifyJWT(request: NewType, reply: fastify.FastifyReply) {
  try {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return reply.status(401).send({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return reply.status(401).send({ error: 'Token missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as string | JwtPayload;
    // Attach decoded token to request for further use
    (request as any).user = decoded;
  } catch (_error) {
    return reply.status(401).send({ error: 'Invalid or expired token' });
  }
}
