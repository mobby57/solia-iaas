import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    jwtVerify(): Promise<void>;
    user?: {
      role?: string;
      [key: string]: any;
    };
  }
}
