/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { CardSkeleton } from '../components/ui/Skeleton.jsx';

export const Catalog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [motorcycles, setMotorcycles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedIds, setLikedIds] = useState(new Set());

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;

  const categories = [
    { id: '', name: 'All' },
    { id: '2cadedbb-178c-4918-a4a4-28bd27c3fa23', name: 'Matic' },
    { id: 'e490f5fe-396a-40df-b725-85e0821caaa7', name: 'Manual' },
    { id: 'e0853089-4fc9-45b4-9c70-c1bcbb6df3f4', name: 'Sport' }
  ];

  const sortOptions = [
    { id: 'terbaru', label: 'Newest Arrivals' },
    { id: 'terlama', label: 'Oldest Arrivals' },
    { id: 'a-z', label: 'Name: A to Z' },
    { id: 'z-a', label: 'Name: Z to A' },
  ];

  const fetchMotorcycles = async () => {
    try {
      setLoading(true);
      const params = { page, limit, search: searchQuery, category_id: selectedCategory, sort: sortBy };
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      const response = await api.get('/motorcycles', { params });
      if (response.data.meta) {
        setMotorcycles(response.data.data);
        setMeta(response.data.meta);
      } else {
        setMotorcycles(response.data);
        setMeta(null);
      }
    } catch (err) {
      setError('Failed to load motorcycles.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async () => {
    if (!user) { setLikedIds(new Set()); return; }
    try {
      const response = await api.get('/interactions/likes/me');
      setLikedIds(new Set(response.data.map(m => m.id)));
    } catch (err) {
      console.error('Failed to fetch likes:', err);
    }
  };

  const handleToggleLike = async (e, motorId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast('Please login to like motorcycles!', { icon: '🔒' });
      navigate('/login');
      return;
    }
    const isLiked = likedIds.has(motorId);
    setLikedIds(prev => {
      const s = new Set(prev);
      if (isLiked) s.delete(motorId); else s.add(motorId);
      return s;
    });
    try {
      const res = await api.post('/interactions/likes', { motorcycle_id: motorId });
      toast.success(res.data.message);
    } catch {
      setLikedIds(prev => {
        const s = new Set(prev);
        if (isLiked) s.add(motorId); else s.delete(motorId);
        return s;
      });
      toast.error('Failed to update favorite status');
    }
  };

  useEffect(() => { fetchMotorcycles(); }, [page, selectedCategory, sortBy]);
  useEffect(() => { fetchLikes(); }, [user]);
  useEffect(() => {
    const delay = setTimeout(() => { setPage(1); fetchMotorcycles(); }, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-20 max-w-7xl">
      {/* Header + Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
      >
        <div>
          <h2 className="text-4xl font-bold font-['Outfit'] mb-2" style={{ color: 'var(--text-base)' }}>
            Motorcycle Catalog
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Find the perfect ride for your journey.</p>
        </div>

        {/* Category Filter */}
        <div
          className="flex gap-2 p-1.5 rounded-xl border border-[var(--border-base)] backdrop-blur-md overflow-x-auto max-w-full"
          style={{ backgroundColor: 'var(--bg-panel)' }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id || 'all'}
              onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'hover:bg-[var(--bg-subtle)]'
              }`}
              style={selectedCategory !== cat.id ? { color: 'var(--text-muted)' } : {}}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search + Sort Toolbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-10"
      >
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" size={20} />
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-[var(--border-base)] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-[var(--text-subtle)]"
            style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--text-base)' }}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative min-w-[200px]">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="w-full flex items-center justify-between border border-[var(--border-base)] rounded-xl px-4 py-3.5 hover:border-primary/40 transition-colors"
            style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--text-base)' }}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm font-medium">{sortOptions.find(opt => opt.id === sortBy)?.label}</span>
            </div>
            <ChevronDown size={18} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
          </button>

          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 border border-[var(--border-base)] rounded-xl shadow-2xl overflow-hidden z-20"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSortBy(opt.id); setPage(1); setIsSortOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      sortBy === opt.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-[var(--bg-subtle)]'
                    }`}
                    style={sortBy !== opt.id ? { color: 'var(--text-muted)' } : {}}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {error && <div className="text-red-500 mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[...Array(12)].map((_, i) => <CardSkeleton key={i} />)}
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
            <Search size={32} style={{ color: 'var(--text-subtle)' }} />
          </div>
          <h3 className="text-2xl font-bold font-['Outfit'] mb-2" style={{ color: 'var(--text-base)' }}>
            No motorcycles found
          </h3>
          <p className="max-w-md mx-auto mb-6" style={{ color: 'var(--text-muted)' }}>
            We couldn't find any motorcycles matching your search criteria. Try adjusting your filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}
            className="btn btn-secondary mt-2"
          >
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {motorcycles.map((motor) => (
              <motion.div
                variants={itemVariants}
                key={motor.id}
                className="glass-panel p-6 flex flex-col group hover:border-primary/50 transition-colors"
              >
                {/* Image */}
                <div
                  className="h-48 rounded-xl mb-5 overflow-hidden relative border border-[var(--border-base)]"
                  style={{ backgroundColor: 'var(--bg-subtle)' }}
                >
                  {motor.image_url ? (
                    <img
                      src={motor.image_url}
                      alt={motor.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: 'var(--text-subtle)' }}>
                      No Image
                    </div>
                  )}

                  {/* Brand tag */}
                  <div
                    className="absolute top-3 right-3 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20"
                    style={{ backgroundColor: 'var(--bg-panel)' }}
                  >
                    {motor.brand}
                  </div>

                  {/* Like button */}
                  <button
                    onClick={(e) => handleToggleLike(e, motor.id)}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center border border-[var(--border-base)] hover:bg-[var(--bg-subtle)] transition-colors z-10"
                    style={{ backgroundColor: 'var(--bg-panel)' }}
                  >
                    <Heart
                      size={16}
                      className={likedIds.has(motor.id) ? 'fill-rose-500 text-rose-500' : ''}
                      style={!likedIds.has(motor.id) ? { color: 'var(--text-muted)' } : {}}
                    />
                  </button>
                </div>

                {/* Name */}
                <h3
                  className="text-xl font-semibold mb-1 font-['Outfit'] group-hover:text-primary transition-colors"
                  style={{ color: 'var(--text-base)' }}
                >
                  {motor.name}
                </h3>

                {/* Meta */}
                <p className="text-sm mb-4 capitalize flex items-center flex-wrap gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span
                    className="px-2 py-0.5 rounded-md border border-[var(--border-base)]"
                    style={{ backgroundColor: 'var(--bg-subtle)' }}
                  >
                    {motor.categories?.name || 'Standard'}
                  </span>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border-strong)' }}></span>
                  <span>{motor.cc}cc</span>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border-strong)' }}></span>
                  <span>{motor.color}</span>
                </p>

                {/* Price + Status */}
                <div className="flex justify-between items-end mt-auto mb-5">
                  <div>
                    <p className="text-xs mb-1 font-medium uppercase tracking-wider" style={{ color: 'var(--text-subtle)' }}>Rate</p>
                    <p className="text-secondary font-bold text-xl">
                      Rp {Number(motor.price_per_day).toLocaleString('id-ID')}
                      <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>/ day</span>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                    motor.status === 'available'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    {motor.status === 'available' ? 'Available' : 'Maintenance'}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  to={`/booking/${motor.id}`}
                  className={`btn w-full flex justify-center items-center gap-2 ${
                    motor.status === 'available' ? 'btn-primary' : 'cursor-not-allowed'
                  }`}
                  style={motor.status !== 'available'
                    ? { backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', border: '1px solid var(--border-base)' }
                    : {}
                  }
                  onClick={(e) => motor.status !== 'available' && e.preventDefault()}
                >
                  {motor.status === 'available' ? 'View Details' : 'Currently Unavailable'}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-3 rounded-xl border border-[var(--border-base)] hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--text-muted)' }}
              >
                <ArrowLeft size={20} />
              </button>

              <div className="flex gap-2">
                {[...Array(meta.totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-primary text-white shadow-lg shadow-primary/25'
                          : 'border border-[var(--border-base)] hover:border-primary/50 hover:text-primary'
                      }`}
                      style={page !== pageNum ? { backgroundColor: 'var(--bg-panel)', color: 'var(--text-muted)' } : {}}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="p-3 rounded-xl border border-[var(--border-base)] hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--text-muted)' }}
              >
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
