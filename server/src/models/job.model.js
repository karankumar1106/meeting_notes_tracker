import mongoose, { Schema } from 'mongoose';

/**
 * Job Schema - Tracks background processing tasks (BullMQ + Redis)
 * Used to report status to the frontend and store job artifacts.
 */
const jobSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    idempotencyKey: {
      type: String,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['EXTRACT_MEETING_NOTES'],
      default: 'EXTRACT_MEETING_NOTES',
    },
    status: {
      type: String,
      required: true,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    payload: {
      title: { type: String, default: 'Untitled Meeting' },
      notes: { type: String, required: true },
    },
    result: {
      meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting' },
      itemsCount: { type: Number, default: 0 },
    },
    error: {
      message: { type: String },
      details: { type: Schema.Types.Mixed },
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model('Job', jobSchema);

