import * as dotenv from 'dotenv';
import { resetDatabase } from './tests/testSetup';
import { beforeAll } from 'vitest';

dotenv.config({ path: '.env' });

beforeAll(async () => {
  await resetDatabase();
});
