/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Lock, Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError('Invalid or missing reset token.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password || !confirmPassword) { setError('Both fields are required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      toast.success(response.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors placeholder:text-[var(--text-subtle)] ${
      hasError ? 'border-red-500' : 'border-[var(--border-base)]'
    }`;
  const inputStyle = { backgroundColor: 'var(--bg-input)', color: 'var(--text-base)' };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div
          className="max-w-md w-full p-8 rounded-2xl border border-red-500/30 shadow-xl text-center"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-base)' }}>Invalid Link</h2>
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
            The password reset link is invalid or missing the security token.
          </p>
          <Link to="/forgot-password" className="text-primary font-medium hover:opacity-80 transition-opacity">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div
        className="max-w-md w-full p-8 rounded-2xl border border-[var(--border-base)] shadow-xl"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary" size={28} />
          </div>
          <h2 className="text-3xl font-bold font-['Outfit']" style={{ color: 'var(--text-base)' }}>
            Set New Password
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Please enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="bg-green-500/10 border border-green-500/30 text-green-600 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle size={20} className="shrink-0" />
              <p className="text-sm text-left">Your password has been successfully reset. Redirecting to login...</p>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity">
              <ArrowLeft size={16} />
              Click here if not redirected
            </Link>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" size={18} />
                <input
                  id="password" name="password" type="password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className={inputClass(error && error.includes('match'))}
                  style={inputStyle} placeholder="New Password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" size={18} />
                <input
                  id="confirmPassword" name="confirmPassword" type="password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass(error && error.includes('match'))}
                  style={inputStyle} placeholder="Confirm New Password"
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
