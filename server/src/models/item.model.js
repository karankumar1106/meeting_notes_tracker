import mongoose, { Schema } from 'mongoose';

const itemSchema = new Schema(
  {
    meetingId: {
      type: Schema.Types.ObjectId,
      ref: 'Meeting',
      required: true,
      index: true,
    },
    meetingTitle: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      required: [true, 'Action item text is required'],
      trim: true,
    },
    owner: {
      type: String,
      default: 'Unassigned',
      trim: true,
    },
    dueDate: {
      type: String,
      default: () => new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
      index: true,
    },
    sourceSentence: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id when sending JSON to frontend
itemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.meetingId = ret.meetingId.toString();
    return ret;
  },
});

export const Item = mongoose.model('Item', itemSchema);

