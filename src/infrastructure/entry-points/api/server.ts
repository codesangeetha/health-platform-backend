import { app } from './app';
import { connectDB } from './database';
import { setupRoutes } from './routes';
import { createServer } from 'http';
import { createSignaling } from './signaling';

export const startServer = () => {
  const PORT = process.env.PORT || 3000;
  
  // Create HTTP server from Express app
  const httpServer = createServer(app);
  
  // Initialize Socket.IO signaling for video calls
  const io = createSignaling(httpServer);
  
  // Add video call health check endpoint
  app.get('/video-call/health', (req, res) => {
    res.json({ status: 'OK', message: 'WebRTC Signaling Server is running' });
  });

  // Use httpServer instead of app.listen
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API health check: http://localhost:${PORT}/health`);
    console.log(`Video call health check: http://localhost:${PORT}/video-call/health`);
  });
  
  return { httpServer, io };
};

export const initializeApp = async () => {
  try {
    await connectDB();
    setupRoutes();
    startServer();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};