import { Worker } from 'bullmq';
import { redis } from '../config/redis';

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    const { donationId, userEmail } = job.data;
    console.log(`📨 Sending email receipt for donation ${donationId} to ${userEmail}`);
    // TODO: add real email sending logic here (e.g. nodemailer, SendGrid)
  },
  { connection: redis },
);

emailWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});
