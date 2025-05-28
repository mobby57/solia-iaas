import { Worker } from 'bullmq';
import { redis } from '../config/redis';

const cronWorker = new Worker(
  'cronQueue',
  async (job) => {
    console.log('⏰ Running scheduled task:', job.name);
    // TODO: add cron task logic here
  },
  { connection: redis }
);

cronWorker.on('completed', (job) => {
  console.log(`✅ Cron job ${job.id} completed`);
});

cronWorker.on('failed', (job, err) => {
  console.error(`❌ Cron job ${job?.id} failed: ${err.message}`);
});
