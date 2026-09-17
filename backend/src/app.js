import express from 'express';
import cors from 'cors';

const app = express();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Basic route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Go Ride API is running' });
});

// Import Routes
import authRoutes from './routes/auth.routes.js';
import motorcycleRoutes from './routes/motorcycle.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import userRoutes from './routes/user.routes.js';
import interactionRoutes from './routes/interaction.routes.js';
// import adminRoutes from './routes/admin.routes.js'; // Admin endpoints are handled inside motorcycle/booking routes currently, but we can add more later.

// Setup Routes
app.use('/auth', authRoutes);
app.use('/motorcycles', motorcycleRoutes);
app.use('/bookings', bookingRoutes);
app.use('/users', userRoutes);
app.use('/interactions', interactionRoutes);
// app.use('/admin', adminRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
