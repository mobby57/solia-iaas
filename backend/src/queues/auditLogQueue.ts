import { Queue } from 'bullmq';
import { redis } from '../config/redis';

export const auditLogQueue = new Queue('auditLogQueue', { connection: redis });
