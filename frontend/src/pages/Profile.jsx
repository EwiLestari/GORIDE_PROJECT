import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Camera, Save, User as UserIcon, Mail, Shield } from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const inputClass = 'w-full border border-[var(--border-base)] rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[var(--text-subtle)]';

export const Profile = () => {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const defaultAvatarUrl = `http://localhost:5000/uploads/avatar_${user?.id}.jpg?t=${Date.now()}`;
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatarUrl);
  const [avatarError, setAvatarError] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarError(false);
      try {
        const fd = new FormData();
        fd.append('avatar', file);
        const res = await api.post('/users/profile/avatar', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(res.data.message || 'Avatar updated successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to upload avatar');
        setAvatarPreview(defaultAvatarUrl);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      const res = await api.put('/users/profile', payload);
      const token = localStorage.getItem('token');
      login(res.data.user, token);
      toast.success('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-6 pt-32 text-center text-xl" style={{ color: 'var(--text-muted)' }}>
        Please login to view profile.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h2 className="text-4xl font-bold font-['Outfit']" style={{ color: 'var(--text-base)' }}>
          Profile Settings
        </h2>
        <p className="mt-2" style={{ color: 'var(--text-muted)' }}>Manage your account details and preferences.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Sidebar: Avatar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/3 flex flex-col gap-6"
        >
          <div className="glass-panel p-8 text-center relative flex flex-col items-center">
            <div
              className="relative group cursor-pointer mb-6"
              onClick={() => fileInputRef.current?.click()}
            >
              <div
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--border-base)] flex items-center justify-center relative shadow-xl"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              >
                {!avatarError ? (
                  <img
                    src={avatarPreview}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="text-5xl font-bold text-primary uppercase">
                    {user.name.charAt(0)}
                  </span>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
                  <Camera className="text-white mb-1" size={24} />
                  <span className="text-xs text-white font-medium">Change Photo</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-[var(--bg-base)] shadow-lg">
                <Camera size={14} className="text-white" />
              </div>
            </div>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />

            <h3 className="text-2xl font-bold font-['Outfit'] mb-1" style={{ color: 'var(--text-base)' }}>
              {user.name}
            </h3>
            <div
              className="flex items-center gap-2 justify-center text-sm px-3 py-1 rounded-full border border-[var(--border-base)]"
              style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
            >
              <Shield size={14} className="text-primary" />
              <span className="capitalize">{user.role}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Content: Profile Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-2/3"
        >
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold font-['Outfit'] mb-6 flex items-center gap-2" style={{ color: 'var(--text-base)' }}>
              <UserIcon size={20} className="text-primary" /> Personal Information
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                  <div className="relative">
                    <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input
                      type="text" name="name" required value={formData.name} onChange={handleChange}
                      className={`${inputClass} pl-12`}
                      style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-base)' }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className={`${inputClass} pl-12`}
                      style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-base)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-[var(--border-base)] my-2"></div>

              <h3 className="text-xl font-bold font-['Outfit'] mb-2 flex items-center gap-2" style={{ color: 'var(--text-base)' }}>
                <Shield size={20} className="text-primary" /> Security
              </h3>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  New Password{' '}
                  <span className="text-xs font-normal" style={{ color: 'var(--text-subtle)' }}>
                    (Leave blank to keep current)
                  </span>
                </label>
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  placeholder="••••••••"
                  className={inputClass}
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-base)' }}
                  minLength="6"
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex items-center gap-2 shadow-lg shadow-primary/20 px-8 py-3"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Save size={18} /> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
