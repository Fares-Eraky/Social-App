import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { createApp } from './app';
import { connectDB } from './config/database.config';
import { socketGateway } from './socket/socket.gateway';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    const app = createApp();
    const httpServer = createServer(app);

    socketGateway.initialize(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Socket.IO is ready for connections`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
