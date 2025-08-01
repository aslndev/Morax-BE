import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import dbConfig from './config/database.js';
import initializeDatabase from './database/init.js';
import corsMiddleware from './middleware/cors.js';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import courseRoutes from './routes/courses.js';
import uploadRoutes from './routes/upload.js';
import materialRoutes from './routes/materials.js';
import commentRoutes from './routes/comments.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(corsMiddleware);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

dbConfig.connect();
initializeDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/courses', materialRoutes);
app.use('/api/courses', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  dbConfig.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  dbConfig.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${dbConfig.dbPath}`);
});

export default app; 