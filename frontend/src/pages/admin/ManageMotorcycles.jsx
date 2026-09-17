/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Bike, Image as ImageIcon, Search, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { MotorcycleModal } from './MotorcycleModal.jsx';

export const ManageMotorcycles = () => {
  const [motorcycles, setMotorcycles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('terbaru');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMotorcycle, setSelectedMotorcycle] = useState(null);

  const fetchMotorcycles = async () => {
    try {
      setLoading(true);
      const params = { page, limit, search, status, sort };
      Object.keys(params).forEach(key => !params[key] && delete params[key]);

      const response = await api.get('/motorcycles', { params });
      if (response.data.meta) {
        setMotorcycles(response.data.data);
        setMeta(response.data.meta);
      } else {
        setMotorcycles(response.data);
      }
    } catch (err) {
      toast.error('Failed to load motorcycles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotorcycles();
  }, [page, limit, status, sort]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchMotorcycles();
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this motorcycle? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/motorcycles/${id}`);
      toast.success('Motorcycle deleted successfully!');
      fetchMotorcycles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete motorcycle');
    }
  };

  const openAddModal = () => {
    setSelectedMotorcycle(null);
    setIsModalOpen(true);
  };

  const openEditModal = (motor) => {
    setSelectedMotorcycle(motor);
    setIsModalOpen(true);
  };

  const handleSaveMotorcycle = async (formData, id) => {
    try {
      if (id) {
        await api.put(`/motorcycles/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Motorcycle updated successfully!');
      } else {
        await api.post('/motorcycles', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Motorcycle added successfully!');
      }
      fetchMotorcycles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save motorcycle');
      throw err; // Rethrow to let the modal know it failed
    }
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-20 max-w-7xl animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-bold font-['Outfit']">Manage Fleet</h2>
          <p className="text-slate-400 mt-2">Add, edit, or remove motorcycles from the catalog.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary/20" onClick={openAddModal}>
          <Plus size={18} />
          Add Motorcycle
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-bg-dark border border-white/5 p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search keyword..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-all"
          >
            <option value="" className="bg-bg-dark">All Status</option>
            <option value="available" className="bg-bg-dark">Available</option>
            <option value="unavailable" className="bg-bg-dark">Unavailable</option>
            <option value="maintenance" className="bg-bg-dark">Maintenance</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={sort} 
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-all"
          >
            <option value="terbaru" className="bg-bg-dark">Terbaru (Newest)</option>
            <option value="terlama" className="bg-bg-dark">Terlama (Oldest)</option>
            <option value="a-z" className="bg-bg-dark">A-Z</option>
            <option value="z-a" className="bg-bg-dark">Z-A</option>
          </select>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-semibold text-slate-300 text-sm">Image</th>
                <th className="p-4 font-semibold text-slate-300 text-sm">Details</th>
                <th className="p-4 font-semibold text-slate-300 text-sm">Specs</th>
                <th className="p-4 font-semibold text-slate-300 text-sm">Price / Day</th>
                <th className="p-4 font-semibold text-slate-300 text-sm">Status / Stock</th>
                <th className="p-4 font-semibold text-slate-300 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">Loading catalog...</td>
                </tr>
              ) : motorcycles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">No motorcycles found.</td>
                </tr>
              ) : (
                motorcycles.map((motor) => (
                  <tr key={motor.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="w-16 h-12 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                        {motor.image_url ? (
                          <img src={motor.image_url} alt={motor.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={16} className="text-slate-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white font-['Outfit']">{motor.name}</p>
                      <p className="text-xs text-primary font-mono">{motor.license_plate}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-300 capitalize">{motor.brand} • {motor.categories?.name}</p>
                      <p className="text-xs text-slate-500">{motor.cc}cc • {motor.color}</p>
                    </td>
                    <td className="p-4 font-medium text-slate-200">
                      Rp {Number(motor.price_per_day).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${motor.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' : motor.status === 'maintenance' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {motor.status}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">Stock: {motor.stock}</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(motor)}
                          className="p-2 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(motor.id)}
                          className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {meta && (
          <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5">
            <div className="text-sm text-slate-400">
              Showing <span className="font-semibold text-white">{motorcycles.length}</span> of <span className="font-semibold text-white">{meta.total}</span> entries
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Per page:</span>
                <select 
                  value={limit} 
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="bg-bg-dark border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-primary"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="px-4 py-2 text-sm font-medium bg-white/5 rounded min-w-[3rem] text-center">
                  {page} / {meta.totalPages || 1}
                </div>
                <button 
                  onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                  disabled={page === (meta.totalPages || 1)}
                  className="p-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <MotorcycleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedMotorcycle}
        onSave={handleSaveMotorcycle}
      />
    </div>
  );
};

