import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows & ISP Node.js DNS SRV resolution issues with MongoDB Atlas (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  console.warn('[Database] Custom DNS fallback could not be set:', e);
}

/**
 * Connect to MongoDB database with reliable Atlas DNS resolution and connection handling.
 */
export const connectDB = async (): Promise<typeof mongoose | null> => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzavibe';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Database] MongoDB connection failed: ${errMessage}`);
    console.error('[Database] Please verify your MongoDB Atlas connection string and Network Access (IP Whitelist).');
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

