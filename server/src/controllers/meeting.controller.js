import {
  meetings,
  simulateAIExtraction,
  addMeetingWithItems,
  deleteMeetingCascade
} from '../data/mockData.js';

/**
 * Controller: Get all meetings
 * GET /api/meetings
 */
export const getAllMeetings = (req, res) => {
  return res.status(200).json(meetings);
};

/**
 * Controller: Get single meeting by ID
 * GET /api/meetings/:id
 */
export const getMeetingById = (req, res) => {
  const { id } = req.params;
  const meeting = meetings.find((m) => m.id === id);

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: 'Meeting not found'
    });
  }

  return res.status(200).json(meeting);
};

/**
 * Controller: Create new meeting & extract action items
 * POST /api/meetings
 */
export const createMeeting = (req, res) => {
  const { title, notes } = req.body;

  if (!notes || typeof notes !== 'string' || !notes.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Meeting notes are required'
    });
  }

  const { newMeeting, newItems } = simulateAIExtraction(title?.trim(), notes.trim());
  addMeetingWithItems(newMeeting, newItems);

  return res.status(201).json({
    success: true,
    meeting: newMeeting,
    items: newItems
  });
};

/**
 * Controller: Delete a meeting (cascade-delete items)
 * DELETE /api/meetings/:id
 */
export const deleteMeeting = (req, res) => {
  const { id } = req.params;
  const existingMeeting = meetings.find((m) => m.id === id);

  if (!existingMeeting) {
    return res.status(404).json({
      success: false,
      message: 'Meeting not found'
    });
  }

  deleteMeetingCascade(id);

  return res.status(200).json({
    success: true,
    message: 'Meeting and associated action items deleted successfully'
  });
};
