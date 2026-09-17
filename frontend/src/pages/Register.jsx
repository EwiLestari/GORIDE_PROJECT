/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const inputClass = (hasError) =>
  `w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-[var(--text-subtle)] ${
    hasError ? 'border-red-500' : 'border-[var(--border-base)]'
  }`;

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Full Name is required';
    else if (name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (name || email || password || confirmPassword) validate();
  }, [name, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      const loginRes = await api.post('/auth/login', { email, password });
      login(loginRes.data.user, loginRes.data.token);
      toast.success('Account created successfully! Welcome to GoRide.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { backgroundColor: 'var(--bg-input)', color: 'var(--text-base)' };

  return (
    <div className="container mx-auto px-6 py-12 min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="glass-panel p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold font-['Outfit'] mb-2 text-center" style={{ color: 'var(--text-base)' }}>
          Create Account
        </h2>
        <p className="text-center mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          Join GoRide and start exploring Bandung
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Full Name</label>
            <input
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass(errors.name)} style={inputStyle}
              placeholder="John Doe"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Email Address</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass(errors.email)} style={inputStyle}
              placeholder="you@example.com"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Password</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass(errors.password)} style={inputStyle}
              placeholder="••••••••"
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Confirm Password</label>
            <input
              type="password" required value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass(errors.confirmPassword)} style={inputStyle}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="btn btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:opacity-80 transition-opacity font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
