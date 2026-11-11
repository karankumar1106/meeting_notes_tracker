import { User } from '../models/user.model.js';

// Standard cookie options
const cookieOptions = {
  httpOnly: true, // Prevents client-side JavaScript from reading the cookie (protects against XSS)
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
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

    // Generate JWT access token
    const accessToken = user.generateAccessToken();

    return res
      .status(201)
      .cookie('accessToken', accessToken, cookieOptions)
      .json({
        success: true,
        message: 'User registered successfully',
        user,
        accessToken,
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

    // Generate JWT token
    const accessToken = user.generateAccessToken();

    return res
      .status(200)
      .cookie('accessToken', accessToken, cookieOptions)
      .json({
        success: true,
        message: 'Logged in successfully',
        user,
        accessToken,
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
    return res
      .status(200)
      .clearCookie('accessToken', cookieOptions)
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
 * Controller: Get currently logged-in user profile
 * GET /api/users/me
 */
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

