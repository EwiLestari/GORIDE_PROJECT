import { supabase } from '../config/supabase.js';

// Calculate hours between two dates
const getHoursDifference = (start, end) => {
  const diffInMs = new Date(end) - new Date(start);
  return diffInMs / (1000 * 60 * 60);
};

export const getAllBookings = async (req, res) => {
  try {
    const { search, status, sort, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('bookings')
      .select(`
        *,
        motorcycles (
          name,
          license_plate,
          brand
        ),
        users (
          name,
          email
        )
      `, { count: 'exact' });

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // Search (could be complex across relations, let's keep it simple for now or search in booking notes if any)
    // Supabase JS doesn't easily do deep relation searching in standard filters without views, 
    // but we can filter bookings by status for now.

    // Sorting
    if (sort) {
      switch (sort) {
        case 'terbaru':
          query = query.order('created_at', { ascending: false });
          break;
        case 'terlama':
          query = query.order('created_at', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Pagination
    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      data,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum)
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { motorcycle_id, start_time, end_time, payment_method } = req.body;
    const user_id = req.user.id;

    if (!motorcycle_id || !start_time || !end_time || !payment_method) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 1. Fetch motorcycle details
    const { data: motorcycle, error: motorError } = await supabase
      .from('motorcycles')
      .select('price_per_day, stock, status')
      .eq('id', motorcycle_id)
      .single();

    if (motorError || !motorcycle) {
      return res.status(404).json({ message: 'Motorcycle not found' });
    }

    if (motorcycle.status !== 'available' || motorcycle.stock <= 0) {
      return res.status(400).json({ message: 'Motorcycle is currently unavailable or out of stock' });
    }

    // Calculate total price based on duration in days (minimum 1 day)
    const durationHours = getHoursDifference(start_time, end_time);
    if (durationHours <= 0) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }
    
    // Convert hours to days, rounding up (e.g. 25 hours = 2 days)
    const durationDays = Math.max(1, Math.ceil(durationHours / 24));
    
    const total_price = durationDays * motorcycle.price_per_day;

    // 2. Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        user_id,
        motorcycle_id,
        start_time,
        end_time,
        total_price,
        payment_method,
        status: 'pending'
      }])
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Optional: Reduce stock by 1 for simplicity (requires more complex stock management for future dates in real life)
    // await supabase.from('motorcycles').update({ stock: motorcycle.stock - 1 }).eq('id', motorcycle_id);

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message, 
      details: error.details, 
      code: error.code 
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { status, sort, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('bookings')
      .select('*, motorcycles(name, brand, license_plate)', { count: 'exact' })
      .eq('user_id', user_id);

    if (status) {
      query = query.eq('status', status);
    }

    if (sort) {
      switch (sort) {
        case 'terbaru':
          query = query.order('created_at', { ascending: false });
          break;
        case 'terlama':
          query = query.order('created_at', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      data,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin endpoints
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ message: 'Booking status updated', data });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const returnBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { actual_return_time } = req.body;

    if (!actual_return_time) {
      return res.status(400).json({ message: 'Actual return time is required' });
    }

    // Fetch booking details
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    let late_fee = 0;
    let late_duration = 0;
    let new_total_price = booking.total_price;

    const end_time = new Date(booking.end_time);
    const return_time = new Date(actual_return_time);

    // Calculate penalty if late
    if (return_time > end_time) {
      late_duration = getHoursDifference(end_time, return_time); // in hours
      
      // Fetch late fee rate from settings
      const { data: settings } = await supabase.from('settings').select('*').single();
      const late_fee_per_hour = settings ? settings.late_fee_per_hour : 10000;
      
      late_fee = Math.ceil(late_duration) * late_fee_per_hour;
      new_total_price += late_fee;
    }

    // Update the booking
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        actual_return_time,
        late_duration,
        late_fee,
        total_price: new_total_price,
        status: 'completed'
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ message: 'Motorcycle returned successfully', booking: updatedBooking });
  } catch (error) {
    console.error('Return booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
