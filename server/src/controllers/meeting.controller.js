import { Meeting } from '../models/meeting.model.js';
import { Item } from '../models/item.model.js';
import { extractMeetingInsights } from '../services/ai.service.js';

/**
 * Controller: Get all meetings
 * GET /api/meetings
 */
export const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
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
 * Controller: Create new meeting & extract action items
 * POST /api/meetings
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

    // 1. Extract insights using AI Service (Gemini API with fallback)
    const { decisions, unansweredQuestions, actionItems } = await extractMeetingInsights(trimmedTitle, trimmedNotes);

    // 2. Persist Meeting to MongoDB Atlas
    const newMeeting = await Meeting.create({
      title: trimmedTitle,
      notes: trimmedNotes,
      decisions,
      unansweredQuestions,
    });

    // 3. Attach meetingId and persist Action Items to MongoDB Atlas
    const itemsToInsert = actionItems.map((item) => ({
      ...item,
      meetingId: newMeeting._id,
      meetingTitle: newMeeting.title,
    }));

    const insertedItems = await Item.insertMany(itemsToInsert);

    return res.status(201).json({
      success: true,
      meeting: newMeeting,
      items: insertedItems,
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return res.status(500).json({ success: false, message: 'Failed to create meeting' });
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
