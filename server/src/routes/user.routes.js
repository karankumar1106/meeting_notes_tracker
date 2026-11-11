import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public Auth Routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Protected Auth Routes (Require valid JWT)
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/me').get(verifyJWT, getCurrentUser);

export default router;

