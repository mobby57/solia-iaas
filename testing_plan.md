# Testing Failures and Prisma Errors Fix Plan

## Information Gathered
- Test failures in auth.routes.test.ts, task.service.test.ts, donation.test.ts, and others.
- Prisma errors related to missing Role records, lock timeouts, and invalid ObjectId placeholders.
- auth.routes.test.ts uses signupController and loginController directly, which differ from actual routes using signup and login services.
- signup service creates organization and user with roleId and tenantId, but test and route use default or test roleId/tenantId strings that may not exist in DB.
- Prisma schema expects ObjectId strings for roleId and tenantId, but seed data and tests use string IDs inconsistently.
- seedBaseData.ts seeds roles with names and tenantId 'default-tenant', but no explicit IDs.
- seedUsers.ts seeds users with role IDs like 'OPERATOR', 'MANAGER' which do not match seeded roles.
- Tests use placeholder or non-existent roleId and tenantId values.
- Missing input validation in controllers/routes causes 500 errors on missing fields.
- Hook timeouts and long-running tests indicate possible test setup or seeding issues.

## Plan

### 1. Standardize Role and Tenant IDs
- Update seedBaseData.ts to create roles with explicit IDs matching those used in tests and seedUsers.ts.
- Ensure tenantId values are consistent across seed data, routes, and tests (e.g., use 'default-tenant' everywhere).
- Seed tenants explicitly if needed.

### 2. Update Seed Data
- Modify seedUsers.ts to use role IDs and tenant IDs consistent with seedBaseData.ts.
- Add seeding for tenants if missing.
- Ensure organization seeding uses consistent tenantId.

### 3. Modify Tests
- Update auth.routes.test.ts and other tests to use seeded roleId and tenantId values.
- Replace placeholder IDs with valid seeded IDs.
- Use signup and login routes or services consistently in tests.
- Add input validation tests for missing fields.

### 4. Add Input Validation
- Add validation middleware or logic in routes/controllers to check required fields.
- Return 400 status code for missing or invalid inputs to prevent 500 errors.

### 5. Fix Prisma Lock Timeout and Concurrency Issues
- Ensure seeding scripts are not run concurrently.
- Add retries or delays if needed.
- Investigate database locking issues.

### 6. Fix Hook Timeouts
- Increase test hook timeouts where necessary.
- Optimize test setup and teardown.
- Mock external dependencies if needed.

### 7. Fix Invalid ObjectId Errors
- Replace placeholder IDs in tests with valid ObjectId strings or seeded IDs.
- Validate ObjectId format in tests.

## Dependent Files to Edit
- solia/backend/prisma/seeds/seedBaseData.ts
- solia/backend/prisma/seeds/seedUsers.ts
- solia/backend/src/routes/__tests__/auth.routes.test.ts
- solia/backend/src/routes/__tests__/auth.login.test.ts
- solia/backend/src/services/auth.ts
- solia/backend/src/controllers/authController.ts (for validation)
- Possibly other test files with invalid IDs

## Followup Steps
- Run seed scripts to populate database with consistent data.
- Run tests to verify fixes.
- Adjust timeouts and mocks as needed.
- Review and refactor code for consistency.

Please confirm if you approve this plan or have any feedback.
