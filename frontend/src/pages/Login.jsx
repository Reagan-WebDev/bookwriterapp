import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { LogIn, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 NEW

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        })
      );

      // Force reload to update Navbar state
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '4rem' }}>
      <div className="card">
        <div className="text-center mb-4">
          <LogIn size={48} className="text-accent mb-2" style={{ margin: '0 auto' }} />
          <h2>Welcome Back</h2>
          <p className="text-secondary">Login to continue weaving stories</p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* 👇 UPDATED PASSWORD FIELD */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Password</label>

            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={{ paddingRight: '40px' }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '38px',
                cursor: 'pointer',
                color: '#888',
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit" className="primary w-full mt-2">
            Sign In
          </button>
        </form>

        <p className="text-center mt-4 text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;