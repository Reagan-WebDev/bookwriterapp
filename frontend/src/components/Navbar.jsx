import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header style={{ 
      padding: '1rem 2rem', 
      borderBottom: '1px solid var(--border)', 
      background: 'rgba(30, 41, 59, 0.4)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BookOpen className="text-accent" />
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Echo<span className="text-accent">Weave</span></h1>
      </Link>
      
      <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {token ? (
          <>
            <Link to="/">Dashboard</Link>
            {user?.role === 'admin' && <Link to="/admin" className="text-accent">Admin</Link>}
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User size={18} /> {user?.name}
              </Link>
              <button 
                onClick={handleLogout}
                className="secondary" 
                style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">
              <button className="primary" style={{ padding: '0.5rem 1.5rem' }}>Sign Up</button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
