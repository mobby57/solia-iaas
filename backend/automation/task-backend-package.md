# Task Backend Automation Package

This package contains the backend TypeScript code for task management, suitable for automation and integration.

## Included Files

- `src/services/task.service.ts`: Contains the CRUD service functions for tasks using Prisma and MongoDB ObjectId validation.
- `src/routes/task.routes.ts`: Defines the Fastify API routes for task management, including middlewares for tenant, auth, role verification, and audit logging.

## Usage

1. Ensure you have a Fastify server setup.
2. Register the task routes in your Fastify instance:

```typescript
import { taskRoutes } from './src/routes/task.routes';

async function buildServer() {
  const fastify = Fastify();

  // Register task routes
  await taskRoutes(fastify);

  return fastify;
}
```

3. Use the service functions in your business logic or tests as needed.

## Testing

- You can write tests for the service functions in `src/services/task.service.test.ts`.
- Use Fastify's inject method to test the routes.

## Notes

- The service functions expect a `tenantId` parameter for multi-tenant support.
- Role verification middleware restricts create, update, and delete operations to ADMIN roles.
- Error handling is implemented in the routes to return appropriate HTTP status codes.

This package is ready for integration into your backend system for task management automation.
