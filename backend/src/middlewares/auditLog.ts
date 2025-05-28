import { FastifyReply, FastifyRequest } from 'fastify';

export async function auditLog(request: FastifyRequest, reply: FastifyReply) {
  const { method, url, headers, body } = request;
  const user = (request as any).user || null; // Assuming user info is attached to request

  // Log audit information - in real app, save to DB or external service
  console.log(`[AuditLog] User: ${user ? user.email : 'Anonymous'}, Method: ${method}, URL: ${url}, Body: ${JSON.stringify(body)}`);

  // Continue to next middleware or route handler
}
