import React from 'react';
import { api } from '../services/api';
import { Cpu, LayoutDashboard, Dumbbell, Scale, Trophy, LogOut, User, MessageSquare } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, user, handleLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'workouts', label: 'Workout Tracker', icon: <Dumbbell size={18} /> },
    { id: 'weights', label: 'Weight Tracker', icon: <Scale size={18} /> },
    { id: 'goals', label: 'Goal Tracker', icon: <Trophy size={18} /> },
    { id: 'ai', label: 'AI Coach', icon: <Cpu size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'contact', label: 'Support Contact', icon: <MessageSquare size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => setCurrentPage('dashboard')}>
        <Cpu size={26} color="var(--primary-cyan)" style={{ animation: 'pulseNeon 3s infinite' }} />
        <span>FitOps AI</span>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(item.id);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge" style={{ marginBottom: '1rem' }}>
          <div className="user-badge-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-badge-info">
            <span className="user-badge-name">{user?.name || 'Athlete'}</span>
            <span className="user-badge-role">Gym Member</span>
          </div>
        </div>

        <button
          className="btn btn-secondary"
          onClick={handleLogout}
          style={{ width: '100%', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#ffb199', borderColor: 'rgba(255, 177, 153, 0.1)' }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
