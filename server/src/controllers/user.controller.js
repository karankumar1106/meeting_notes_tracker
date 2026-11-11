import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

// Cookie options
const cookieOptions = {
  httpOnly: true, // Prevents client-side JS from reading the cookie (protects against XSS)
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

/**
 * Helper: Generate Access and Refresh Tokens & save refresh token in MongoDB
 */
const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found while generating tokens');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token to user document in database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

/**
 * Controller: Register a new user
 * POST /api/users/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Create user (password is automatically hashed by pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(201)
      .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 1 * 24 * 60 * 60 * 1000 }) // 1 day
      .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 }) // 10 days
      .json({
        success: true,
        message: 'User registered successfully',
        user,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

/**
 * Controller: Login existing user
 * POST /api/users/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist with this email',
      });
    }

    // Verify password hash
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid user credentials',
      });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 1 * 24 * 60 * 60 * 1000 }) // 1 day
      .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 }) // 10 days
      .json({
        success: true,
        message: 'Logged in successfully',
        user,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
};

/**
 * Controller: Logout current user
 * POST /api/users/logout
 */
export const logoutUser = async (req, res) => {
  try {
    // Clear the stored refresh token from database
    if (req.user?._id) {
      await User.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: null } },
        { returnDocument: 'after' }
      );
    }

    return res
      .status(200)
      .clearCookie('accessToken', cookieOptions)
      .clearCookie('refreshToken', cookieOptions)
      .json({
        success: true,
        message: 'User logged out successfully',
      });
  } catch (error) {
    console.error('Error in logoutUser:', error);
    return res.status(500).json({ success: false, message: 'Logout failed' });
  }
};

/**
 * Controller: Refresh Access Token (Rotation Pattern)
 * POST /api/users/refresh-token
 */
export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No refresh token provided',
      });
    }

    const secret = process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret';
    const decodedToken = jwt.verify(incomingRefreshToken, secret);

    const user = await User.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token: User not found',
      });
    }

    // Verify token matches what is stored in MongoDB
    if (incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is expired or has been revoked',
      });
    }

    // Generate new Access and Refresh tokens (Refresh Token Rotation!)
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 1 * 24 * 60 * 60 * 1000 })
      .cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 })
      .json({
        success: true,
        message: 'Access token refreshed successfully',
        accessToken,
        refreshToken: newRefreshToken,
      });
  } catch (error) {
    console.error('Error in refreshAccessToken:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
};

/**
 * Controller: Get currently logged-in user profile
 * GET /api/users/me
 */
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
