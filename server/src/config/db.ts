import mongoose from 'mongoose';

/**
 * Connect to MongoDB database with graceful connection handling.
 */
export const connectDB = async (): Promise<typeof mongoose | null> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pizzavibe';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.warn(`[Database] MongoDB connection warning: ${errMessage}`);
    console.warn('[Database] The server will continue running. Ensure MongoDB is running locally or provide a valid MONGODB_URI in .env');
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[Database] MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected');
});

export default connectDB;

