import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import { ApiResponse } from './types/user.js';
import { initializeDatabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);

app.get('/health', (req, res: express.Response<ApiResponse>) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy'
  });
});

app.use('*', (req, res: express.Response<ApiResponse>) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use((
  error: Error,
  req: express.Request,
  res: express.Response<ApiResponse>,
  next: express.NextFunction
) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

const startServer = async () => {
  // Start server first
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });

  // Initialize database with retry logic
  let retries = 10;
  while (retries > 0) {
    try {
      await initializeDatabase();
      console.log('✅ Database connected successfully');
      break;
    } catch (error) {
      console.error(`❌ Database connection failed. Retries left: ${retries - 1}`);
      if (retries === 1) {
        console.error('Final database connection error:', error);
        console.log('⚠️ Server will continue without database. Some features may not work.');
        break;
      }
      retries--;
      // Wait 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});