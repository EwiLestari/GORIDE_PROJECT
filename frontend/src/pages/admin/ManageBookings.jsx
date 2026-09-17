/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Calendar, AlertCircle, RefreshCw, XCircle, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('terbaru');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = { page, limit, status, sort };
      Object.keys(params).forEach(key => !params[key] && delete params[key]);

      const response = await api.get('/bookings', { params });
      
      if (response.data.meta) {
        setBookings(response.data.data);
        setMeta(response.data.meta);
      } else {
        setBookings(response.data);
      }
    } catch (err) {
      setError('Failed to load bookings data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, limit, status, sort]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      await api.patch(`/bookings/${id}/status`, { status: newStatus });
      toast.success(`Booking status updated to ${newStatus}`);
      fetchBookings(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm('Are you sure you want to process the return for this booking?')) return;
    
    try {
      setUpdating(true);
      // Ensure we send current time as actual_return_time
      const actual_return_time = new Date().toISOString();
      const res = await api.patch(`/bookings/${id}/return`, { actual_return_time });
      if (res.data.late_fee > 0) {
        toast.error(`Return processed with a late fee of Rp ${res.data.late_fee.toLocaleString('id-ID')}`, { duration: 5000 });
      } else {
        toast.success('Return processed successfully! No late fees.');
      }
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process return');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded-md uppercase">Confirmed</span>;
      case 'completed': return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-md uppercase">Completed</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-md uppercase">Cancelled</span>;
      default: return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-md uppercase">Pending</span>;
    }
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-20 max-w-7xl animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-bold font-['Outfit']">Manage Bookings</h2>
          <p className="text-slate-400 mt-2">View and manage all customer reservations.</p>
        </div>
        <button 
          onClick={fetchBookings} 
          className="btn bg-white/5 hover:bg-white/10 flex items-center gap-2"
          disabled={loading || updating}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-bg-dark border border-white/5 p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-center">
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-all"
          >
            <option value="" className="bg-bg-dark">All Status</option>
            <option value="pending" className="bg-bg-dark">Pending</option>
            <option value="confirmed" className="bg-bg-dark">Confirmed</option>
            <option value="completed" className="bg-bg-dark">Completed</option>
            <option value="cancelled" className="bg-bg-dark">Cancelled</option>
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
          </select>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-semibold text-slate-300 text-sm">ID / Date</th>
                <th className="p-4 font-semibold text-slate-300 text-sm">Customer</th>
                <th className="p-4 font-semibold text-slate-300 text-sm">Motorcycle</th>
                <th className="p-4 font-semibold text-slate-300 text-sm">Rental Period</th>
                <th className="p-4 font-semibold text-slate-300 text-sm">Amount</th>
                <th className="p-4 font-semibold text-slate-300 text-sm">Status</th>
                <th className="p-4 font-semibold text-slate-300 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    <div className="flex justify-center mb-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-mono text-xs text-slate-300">#{booking.id.substring(0,6)}</p>
                      <p className="text-xs text-slate-500">{format(new Date(booking.created_at), 'dd MMM yyyy')}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-white">{booking.users?.name}</p>
                      <p className="text-xs text-slate-400">{booking.users?.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-white">{booking.motorcycles?.name}</p>
                      <p className="text-xs text-primary font-mono">{booking.motorcycles?.license_plate}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-xs text-slate-300">
                        <div className="flex items-center gap-1"><Calendar size={12} className="text-slate-500"/> {format(new Date(booking.start_time), 'dd MMM, HH:mm')}</div>
                        <div className="flex items-center gap-1"><Clock size={12} className="text-slate-500"/> {format(new Date(booking.end_time), 'dd MMM, HH:mm')}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-secondary">Rp {booking.total_price?.toLocaleString('id-ID')}</p>
                      <p className="text-xs text-slate-500 capitalize">{booking.payment_method}</p>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(booking.status)}
                      {booking.late_fee > 0 && <p className="text-[10px] text-rose-400 mt-1 font-bold">+ Late Fee</p>}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              disabled={updating}
                              className="p-2 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                              title="Confirm Booking"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                              disabled={updating}
                              className="p-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors"
                              title="Cancel Booking"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button 
                            onClick={() => handleReturn(booking.id)}
                            disabled={updating}
                            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            Process Return
                          </button>
                        )}
                        {(booking.status === 'completed' || booking.status === 'cancelled') && (
                          <span className="text-xs text-slate-500 font-medium">No actions</span>
                        )}
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
              Showing <span className="font-semibold text-white">{bookings.length}</span> of <span className="font-semibold text-white">{meta.total}</span> entries
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
    </div>
  );
};
