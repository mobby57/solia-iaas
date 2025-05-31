import dotenv from 'dotenv';

dotenv.config();

interface Env {
  REDIS_URL: string;
  JWT_SECRET: string;
  DATABASE_URL: string;
  STATIC_OUTBOUND_IP_1: string;
  STATIC_OUTBOUND_IP_2: string;
  STATIC_OUTBOUND_IP_3: string;
}

export const env: Env = {
  REDIS_URL: process.env.REDIS_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  STATIC_OUTBOUND_IP_1: process.env.STATIC_OUTBOUND_IP_1 || '',
  STATIC_OUTBOUND_IP_2: process.env.STATIC_OUTBOUND_IP_2 || '',
  STATIC_OUTBOUND_IP_3: process.env.STATIC_OUTBOUND_IP_3 || '',
};
