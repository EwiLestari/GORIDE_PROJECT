import express from 'express';
import { register, login, logout, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { validate, loginSchema, registerSchema } from '../middleware/validator.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
