import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return reply.status(401).send({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return reply.status(401).send({ error: 'Token missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach decoded token to request for further use
    (request as any).user = decoded;
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid or expired token' });
  }
}
