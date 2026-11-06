import { Router } from 'express';
import {
  meetings,
  simulateAIExtraction,
  addMeetingWithItems,
  deleteMeetingCascade
} from '../data/mockData.js';

const router = Router();

/**
 * GET /api/meetings
 * Returns list of all meetings
 */
router.get('/', (req, res) => {
  res.status(200).json(meetings);
});

/**
 * GET /api/meetings/:id
 * Returns a specific meeting by ID
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const meeting = meetings.find((m) => m.id === id);

  if (!meeting) {
    return res.status(404).json({ error: 'Meeting not found' });
  }

  res.status(200).json(meeting);
});

/**
 * POST /api/meetings
 * Receives raw meeting notes, runs extraction simulation, and stores the meeting + items
 */
router.post('/', (req, res) => {
  const { title, notes } = req.body;

  if (!notes || typeof notes !== 'string' || !notes.trim()) {
    return res.status(400).json({ error: 'Meeting notes are required' });
  }

  const { newMeeting, newItems } = simulateAIExtraction(title?.trim(), notes.trim());
  addMeetingWithItems(newMeeting, newItems);

  res.status(201).json({
    meeting: newMeeting,
    items: newItems
  });
});

/**
 * DELETE /api/meetings/:id
 * Deletes a meeting and cascades deletion to all its action items
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const existingMeeting = meetings.find((m) => m.id === id);

  if (!existingMeeting) {
    return res.status(404).json({ error: 'Meeting not found' });
  }

  deleteMeetingCascade(id);
  res.status(200).json({ message: 'Meeting and associated items deleted successfully' });
});

export default router;
