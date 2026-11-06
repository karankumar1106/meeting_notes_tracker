import dotenv from 'dotenv';
import { app } from './app.js';

// Load environment variables as early as possible
dotenv.config({
  path: './.env'
});

const PORT = process.env.PORT || 5000;

// In Phase 4, we will wrap this with connectDB() from db/index.js
app.listen(PORT, () => {
  console.log(`⚙️  Server is running at http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Meetings API: http://localhost:${PORT}/api/meetings`);
  console.log(`✅ Items API:    http://localhost:${PORT}/api/items`);
});
