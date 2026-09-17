import express from 'express';
import { toggleLike, getLikeStatus, getMyLikes, addReview, getMotorcycleReviews, getCanReview } from '../controllers/interaction.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// LIKES
router.post('/likes', authenticate, toggleLike);
router.get('/likes/me', authenticate, getMyLikes);
router.get('/likes/:motorcycleId', authenticate, getLikeStatus);

// REVIEWS
router.post('/reviews', authenticate, addReview);
router.get('/reviews/:motorcycleId', getMotorcycleReviews); // Public access to view reviews
router.get('/reviews/can-review/:motorcycleId', authenticate, getCanReview);

export default router;
