import dns from 'node:dns';

// Resolve IPv4 first to prevent Windows Node.js getaddrinfo ENOTFOUND issues
dns.setDefaultResultOrder('ipv4first');

// Load environment variables immediately before any other application modules are imported
import 'dotenv/config';

import connectDB from './db/index.js';
import { app } from './app.js';
// Start background BullMQ worker
import './workers/meeting.worker.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas first, then start listening
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Meetings API: http://localhost:${PORT}/api/meetings`);
      console.log(`Items API:    http://localhost:${PORT}/api/items`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });
