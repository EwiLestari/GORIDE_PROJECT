import cron from 'node-cron';
import { supabase } from '../config/supabase.js';
import { sendLateReturnReminder } from '../services/email.service.js';

// Run every 15 minutes
export const initCronJobs = () => {
  cron.schedule('*/15 * * * *', async () => {
    console.log('Running late return checker job...');

    try {
      const now = new Date().toISOString();

      // Find bookings that are confirmed, end_time is past, actual_return_time is null, and reminder not sent
      const { data: lateBookings, error } = await supabase
        .from('bookings')
        .select('id, end_time, reminder_sent, users(email, name), motorcycles(name)')
        .eq('status', 'confirmed')
        .is('actual_return_time', null)
        .eq('reminder_sent', false)
        .lt('end_time', now);

      if (error) {
        console.error('Error fetching late bookings:', error);
        return;
      }

      for (const booking of lateBookings) {
        // Send email
        const userEmail = booking.users.email;
        const userName = booking.users.name;
        const motorcycleName = booking.motorcycles.name;
        
        const sent = await sendLateReturnReminder(userEmail, userName, motorcycleName, booking.end_time);

        if (sent) {
          // Update DB flag to avoid sending duplicate reminders (idempotent)
          await supabase
            .from('bookings')
            .update({ reminder_sent: true })
            .eq('id', booking.id);
        }
      }
    } catch (err) {
      console.error('Cron job error:', err);
    }
  });
};
