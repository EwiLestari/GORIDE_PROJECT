import express from 'express';
import { 
  createBooking, 
  getMyBookings, 
  updateBookingStatus, 
  returnBooking,
  getAllBookings
} from '../controllers/booking.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';
import { validate, bookingSchema } from '../middleware/validator.js';

const router = express.Router();

// User routes
router.post('/', authenticate, validate(bookingSchema), createBooking);
router.get('/me', authenticate, getMyBookings);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllBookings);
router.patch('/:id/status', authenticate, authorizeAdmin, updateBookingStatus);
router.patch('/:id/return', authenticate, authorizeAdmin, returnBooking);

export default router;
