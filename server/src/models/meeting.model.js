import mongoose, { Schema } from 'mongoose';

const meetingSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Meeting title is required'],
      trim: true,
      default: 'Untitled Meeting',
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    notes: {
      type: String,
      required: [true, 'Meeting notes are required'],
      trim: true,
    },
    decisions: {
      type: [String],
      default: [],
    },
    unansweredQuestions: {
      type: [String],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for backward compatibility with initial sample data, populated on new creations
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id when sending JSON to frontend
meetingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

export const Meeting = mongoose.model('Meeting', meetingSchema);

