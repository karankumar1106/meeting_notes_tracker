import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

/**
 * Database Connection Utility
 * 
 * Follows production standard:
 * - Uses async/await with try/catch
 * - Logs the connected host
 * - Exits process with code 1 if connection fails
 */
const connectDB = async () => {
  try {
    const connectionUri = process.env.MONGODB_URI;
    if (!connectionUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connect to MongoDB with the DB_NAME appended if not already part of URI
    const uriWithDb = connectionUri.endsWith('/')
      ? `${connectionUri}${DB_NAME}`
      : connectionUri.includes('?')
        ? connectionUri.replace('?', `/${DB_NAME}?`)
        : `${connectionUri}/${DB_NAME}`;

    const connectionInstance = await mongoose.connect(uriWithDb);
    // console.log(connectionInstance)
    console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    return connectionInstance;
  } catch (error) {
    console.error('MONGODB connection FAILED:', error.message);
    process.exit(1);
  }
};

export default connectDB;

