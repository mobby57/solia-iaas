# Solia IaaS Backend Route Demo Instructions

## Running the Backend

1. Ensure you have Node.js and npm installed.

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

- Copy `.env` or `.env.example` to `.env` and configure database connection, JWT secret, and other variables.

4. Run database migrations and seed data (if applicable):

```bash
npx prisma migrate deploy
npx prisma db seed
```

5. Start the backend server:

```bash
npm run dev
```

The backend server will start on `http://localhost:3000`.

## Accessing Swagger UI

- Open your browser and navigate to:

```
http://localhost:3000/docs
```

- This will display the Swagger UI with all documented API routes, schemas, and authentication methods.

- **Troubleshooting:** If you get a 404 Not Found error on `/docs`, please verify:
  - The dependencies `@fastify/swagger` and `@fastify/swagger-ui` are installed.
  - The backend server logs for any errors during startup.
  - The swagger plugin is properly registered in `src/index.ts`.
  - Restart the backend server after any changes.

## Running Tests

- To run route tests, use:

```bash
npm run test
```

- This will execute tests in `src/routes/__tests__/` including user and auth route tests.

## Using the Postman Collection

- Import the Postman collection file located at:

```
solia/backend/solia-iaas-postman-collection.json
```

- Use the environment variables defined in the collection for base URL, tokens, tenant IDs, and roles.

- Follow the API flows for ONG, Auto-entrepreneur, Donor, and Admin roles as defined in the collection.

---

For any questions or issues, please contact the Solia development team.
- Import the Postman collection file located at:

npm install
