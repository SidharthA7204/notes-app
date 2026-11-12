import mongoose from 'mongoose';

let memoryServer = null;

/**
 * Connect to MongoDB instance (remote/local or in-memory fallback)
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`[Database] Connected to MongoDB at: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`[Database] Failed to connect to configured MONGODB_URI: ${error.message}`);
      console.log('[Database] Falling back to in-memory MongoDB instance for development/testing...');
    }
  } else {
    console.log('[Database] No MONGODB_URI provided. Starting in-memory MongoDB instance...');
  }

  // Fallback to MongoMemoryServer
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      binary: {
        version: '6.0.16',
      },
    });
    const memoryUri = memoryServer.getUri();

    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] In-memory MongoDB running at: ${memoryUri}`);
    return conn;
  } catch (err) {
    console.error(`[Database] Fatal: Unable to initialize in-memory database: ${err.message}`);
    throw err;
  }
};

/**
 * Disconnect and clean up database connections (used in tests and graceful shutdown)
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = null;
    }
    console.log('[Database] Disconnected from MongoDB');
  } catch (error) {
    console.error(`[Database] Error while disconnecting: ${error.message}`);
  }
};

export default connectDB;
