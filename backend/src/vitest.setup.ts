import * as dotenv from 'dotenv';
import { beforeAll } from 'vitest';
import { resetDatabase } from './tests/testSetup';

dotenv.config({ path: '.env' });

beforeAll(async () => {
  await resetDatabase();
});
