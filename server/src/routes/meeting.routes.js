import { Router } from 'express';
import {
  getAllMeetings,
  getMeetingById,
  createMeeting,
  deleteMeeting,
} from '../controllers/meeting.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all meeting routes with JWT authentication
router.use(verifyJWT);

// Route: /api/meetings
router.route('/')
  .get(getAllMeetings)
  .post(createMeeting);

// Route: /api/meetings/:id
router.route('/:id')
  .get(getMeetingById)
  .delete(deleteMeeting);

export default router;
