import { Worker } from 'bullmq';
import { redisConnection } from '../db/redis.js';
import { MEETING_QUEUE_NAME } from '../constants.js';
import { Job } from '../models/job.model.js';
import { Meeting } from '../models/meeting.model.js';
import { Item } from '../models/item.model.js';
import { extractMeetingInsights } from '../services/ai.service.js';

/**
 * BullMQ Worker: Processes meeting extraction jobs asynchronously in the background.
 *
 * Lifecycle of a Job:
 * 1. Pull job from Redis
 * 2. Set Job status to 'processing' in MongoDB
 * 3. Call Google Gemini AI Service
 * 4. Save Meeting & Action Items to MongoDB Atlas
 * 5. Set Job status to 'completed' with references to created records
 * 6. Auto-retry on failure up to queue configured attempts
 */
export const meetingWorker = new Worker(
  MEETING_QUEUE_NAME,
  async (bullJob) => {
    const { mongoJobId, userId, title, notes } = bullJob.data;
    console.log(`[Worker] Started processing Job ${mongoJobId} (${title})`);

    try {
      // 1. Mark job as processing
      await Job.findByIdAndUpdate(mongoJobId, {
        status: 'processing',
        progress: 25,
      });

      // 2. Call Google Gemini AI
      const { decisions, unansweredQuestions, actionItems } = await extractMeetingInsights(title, notes);

      await Job.findByIdAndUpdate(mongoJobId, {
        progress: 60,
      });

      // 3. Persist Meeting to MongoDB Atlas
      const newMeeting = await Meeting.create({
        title,
        notes,
        decisions,
        unansweredQuestions,
        userId,
      });

      await Job.findByIdAndUpdate(mongoJobId, {
        progress: 80,
      });

      // 4. Attach meetingId and userId, persist Action Items
      const itemsToInsert = actionItems.map((item) => ({
        ...item,
        meetingId: newMeeting._id,
        meetingTitle: newMeeting.title,
        userId,
      }));

      const insertedItems = itemsToInsert.length > 0 ? await Item.insertMany(itemsToInsert) : [];

      // 5. Mark job as completed
      await Job.findByIdAndUpdate(mongoJobId, {
        status: 'completed',
        progress: 100,
        result: {
          meetingId: newMeeting._id,
          itemsCount: insertedItems.length,
        },
      });

      console.log(`[Worker] Completed Job ${mongoJobId} -> Created Meeting ${newMeeting._id} with ${insertedItems.length} items`);
      return { meetingId: newMeeting._id, itemsCount: insertedItems.length };
    } catch (error) {
      console.error(`[Worker] Failed Job ${mongoJobId}:`, error.message);

      // Record error on MongoDB Job ticket
      await Job.findByIdAndUpdate(mongoJobId, {
        status: 'failed',
        error: {
          message: error.message,
        },
      });

      // Rethrow to let BullMQ manage retries
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, // Can process up to 5 meetings concurrently without blocking Express
  }
);

meetingWorker.on('completed', (job) => {
  console.log(`[Worker Event] BullMQ Job ${job.id} marked as completed`);
});

meetingWorker.on('failed', (job, err) => {
  console.error(`[Worker Event] BullMQ Job ${job?.id} failed with error:`, err.message);
});

