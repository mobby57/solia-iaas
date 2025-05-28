import dotenv from 'dotenv';

dotenv.config();

export const env = {
  REDIS_URL: process.env.REDIS_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  // add other environment variables as needed
};
