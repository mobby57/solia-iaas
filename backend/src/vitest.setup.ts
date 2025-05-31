import * as dotenv from 'dotenv';
import { seedBaseData } from '../prisma/seeds/seedBaseData';
import { beforeAll } from 'vitest';

dotenv.config({ path: '.env' });

beforeAll(async () => {
  await seedBaseData();
});
