import dotenv from 'dotenv';
import app from './src/app.js';
import { supabase } from './src/config/supabase.js';
import { initCronJobs } from './src/cron/lateReturnChecker.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Optionally check DB connection here
    if (supabase) {
      console.log('Supabase client initialized');
    }

    // Start cron jobs
    initCronJobs();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
