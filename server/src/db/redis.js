import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.warn('⚠️ REDIS_URL not found in environment variables. Falling back to redis://127.0.0.1:6379');
}

/**
 * Shared Redis connection instance for BullMQ Queue and Workers.
 * - maxRetriesPerRequest must be set to null as strictly required by BullMQ.
 * - enableReadyCheck: false is recommended for serverless / Upstash Redis connections.
 */
export const redisConnection = new Redis(redisUrl || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisConnection.on('connect', () => {
  console.log('Redis connected successfully!');
});

redisConnection.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

