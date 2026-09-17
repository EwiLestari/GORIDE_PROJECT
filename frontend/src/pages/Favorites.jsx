/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import { CardSkeleton } from '../components/ui/Skeleton.jsx';

export const Favorites = () => {
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/interactions/likes/me');
      setMotorcycles(response.data);
    } catch (err) {
      toast.error('Failed to load your favorite motorcycles.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (e, motorId) => {
    e.preventDefault();
    e.stopPropagation();
    setMotorcycles(prev => prev.filter(m => m.id !== motorId));
    try {
      await api.post('/interactions/likes', { motorcycle_id: motorId });
      toast.success('Removed from favorites');
    } catch {
      toast.error('Failed to remove from favorites');
      fetchFavorites();
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-20 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h2 className="text-4xl font-bold font-['Outfit'] mb-2 flex items-center gap-3" style={{ color: 'var(--text-base)' }}>
          <Heart className="text-rose-500 fill-rose-500" size={32} />
          My Favorites
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Motorcycles you have liked.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : motorcycles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center rounded-2xl py-20 px-6 border border-[var(--border-base)]"
          style={{ backgroundColor: 'var(--bg-panel)' }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'var(--bg-subtle)' }}
          >
            <Heart size={32} style={{ color: 'var(--text-subtle)' }} />
          </div>
          <h3 className="text-2xl font-bold font-['Outfit'] mb-2" style={{ color: 'var(--text-base)' }}>
            No favorites yet
          </h3>
          <p className="max-w-md mx-auto mb-6" style={{ color: 'var(--text-muted)' }}>
            You haven't added any motorcycles to your favorites yet. Explore our catalog and like the ones you love!
          </p>
          <Link to="/catalog" className="btn btn-primary">Explore Catalog</Link>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {motorcycles.map((motor) => (
            <motion.div
              variants={itemVariants}
              key={motor.id}
              className="glass-panel p-6 flex flex-col group hover:border-primary/50 transition-colors"
            >
              <div
                className="h-48 rounded-lg mb-6 overflow-hidden relative border border-[var(--border-base)]"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              >
                {motor.image_url ? (
                  <img src={motor.image_url} alt={motor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-subtle)' }}>No Image</div>
                )}
                {/* Brand tag */}
                <div
                  className="absolute top-3 right-3 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20"
                  style={{ backgroundColor: 'var(--bg-panel)' }}
                >
                  {motor.brand}
                </div>
                {/* Unlike Button */}
                <button
                  onClick={(e) => handleUnlike(e, motor.id)}
                  className="absolute top-3 left-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center border border-[var(--border-base)] hover:bg-[var(--bg-subtle)] transition-colors z-10"
                  style={{ backgroundColor: 'var(--bg-panel)' }}
                >
                  <Heart size={16} className="fill-rose-500 text-rose-500" />
                </button>
              </div>

              <h3 className="text-2xl font-semibold mb-1 font-['Outfit'] group-hover:text-primary transition-colors" style={{ color: 'var(--text-base)' }}>
                {motor.name}
              </h3>
              <p className="text-sm mb-4 capitalize flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <span className="px-2 py-0.5 rounded-md border border-[var(--border-base)]" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  {motor.categories?.name || 'Standard'}
                </span>
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border-strong)' }}></span>
                <span>{motor.cc}cc</span>
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border-strong)' }}></span>
                <span>{motor.color}</span>
              </p>

              <div className="flex justify-between items-end mt-auto mb-6">
                <div>
                  <p className="text-xs mb-1 font-medium uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Rate</p>
                  <p className="text-secondary font-bold text-xl">
                    Rp {Number(motor.price_per_day).toLocaleString('id-ID')}
                    <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>/ day</span>
                  </p>
                </div>
                <div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                    motor.status === 'available'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    {motor.status === 'available' ? 'Available' : 'Maintenance'}
                  </span>
                </div>
              </div>

              <Link
                to={`/booking/${motor.id}`}
                className={`btn w-full flex justify-center items-center gap-2 ${
                  motor.status === 'available'
                    ? 'btn-primary'
                    : 'cursor-not-allowed border border-[var(--border-base)]'
                }`}
                style={motor.status !== 'available' ? { backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' } : {}}
                onClick={(e) => motor.status !== 'available' && e.preventDefault()}
              >
                {motor.status === 'available' ? 'View Details' : 'Currently Unavailable'}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
