import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

/**
 * Authentication Middleware: verifyJWT
 * 
 * Verifies the incoming JWT access token from:
 * 1. HTTP-only Cookie (`req.cookies.accessToken`)
 * 2. Authorization Header (`Bearer <token>`)
 * 
 * Attaches the authenticated user document to `req.user`.
 */
export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized request: No token provided',
      });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key';
    const decodedToken = jwt.verify(token, secret);

    const user = await User.findById(decodedToken._id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token: User does not exist',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT Verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
    });
  }
};

