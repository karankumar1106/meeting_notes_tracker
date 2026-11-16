import { Meeting } from '../models/meeting.model.js';
import { Item } from '../models/item.model.js';
import { Job } from '../models/job.model.js';
import { addMeetingJob } from '../queues/meeting.queue.js';
import { extractMeetingInsights } from '../services/ai.service.js';

/**
 * Controller: Get all meetings
 * GET /api/meetings
 */
export const getAllMeetings = async (req, res) => {
  try {
    const filter = req.user ? { userId: req.user._id } : {};
    const meetings = await Meeting.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch meetings' });
  }
};

/**
 * Controller: Get single meeting by ID
 * GET /api/meetings/:id
 */
export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      });
    }

    return res.status(200).json(meeting);
  } catch (error) {
    console.error('Error fetching meeting by id:', error);
    return res.status(500).json({ success: false, message: 'Invalid meeting ID or server error' });
  }
};

/**
 * Controller: Create new meeting (Asynchronous Background Job)
 * POST /api/meetings
 * 
 * Production Flow:
 * 1. Validates payload
 * 2. Creates a persistent Job ticket in MongoDB (status: 'queued')
 * 3. Dispatches job to BullMQ / Redis Queue
 * 4. Responds immediately with HTTP 202 Accepted (< 20ms)
 * 5. Background worker independently processes AI extraction & database persistence
 */
export const createMeeting = async (req, res) => {
  try {
    const { title, notes } = req.body;

    if (!notes || typeof notes !== 'string' || !notes.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Meeting notes are required',
      });
    }

    const trimmedTitle = title?.trim() || 'Untitled Meeting';
    const trimmedNotes = notes.trim();

    // 1. Create Job record in MongoDB to track progress & store artifacts
    const job = await Job.create({
      userId: req.user._id,
      payload: {
        title: trimmedTitle,
        notes: trimmedNotes,
      },
      status: 'queued',
      progress: 0,
    });

    // 2. Dispatch to BullMQ Redis Queue
    await addMeetingJob({
      mongoJobId: job._id.toString(),
      userId: req.user._id.toString(),
      title: trimmedTitle,
      notes: trimmedNotes,
    });

    // 3. Immediately return 202 Accepted with the Job Ticket
    return res.status(202).json({
      success: true,
      message: 'Meeting notes submitted and queued for background AI extraction',
      jobId: job._id,
      status: 'queued',
    });
  } catch (error) {
    console.error('Error queuing meeting creation:', error);
    return res.status(500).json({ success: false, message: 'Failed to queue meeting creation' });
  }
};

/**
 * Controller: Delete a meeting (cascade-delete items)
 * DELETE /api/meetings/:id
 */
export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const existingMeeting = await Meeting.findByIdAndDelete(id);

    if (!existingMeeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      });
    }

    // Cascade delete: remove all action items associated with this meeting
    await Item.deleteMany({ meetingId: id });

    return res.status(200).json({
      success: true,
      message: 'Meeting and associated action items deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete meeting' });
  }
};
