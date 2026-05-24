import React, { useState } from 'react';
import { api } from '../services/api';
import { Lock, Mail, User as UserIcon, RefreshCw, AlertCircle } from 'lucide-react';

export default function Register({ setCurrentPage, handleLoginSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all details');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.auth.register(name, email, password);
      if (res.success) {
        handleLoginSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Try a different email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>Join FitOps AI</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Initialize your performance telemetry profile</p>
        </div>

        {error && (
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 8, 68, 0.1)', color: '#ff0844', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', alignItems: 'center' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.75rem', width: '100%' }}
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.75rem', width: '100%' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.75rem', width: '100%' }}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.75rem', width: '100%' }}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
            {loading ? <RefreshCw className="animate-spin" size={18} /> : 'Create Profile'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <span style={{ color: 'var(--primary-cyan)', cursor: 'pointer', fontWeight: '600' }} onClick={() => setCurrentPage('login')}>
            Sign In here
          </span>
        </p>
      </div>
    </div>
  );
}
