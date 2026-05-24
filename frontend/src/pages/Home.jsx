import React from 'react';
import { Flame, Shield, Cpu, Activity, ArrowRight, TrendingUp } from 'lucide-react';

export default function Home({ setCurrentPage, isAuthenticated }) {
  return (
    <div className="landing-hero fade-in">
      <div className="hero-glow"></div>
      
      <span className="streak-badge" style={{ marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>
        <Cpu size={14} /> DevOps & AI Integrated Fitness
      </span>

      <h1 className="hero-title">
        Optimize Your Body <br />
        <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFill-color: 'transparent' }}>
          Powered by FitOps AI
        </span>
      </h1>

      <p className="hero-subtitle">
        Track your exercises, monitor body weight metrics, visualize splits in real-time, and let our intelligent engine prescribe targeted workouts tailored specifically to your biometrics and progression trends.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {isAuthenticated ? (
          <button className="btn btn-primary" onClick={() => setCurrentPage('dashboard')}>
            Access Dashboard <ArrowRight size={18} />
          </button>
        ) : (
          <>
            <button className="btn btn-primary" onClick={() => setCurrentPage('register')}>
              Get Started Free <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('login')}>
              Sign In to Profile
            </button>
          </>
        )}
      </div>

      {/* Feature Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px', marginTop: '6rem', textAlign: 'left' }}>
        <div className="glass-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--primary-cyan)', marginBottom: '1rem' }}>
            <Cpu size={24} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>AI recommendation</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            The AI Coach analyzes training imbalances, goals, and weight stalls to prescribe highly personalized workout routines.
          </p>
        </div>

        <div className="glass-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(177, 159, 251, 0.1)', color: '#b19ffb', marginBottom: '1rem' }}>
            <Activity size={24} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Telemetry Tracking</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Log workouts, reps, sets, and weight volume. Compute active streaks, caloric burns, and muscle groups instantly.
          </p>
        </div>

        <div className="glass-card">
          <div className="metric-icon-wrapper" style={{ background: 'rgba(252, 132, 182, 0.1)', color: '#fc84b6', marginBottom: '1rem' }}>
            <TrendingUp size={24} />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Weight & Goal Telemetry</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Track scale weight, establish deadlines, and complete milestones with real-time completion bar parameters.
          </p>
        </div>
      </div>
    </div>
  );
}
