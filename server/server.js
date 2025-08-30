import express from "express";
import cors from "cors";
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from "./routes/aiRoutes.js";
import cloudinaryConfig from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
};

// Initialize Cloudinary
cloudinaryConfig().catch(err => {
  console.error('Failed to initialize Cloudinary:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
app.get('/', (req, res) => res.send('Server Is Live!'));

// Protected routes
app.use(clerkMiddleware());
app.use(requireAuth());
app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;