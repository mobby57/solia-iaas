import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    jwtVerify(): Promise<void>;
    user: {
      sub: string;
      tenantId: string;
      roleId: string;
      email: string;
    };
    tenantId?: string;
  }
}
