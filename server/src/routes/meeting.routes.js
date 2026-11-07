import { Router } from 'express';
import {
  getAllMeetings,
  getMeetingById,
  createMeeting,
  deleteMeeting
} from '../controllers/meeting.controller.js';

const router = Router();

// Route: /api/meetings
router.route('/')
  .get(getAllMeetings)
  .post(createMeeting);

// Route: /api/meetings/:id
router.route('/:id')
  .get(getMeetingById)
  .delete(deleteMeeting);

export default router;

