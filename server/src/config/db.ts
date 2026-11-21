import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows & ISP Node.js DNS SRV resolution issues with MongoDB Atlas (querySrv ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  console.warn('[Database] Custom DNS fallback could not be set:', e);
}

// Disable command buffering to prevent hanging requests when database is disconnected or connecting
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 5000);

let isConnecting = false;
let reconnectTimer: NodeJS.Timeout | null = null;

/**
 * Connect to MongoDB database with reliable Atlas DNS resolution and auto-reconnect handling.
 */
export const connectDB = async (): Promise<typeof mongoose | null> => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pizzavibe';

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (isConnecting) {
    return null;
  }

  isConnecting = true;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    if (reconnectTimer) {
      clearInterval(reconnectTimer);
      reconnectTimer = null;
    }
    return conn;
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Database] MongoDB connection failed: ${errMessage}`);
    console.error('[Database] Ensure your IP is whitelisted in MongoDB Atlas (Network Access -> Allow 0.0.0.0/0).');

    // Auto-retry connection every 5 seconds in background if not already scheduling
    if (!reconnectTimer) {
      console.log('[Database] Starting automatic background reconnection attempts (every 5s)...');
      reconnectTimer = setInterval(async () => {
        if (mongoose.connection.readyState !== 1 && !isConnecting) {
          console.log('[Database] Retrying MongoDB Atlas connection...');
          await connectDB();
        }
      }, 5000);
    }

    return null;
  } finally {
    isConnecting = false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[Database] MongoDB disconnected. Attempting auto-reconnect...');
  if (!reconnectTimer) {
    reconnectTimer = setInterval(async () => {
      if (mongoose.connection.readyState !== 1 && !isConnecting) {
        await connectDB();
      }
    }, 5000);
  }
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected successfully');
  if (reconnectTimer) {
    clearInterval(reconnectTimer);
    reconnectTimer = null;
  }
});

export default connectDB;

