/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';

// Reusable adaptive input class
const inputClass = (hasError) =>
  `w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder:text-[var(--text-subtle)] ${
    hasError ? 'border-red-500' : 'border-[var(--border-base)]'
  }`;

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (email || password) validate();
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      toast.success('Successfully logged in! Welcome back.');
      if (response.data.user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="glass-panel p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold font-['Outfit'] mb-2 text-center" style={{ color: 'var(--text-base)' }}>
          Welcome Back
        </h2>
        <p className="text-center mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          Sign in to your GoRide account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass(errors.email)}
              style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-base)' }}
              placeholder="you@example.com"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass(errors.password)}
              style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-base)' }}
              placeholder="••••••••"
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
            <div className="flex justify-end mt-1">
              <Link to="/forgot-password" className="text-xs text-primary hover:opacity-80 transition-opacity">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="btn btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:opacity-80 transition-opacity font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
