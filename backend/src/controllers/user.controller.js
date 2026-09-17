import { supabase } from '../config/supabase.js';
import bcrypt from 'bcryptjs';

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;
    
    // Siapkan data yang akan diupdate
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No data provided to update' });
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, name, email, role')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ message: 'Email already exists' });
      }
      throw error;
    }

    res.json({ message: 'Profile updated successfully', user: data });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Build public URL for the uploaded file
    const protocol = req.protocol;
    const host = req.get('host');
    const avatar_url = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({ 
      message: 'Avatar uploaded successfully', 
      avatar_url 
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};
