import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getJobById, getUserJobs } from '../controllers/job.controller.js';

const router = Router();

// Protect all job endpoints with JWT verification
router.use(verifyJWT);

router.route('/').get(getUserJobs);
router.route('/:id').get(getJobById);

export default router;

