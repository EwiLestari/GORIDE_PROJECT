import express from 'express';
import { updateProfile, uploadAvatar } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { avatarUpload } from '../middleware/avatar.upload.js';

const router = express.Router();

// Semua rute user membutuhkan otentikasi (login)
router.put('/profile', authenticate, updateProfile);
router.post('/profile/avatar', authenticate, avatarUpload.single('avatar'), uploadAvatar);

export default router;
