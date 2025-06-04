import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    jwtVerify(): Promise<void>;
    readonly user: {
      sub: string;
      tenantId: string;
      roleId: string;
      email: string;
    };
    tenantId?: string;
  }
}
