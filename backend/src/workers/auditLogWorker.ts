import { Worker } from 'bullmq';
import { redis } from '../config/redis';

const auditLogWorker = new Worker(
  'auditLogQueue',
  async (job) => {
    const { logEntry } = job.data;
    console.log(`📝 Processing audit log: ${JSON.stringify(logEntry)}`);
    // TODO: add real audit log processing here (e.g. save to DB)
  },
  { connection: redis },
);

auditLogWorker.on('completed', (job) => {
  console.log(`✅ Audit log job ${job.id} completed`);
});

auditLogWorker.on('failed', (job, err) => {
  console.error(`❌ Audit log job ${job?.id} failed: ${err.message}`);
});
