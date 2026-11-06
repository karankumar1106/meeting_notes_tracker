import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import meetingsRouter from './routes/meetings.js';
import itemsRouter from './routes/items.js';

// 1. Load environment variables from .env file
dotenv.config();

// 2. Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Core Middleware
app.use(cors());
app.use(express.json());

// 4. API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Meeting Notes Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/meetings', meetingsRouter);
app.use('/api/items', itemsRouter);

// 5. 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// 6. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[server error]', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 7. Start listening for incoming network requests
app.listen(PORT, () => {
  console.log(`[server] API listening at http://localhost:${PORT}`);
  console.log(`[server] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[server] Meetings API: http://localhost:${PORT}/api/meetings`);
  console.log(`[server] Items API:    http://localhost:${PORT}/api/items`);
});
