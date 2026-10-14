import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorMiddleware';
import { checkDatabaseConnection } from './config/db';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(env.UPLOAD_DIR));

// Logging middleware in development
if (env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📡 [${req.method}] ${req.originalUrl}`);
    next();
  });
}

// API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

// Root route
app.get('/', (req, res) => {
  res.json({
    app: 'AgriOne AI Platform API',
    status: 'Running',
    documentation: '/api/health',
    timestamp: new Date(),
  });
});

// Start Server
const server = app.listen(env.PORT, async () => {
  console.log(`🌾 AgriOne AI Backend Server running on port ${env.PORT}`);
  console.log(`🔗 API Base URL: ${env.API_URL}/api`);
  await checkDatabaseConnection();
});

export default app;
