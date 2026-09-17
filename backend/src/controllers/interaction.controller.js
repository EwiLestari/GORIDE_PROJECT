import { supabase } from '../config/supabase.js';

// --- LIKES ---

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { motorcycle_id } = req.body;

    if (!motorcycle_id) {
      return res.status(400).json({ message: 'motorcycle_id is required' });
    }

    // Cek apakah sudah dilike
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('motorcycle_id', motorcycle_id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingLike) {
      // Jika sudah dilike, maka unlike (hapus)
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('motorcycle_id', motorcycle_id);
      
      if (deleteError) throw deleteError;
      return res.json({ message: 'Unliked successfully', liked: false });
    } else {
      // Jika belum dilike, maka tambahkan
      const { error: insertError } = await supabase
        .from('likes')
        .insert([{ user_id: userId, motorcycle_id }]);
        
      if (insertError) throw insertError;
      return res.status(201).json({ message: 'Liked successfully', liked: true });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

export const getLikeStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { motorcycleId } = req.params;

    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', userId)
      .eq('motorcycle_id', motorcycleId)
      .maybeSingle();

    if (error) throw error;

    res.json({ liked: !!data });
  } catch (error) {
    console.error('Get like status error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

export const getMyLikes = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('likes')
      .select('motorcycle_id, motorcycles(*, categories(name))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map the nested motorcycles data out
    const formattedData = data.map(item => item.motorcycles);

    res.json(formattedData);
  } catch (error) {
    console.error('Get my likes error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// --- REVIEWS ---

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { motorcycle_id, rating, comment } = req.body;

    if (!motorcycle_id || !rating) {
      return res.status(400).json({ message: 'motorcycle_id and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{ user_id: userId, motorcycle_id, rating, comment }])
      .select('*, users(name)')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ message: 'You have already reviewed this motorcycle' });
      }
      throw error;
    }

    res.status(201).json({ message: 'Review added successfully', review: data });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

export const getMotorcycleReviews = async (req, res) => {
  try {
    const { motorcycleId } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select('*, users(name)')
      .eq('motorcycle_id', motorcycleId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

export const getCanReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { motorcycleId } = req.params;

    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .eq('motorcycle_id', motorcycleId)
      .eq('status', 'completed')
      .limit(1);

    if (error) throw error;

    res.json({ canReview: data && data.length > 0 });
  } catch (error) {
    console.error('Get can review error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};
