import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

// We only initialize the client if credentials are provided,
// otherwise it might throw an error. In a real scenario, we'd want to fail fast.
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!supabase) {
  console.warn('Supabase URL or Key is missing. Please check your .env file.');
}
