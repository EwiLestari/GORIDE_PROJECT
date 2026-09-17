import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Bike, CheckCircle2, AlertCircle, XCircle, CreditCard, Banknote, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviewingBookingId, setReviewingBookingId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async (motorcycleId, bookingId) => {
    if (!rating || rating < 1 || rating > 5) return;
    setSubmittingReview(true);
    try {
      await api.post('/interactions/reviews', { motorcycle_id: motorcycleId, rating, comment });
      toast.success('Thank you for your feedback!');
      setReviewingBookingId(null);
      setComment('');
      setRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/me');
        setBookings(response.data.data || []);
      } catch {
        setError('Failed to load your bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed': return { color: 'text-primary bg-primary/10 border-primary/20', icon: <CheckCircle2 size={14} />, label: 'Confirmed' };
      case 'completed': return { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle2 size={14} />, label: 'Completed' };
      case 'cancelled': return { color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: <XCircle size={14} />, label: 'Cancelled' };
      default: return { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: <AlertCircle size={14} />, label: 'Pending' };
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h2 className="text-4xl font-bold font-['Outfit'] mb-2" style={{ color: 'var(--text-base)' }}>My Bookings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Track and manage your rental history.</p>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 mb-6 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center my-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-16 text-center rounded-2xl flex flex-col items-center border-dashed border-2 border-[var(--border-base)]"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-subtle)' }}
          >
            <Bike size={32} />
          </div>
          <h3 className="text-2xl font-bold font-['Outfit'] mb-2" style={{ color: 'var(--text-base)' }}>No Bookings Yet</h3>
          <p className="mb-6 max-w-sm" style={{ color: 'var(--text-muted)' }}>
            You haven't rented any motorcycles yet. Start exploring our catalog to find your perfect ride.
          </p>
          <a href="/catalog" className="btn btn-primary">Browse Catalog</a>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6">
          {bookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            return (
              <motion.div
                variants={itemVariants}
                key={booking.id}
                className="glass-panel p-0 overflow-hidden flex flex-col md:flex-row group hover:border-primary/30 transition-colors"
              >
                {/* Left color block */}
                <div
                  className="w-full md:w-48 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-[var(--border-base)] relative overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Bike size={48} className="group-hover:text-primary transition-colors mb-4 relative z-10" style={{ color: 'var(--text-subtle)' }} />
                  <p className="text-xs font-bold tracking-wider uppercase relative z-10" style={{ color: 'var(--text-subtle)' }}>
                    {booking.motorcycles?.license_plate}
                  </p>
                </div>

                {/* Details */}
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold font-['Outfit'] mb-1" style={{ color: 'var(--text-base)' }}>
                        {booking.motorcycles?.name}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Booking ID: <span className="font-mono" style={{ color: 'var(--text-base)' }}>#{booking.id.substring(0, 8)}</span>
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${statusConfig.color}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <Calendar size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>Pick-up</p>
                        <p className="font-medium" style={{ color: 'var(--text-base)' }}>{format(new Date(booking.start_time), 'dd MMM yyyy')}</p>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{format(new Date(booking.start_time), 'HH:mm')}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                        <Clock size={18} className="text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>Return</p>
                        <p className="font-medium" style={{ color: 'var(--text-base)' }}>{format(new Date(booking.end_time), 'dd MMM yyyy')}</p>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{format(new Date(booking.end_time), 'HH:mm')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Amount + Payment */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[var(--border-base)]">
                    <div
                      className="flex-1 rounded-xl p-4 border border-[var(--border-base)] flex items-center gap-4"
                      style={{ backgroundColor: 'var(--bg-subtle)' }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Banknote size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-subtle)' }}>Total Amount</p>
                        <p className="font-bold text-lg" style={{ color: 'var(--text-base)' }}>
                          Rp {booking.total_price?.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex-1 rounded-xl p-4 border border-[var(--border-base)] flex items-center gap-4"
                      style={{ backgroundColor: 'var(--bg-subtle)' }}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg)', color: 'var(--text-muted)' }}>
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-subtle)' }}>Payment Method</p>
                        <p className="font-medium capitalize" style={{ color: 'var(--text-base)' }}>{booking.payment_method}</p>
                      </div>
                    </div>
                  </div>

                  {/* Late fee */}
                  {booking.late_fee > 0 && (
                    <div className="mt-4 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-rose-500">
                        <AlertCircle size={16} />
                        <span className="font-medium">Late Return Fee Applied</span>
                      </div>
                      <span className="font-bold text-rose-500">+Rp {booking.late_fee?.toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  {/* Review Section */}
                  {booking.status === 'completed' && (
                    <div className="mt-6 pt-6 border-t border-[var(--border-base)]">
                      <AnimatePresence mode="wait">
                        {reviewingBookingId === booking.id ? (
                          <motion.div
                            key="form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="rounded-xl border border-[var(--border-base)] p-6 overflow-hidden"
                            style={{ backgroundColor: 'var(--bg-subtle)' }}
                          >
                            <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--text-base)' }}>Rate your experience</h4>
                            <div className="flex items-center gap-2 mb-4">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setRating(star)}
                                  className="hover:scale-110 transition-transform"
                                >
                                  <Star size={28} className={star <= rating ? 'fill-yellow-500 text-yellow-500' : ''} style={star > rating ? { color: 'var(--text-subtle)' } : {}} />
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Tell us what you liked (or didn't like)..."
                              className="w-full border border-[var(--border-base)] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-4 py-3 transition-all duration-300 mb-4 resize-none h-24 shadow-inner focus:outline-none placeholder:text-[var(--text-subtle)]"
                              style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-base)' }}
                            ></textarea>
                            <div className="flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => setReviewingBookingId(null)}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReviewSubmit(booking.motorcycle_id, booking.id)}
                                disabled={submittingReview}
                                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                              >
                                {submittingReview ? 'Submitting...' : 'Submit Feedback'}
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="prompt"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col sm:flex-row items-center justify-between gap-4"
                          >
                            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                              How was your ride with {booking.motorcycles?.name}?
                            </p>
                            <button
                              onClick={() => { setReviewingBookingId(booking.id); setRating(5); setComment(''); }}
                              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors w-full sm:w-auto text-center"
                            >
                              Write a Review
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
