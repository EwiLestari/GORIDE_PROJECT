import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { DetailSkeleton } from '../components/ui/Skeleton.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [motorcycle, setMotorcycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Booking Form State
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transfer');

  // Interaction State
  const [liked, setLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  
  // Review Form State
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch motorcycle details
        const motorRes = await api.get(`/motorcycles/${id}`);
        setMotorcycle(motorRes.data);
      } catch (err) {
        setError('Failed to load motorcycle details.');
        setLoading(false);
        return;
      }

      try {
        // Fetch like status
        const likeRes = await api.get(`/interactions/likes/${id}`);
        setLiked(likeRes.data.liked);
      } catch (err) {
        console.error('Failed to load like status:', err);
      }

      try {
        // Fetch reviews
        const reviewRes = await api.get(`/interactions/reviews/${id}`);
        setReviews(reviewRes.data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }

      try {
        // Fetch can review status
        const canReviewRes = await api.get(`/interactions/reviews/can-review/${id}`);
        setCanReview(canReviewRes.data.canReview);
      } catch (err) {
        console.error('Failed to check can review status:', err);
      }
      
      setLoading(false);
    };
    fetchData();
  }, [id, user, navigate]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/bookings', {
        motorcycle_id: id,
        start_time: startTime,
        end_time: endTime,
        payment_method: paymentMethod
      });
      setMotorcycle(prev => ({ ...prev, stock: prev.stock - 1 }));
      toast.success('Booking successful! Enjoy your ride.');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking.');
      setError(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async () => {
    try {
      const res = await api.post('/interactions/likes', { motorcycle_id: id });
      setLiked(res.data.liked);
      toast.success(res.data.liked ? 'Added to favorites' : 'Removed from favorites', { icon: res.data.liked ? '❤️' : '🤍' });
    } catch (err) {
      toast.error('Failed to update like status');
      console.error('Like error:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setSubmittingReview(true);

    try {
      const res = await api.post('/interactions/reviews', {
        motorcycle_id: id,
        rating,
        comment
      });
      // Add new review to top of list
      setReviews(prev => [res.data.review, ...prev]);
      setComment('');
      setRating(5);
      setCanReview(false); // Can't review again immediately without a new booking
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl animate-[fadeIn_0.5s_ease-out]">
        <DetailSkeleton />
      </div>
    );
  }
  if (!motorcycle) return <div className="text-center pt-32 text-red-400">{error}</div>;

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDateTime = now.toISOString().slice(0, 16);

  // Framer motion variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className="container mx-auto px-6 pt-32 pb-20 max-w-5xl"
    >
      <div className="grid md:grid-cols-2 gap-10">
        
        {/* Left Column: Motorcycle Details & Reviews */}
        <div className="flex flex-col gap-8">
          <motion.div variants={itemVariant} className="glass-panel p-6 rounded-2xl overflow-hidden relative group">
            {/* Spotlight effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-bg-dark/80 backdrop-blur-sm rounded-xl p-1 -m-1 h-full w-full">
              <div className="h-64 bg-white/5 rounded-xl mb-6 overflow-hidden relative group-hover:shadow-[0_0_30px_rgba(var(--color-primary),0.2)] transition-shadow duration-500">
                {motorcycle.image_url ? (
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={motorcycle.image_url} 
                    alt={motorcycle.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
                )}
              </div>
              
              <div className="flex justify-between items-start mb-2 px-2">
                <h2 className="text-3xl font-bold font-['Outfit'] bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">{motorcycle.name}</h2>
                <motion.button 
                  whileTap={{ scale: 0.8 }}
                  onClick={handleToggleLike} 
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Heart size={28} className={liked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'} />
                </motion.button>
              </div>
              
              <p className="text-slate-400 capitalize mb-4 px-2 flex items-center gap-2">
              {motorcycle.categories?.name || 'Standard'} • {motorcycle.cc}cc • {motorcycle.color}
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
              {motorcycle.description}
            </p>
            </div>
          </motion.div>

          {/* Reviews Section */}
          <motion.div variants={itemVariant} className="glass-panel p-6 rounded-2xl">
            <h3 className="text-2xl font-bold font-['Outfit'] mb-6">Reviews & Comments</h3>
            
            {/* Write Review Form */}
            {canReview ? (
              <form onSubmit={handleReviewSubmit} className="mb-8 border-b border-white/10 pb-8">
                <h4 className="text-sm font-medium text-slate-300 mb-3">Write a review</h4>
                
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => setRating(star)}>
                      <Star size={24} className={star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full bg-black/20 focus:bg-black/40 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-xl px-4 py-3 text-white transition-all duration-300 mb-3 resize-none h-24 shadow-inner"
                ></textarea>
                <button type="submit" disabled={submittingReview} className="btn btn-primary text-sm px-4 py-2">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="mb-8 border-b border-white/10 pb-8">
                <p className="text-slate-400 text-sm italic bg-white/5 p-4 rounded-lg">
                  You can only review this motorcycle after you have rented and completed a booking for it.
                </p>
              </div>
            )}

            {/* Reviews List */}
            <div className="flex flex-col gap-6">
              {reviews.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="bg-white/5 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-200">{review.users?.name || 'Anonymous'}</span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-bold text-yellow-500">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Booking Form */}
        <motion.div variants={itemVariant}>
          <div className="glass-panel p-8 sticky top-28 relative overflow-hidden">
            {/* Animated background accent */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-secondary/10 blur-3xl"></div>
            
            <h3 className="text-2xl font-bold font-['Outfit'] mb-6 relative z-10 flex items-center gap-2">
              <Sparkles className="text-primary" size={24} />
              Book this ride
            </h3>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-white/10 to-white/5 p-1 rounded-xl mb-8 shadow-lg"
            >
              <div className="bg-bg-dark/90 backdrop-blur-md p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">Rate</p>
                  <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Rp {motorcycle.price_per_day?.toLocaleString('id-ID')} <span className="text-sm text-slate-400 font-normal">/ day</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Status</p>
                  <p className={`font-semibold uppercase text-sm px-2 py-1 rounded-md ${motorcycle.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {motorcycle.status}
                  </p>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }} 
                  animate={{ opacity: 1, height: 'auto', y: 0 }} 
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2 overflow-hidden"
                >
                  <div className="w-2 h-2 rounded-full bg-red-400 shrink-0"></div>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5 relative z-10">
              <div className="flex flex-col gap-2 group">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-primary transition-colors">Start Time</label>
                <div className="relative">
                  <input 
                    type="datetime-local" 
                    required
                    min={minDateTime}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-black/20 hover:bg-black/30 focus:bg-black/40 border border-white/5 focus:border-primary/50 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-inner"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2 group">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-primary transition-colors">End Time</label>
                <div className="relative">
                  <input 
                    type="datetime-local" 
                    required
                    min={startTime || minDateTime}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-black/20 hover:bg-black/30 focus:bg-black/40 border border-white/5 focus:border-primary/50 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-inner"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 group">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 group-focus-within:text-primary transition-colors">Payment Method</label>
                <div className="relative">
                  <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-black/20 hover:bg-black/30 focus:bg-black/40 border border-white/5 focus:border-primary/50 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="transfer" className="bg-bg-dark">💳 Bank Transfer</option>
                    <option value="cash" className="bg-bg-dark">💵 Cash on Pickup</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-6 border-t border-white/10 flex justify-end gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button" 
                  onClick={() => navigate('/catalog')} 
                  className="px-6 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-slate-300 transition-colors backdrop-blur-md"
                >
                  Cancel
                </motion.button>
                <motion.button 
                  whileHover={motorcycle.status === 'available' ? { scale: 1.02 } : {}}
                  whileTap={motorcycle.status === 'available' ? { scale: 0.95 } : {}}
                  type="submit" 
                  disabled={submitting || motorcycle.status !== 'available'} 
                  className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-secondary relative overflow-hidden group shadow-[0_0_20px_rgba(var(--color-primary),0.4)] disabled:opacity-50 border border-white/10"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    {submitting ? (
                      <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div> Confirming...</>
                    ) : 'Confirm Booking'}
                  </span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};
