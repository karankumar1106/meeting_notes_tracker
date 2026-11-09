import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

// Load environment variables as early as possible
dotenv.config({
  path: './.env'
});

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
