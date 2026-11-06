import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 1. Load environment variables from .env file
dotenv.config();

// 2. Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Core Middleware
// cors(): allows requests from our React frontend (running on different port like 5173/5174)
app.use(cors());

// express.json(): parses incoming JSON payloads in request bodies (req.body)
app.use(express.json());

// 4. Health Check Endpoint
// Used to verify that the server is alive and responding
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Meeting Notes Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// 5. Start listening for incoming network requests
app.listen(PORT, () => {
  console.log(`[server] API listening at http://localhost:${PORT}`);
  console.log(`[server] Health check available at http://localhost:${PORT}/api/health`);
});
