import { Queue } from 'bullmq';
import { redisConnection } from '../db/redis.js';
import { MEETING_QUEUE_NAME } from '../constants.js';

/**
 * BullMQ Queue: meeting-extraction
 *
 * Configured with production-grade retry logic:
 * - 3 retry attempts with exponential backoff for transient AI network failures
 * - Automatic retention of recent jobs for debugging and metrics
 */
export const meetingQueue = new Queue(MEETING_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // Waits 2s, then 4s, then 8s
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
      count: 200, // Keep last 200 failed jobs for debugging
    },
  },
});

/**
 * Helper to dispatch an extraction job to the queue
 */
export const addMeetingJob = async ({ mongoJobId, userId, title, notes }) => {
  return await meetingQueue.add('extract-meeting-notes', {
    mongoJobId,
    userId,
    title,
    notes,
  });
};

