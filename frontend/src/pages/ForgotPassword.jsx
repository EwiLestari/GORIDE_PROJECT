import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Invalid email format'); return; }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success(response.data.message || 'Reset link sent!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
      toast.error('Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div
        className="max-w-md w-full p-8 rounded-2xl border border-[var(--border-base)] shadow-xl"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="text-primary" size={28} />
          </div>
          <h2 className="text-3xl font-bold font-['Outfit']" style={{ color: 'var(--text-base)' }}>
            Forgot Password
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-6">
            <div className="bg-green-500/10 border border-green-500/30 text-green-600 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle size={20} className="shrink-0" />
              <p className="text-sm text-left">Check your email for the reset link! If you don't see it, check your spam folder.</p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" size={18} />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors placeholder:text-[var(--text-subtle)] ${
                    error ? 'border-red-500' : 'border-[var(--border-base)]'
                  }`}
                  style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-base)' }}
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              >
                <ArrowLeft size={16} />
                Remember your password? Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
