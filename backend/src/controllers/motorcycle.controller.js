import { supabase } from '../config/supabase.js';

// Public endpoint: Get motorcycles
export const getMotorcycles = async (req, res) => {
  try {
    const { 
      category_id, 
      search, 
      status, 
      sort, 
      page = 1, 
      limit = 10 
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Use exact count to get total records
    let query = supabase.from('motorcycles').select('*, categories(name)', { count: 'exact' });

    // 1. Soft Delete Filter
    query = query.neq('status', 'deleted');

    // 2. Filter by category
    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    // 3. Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // 4. Search by name or brand
    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    // 5. Sorting
    if (sort) {
      switch (sort) {
        case 'terbaru':
          query = query.order('created_at', { ascending: false });
          break;
        case 'terlama':
          query = query.order('created_at', { ascending: true });
          break;
        case 'a-z':
          query = query.order('name', { ascending: true });
          break;
        case 'z-a':
          query = query.order('name', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // 6. Pagination
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
    console.error('Error fetching motorcycles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Public endpoint: Get single motorcycle
export const getMotorcycleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('motorcycles')
      .select('*, categories(name)')
      .eq('id', id)
      .neq('status', 'deleted')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Motorcycle not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching motorcycle:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin endpoints (CRUD)
export const createMotorcycle = async (req, res) => {
  try {
    const { category_id, brand, name, license_plate, cc, color, description, price_per_day, stock, status } = req.body;
    let image_url = req.body.image_url;

    if (req.file) {
      // Build public URL for the uploaded file
      const protocol = req.protocol;
      const host = req.get('host');
      image_url = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    const { data, error } = await supabase
      .from('motorcycles')
      .insert([{ category_id, brand, name, license_plate, cc, color, description, price_per_day, stock, image_url, status }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating motorcycle:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMotorcycle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      // Build public URL for the uploaded file
      const protocol = req.protocol;
      const host = req.get('host');
      updateData.image_url = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    const { data, error } = await supabase
      .from('motorcycles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating motorcycle:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteMotorcycle = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete: update status to 'deleted'
    const { error } = await supabase
      .from('motorcycles')
      .update({ status: 'deleted' })
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Motorcycle deleted successfully' });
  } catch (error) {
    console.error('Error deleting motorcycle:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
