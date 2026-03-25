import http from 'http';
import app, { prisma, redisClient } from './app.js';
import config from './config/index.js';
import { Queue, Worker } from 'bullmq';

const server = http.createServer(app);

async function start() {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    console.warn('Redis connection failed, running without Redis:', error.message);
  }
  
  await prisma.$connect();

  server.listen(config.port, () => {
    console.log(`Server listening in ${config.env} on port ${config.port}`);
    console.log(`Health check available at: http://localhost:${config.port}/health`);
    console.log(`Frontend available at: http://localhost:${config.port}`);
  });

  // background task queue (example) - only if Redis is available
  try {
    if (redisClient.isOpen) {
      const heavyQueue = new Queue('heavy-tasks', { connection: redisClient });

      new Worker('heavy-tasks', async (job) => {
        // placeholder for heavy task implementation
        console.log('Processing job', job.id, job.name);
        return { success: true };
      }, { connection: redisClient });
    }
  } catch (error) {
    console.warn('Queue setup failed, running without background tasks:', error.message);
  }

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

async function shutdown() {
  console.log('Starting graceful shutdown');
  server.close(async () => {
    await prisma.$disconnect();
    try {
      if (redisClient.isOpen) {
        await redisClient.disconnect();
      }
    } catch (error) {
      console.warn('Redis disconnect failed:', error.message);
    }
    console.log('All connections closed. Exiting.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Force shutdown due to timeout');
    process.exit(1);
  }, 10000);
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
