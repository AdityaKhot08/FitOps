import React, { useEffect, useState } from 'react';
import { api } from './services/api';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutTracker from './pages/WorkoutTracker';
import WeightTracker from './pages/WeightTracker';
import Goals from './pages/Goals';
import AICoach from './pages/AICoach';
import Profile from './pages/Profile';
import Contact from './pages/Contact';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = api.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUser(api.auth.getCurrentUser());
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('home');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    api.auth.logout();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('home');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-glass)', borderTopColor: 'var(--primary-cyan)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>Initializing FitOps Core...</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
      </div>
    );
  }

  // Router dispatcher
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} isAuthenticated={isAuthenticated} />;
      case 'login':
        return <Login setCurrentPage={setCurrentPage} handleLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return <Register setCurrentPage={setCurrentPage} handleLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        return isAuthenticated ? <Dashboard setCurrentPage={setCurrentPage} /> : <Login setCurrentPage={setCurrentPage} handleLoginSuccess={handleLoginSuccess} />;
      case 'workouts':
        return isAuthenticated ? <WorkoutTracker /> : <Login setCurrentPage={setCurrentPage} handleLoginSuccess={handleLoginSuccess} />;
      case 'weights':
        return isAuthenticated ? <WeightTracker /> : <Login setCurrentPage={setCurrentPage} handleLoginSuccess={handleLoginSuccess} />;
      case 'goals':
        return isAuthenticated ? <Goals /> : <Login setCurrentPage={setCurrentPage} handleLoginSuccess={handleLoginSuccess} />;
      case 'ai':
        return isAuthenticated ? <AICoach /> : <Login setCurrentPage={setCurrentPage} handleLoginSuccess={handleLoginSuccess} />;
      case 'profile':
        return isAuthenticated ? <Profile /> : <Login setCurrentPage={setCurrentPage} handleLoginSuccess={handleLoginSuccess} />;
      case 'contact':
        return <Contact />;
      default:
        return <Home setCurrentPage={setCurrentPage} isAuthenticated={isAuthenticated} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      {isAuthenticated && (
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          user={user}
          handleLogout={handleLogout}
        />
      )}

      {/* Top Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      {isAuthenticated ? (
        <main className="main-content" style={{ marginTop: '30px' }}>
          {renderPage()}
        </main>
      ) : (
        <div style={{ flex: 1, padding: '75px 0 0 0', minHeight: '100vh', width: '100%' }}>
          {renderPage()}
        </div>
      )}
    </div>
  );
}
