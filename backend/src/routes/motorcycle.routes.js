import express from 'express';
import { 
  getMotorcycles, 
  getMotorcycleById, 
  createMotorcycle, 
  updateMotorcycle, 
  deleteMotorcycle 
} from '../controllers/motorcycle.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';
import { validate, motorcycleSchema } from '../middleware/validator.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getMotorcycles);
router.get('/:id', getMotorcycleById);

// Admin only routes
router.post('/', authenticate, authorizeAdmin, upload.single('image'), validate(motorcycleSchema), createMotorcycle);
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), validate(motorcycleSchema), updateMotorcycle);
router.delete('/:id', authenticate, authorizeAdmin, deleteMotorcycle);

export default router;
