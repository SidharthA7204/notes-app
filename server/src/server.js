import dotenv from 'dotenv';
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`[Server] Notes API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`[Server] Health check available at: http://localhost:${PORT}/api/health`);
    });

    // Graceful shutdown
    const handleShutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await disconnectDB();
        console.log('[Server] Process terminated cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  } catch (err) {
    console.error(`[Server] Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
