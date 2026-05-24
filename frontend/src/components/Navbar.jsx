import React, { useState } from 'react';
import { api } from '../services/api';
import { Cpu, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage, isAuthenticated, handleLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTo = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  // Render a responsive top navbar for authenticated users in mobile layouts
  if (isAuthenticated) {
    return (
      <header
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'rgba(9, 10, 15, 0.95)',
          borderBottom: '1px solid var(--border-glass)',
          backdropFilter: 'blur(10px)',
          zIndex: 99,
          padding: '0 1.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="mobile-header"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <Cpu size={20} color="var(--primary-cyan)" />
          <span>FitOps AI</span>
        </div>
        
        <button
          onClick={() => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
              if (sidebar.style.transform === 'translateX(0px)') {
                sidebar.style.transform = 'translateX(-260px)';
              } else {
                sidebar.style.transform = 'translateX(0px)';
              }
            }
          }}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <Menu size={22} />
        </button>

        {/* Global style injection for mobile layout toggle */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 992px) {
            .mobile-header { display: flex !important; }
            .sidebar {
              transform: translateX(-260px);
              box-shadow: 10px 0 30px rgba(0,0,0,0.5);
            }
          }
        `}} />
      </header>
    );
  }

  // Render standard landing header
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '75px',
        background: 'rgba(9, 10, 15, 0.75)',
        borderBottom: '1px solid var(--border-glass)',
        backdropFilter: 'blur(15px)',
        zIndex: 99,
        padding: '0 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      className="fade-in"
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800', fontSize: '1.3rem', cursor: 'pointer', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        onClick={() => navTo('home')}
      >
        <Cpu size={24} color="var(--primary-cyan)" style={{ animation: 'pulseNeon 3s infinite' }} />
        <span>FitOps AI</span>
      </div>

      {/* Desktop Links */}
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); navTo('home'); }}
          style={{ color: currentPage === 'home' ? '#fff' : 'var(--text-muted)', textDecoration: 'none', fontWeight: '600', transition: 'var(--transition)' }}
        >
          Home
        </a>
        <button
          className="btn btn-secondary"
          onClick={() => navTo('login')}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
        >
          Sign In
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navTo('register')}
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          Register <ArrowRight size={14} />
        </button>
      </nav>

      {/* Mobile Menu trigger */}
      <button
        style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        className="mobile-trigger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu links */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '75px',
            left: 0,
            right: 0,
            background: '#090a0f',
            borderBottom: '1px solid var(--border-glass)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
          }}
          className="fade-in"
        >
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); navTo('home'); }}
            style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}
          >
            Home
          </a>
          <button
            className="btn btn-secondary"
            onClick={() => navTo('login')}
            style={{ width: '100%' }}
          >
            Sign In
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navTo('register')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
          >
            Register <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Global layout responsiveness style override */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-trigger { display: block !important; }
        }
      `}} />
    </header>
  );
}
