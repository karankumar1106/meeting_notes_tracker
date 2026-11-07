import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Meeting Notes Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Import Routes
import meetingRouter from './routes/meeting.routes.js';
import itemRouter from './routes/item.routes.js';

// Route Declarations
app.use('/api/meetings', meetingRouter);
app.use('/api/items', itemRouter);
app.use('/api/v1/meetings', meetingRouter);
app.use('/api/v1/items', itemRouter);

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[server error]', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export { app };
