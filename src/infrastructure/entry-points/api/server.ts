import { app } from './app';
import { connectDB } from './database';
import { setupRoutes } from './routes';

export const startServer = () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
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