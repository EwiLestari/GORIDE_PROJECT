import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role }])
      .select('id, name, email, role')
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(409).json({ message: 'Email already exists' });
      }
      throw error;
    }

    res.status(201).json({ message: 'User registered successfully', user: data });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message || error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    // Setting cookie would be done here or handled on frontend via json response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = (req, res) => {
  // In a token-based auth without session storage, logout is mostly handled client-side.
  // If cookies are used, clear the cookie here.
  res.json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (error || !user) {
      // Don't leak whether email exists
      return res.json({ message: 'If an account with that email exists, we sent a password reset link.' });
    }

    // Generate a temporary JWT for password reset
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '15m' }
    );

    // Send the actual email
    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'If an account with that email exists, we sent a password reset link.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    const { error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', decoded.id);

    if (error) throw error;

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

