import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [error, setError] = useState('');

  // 👇 NEW STATES
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm) {
      return setError('Passwords do not match');
    }

    try {
      const { name, email, password } = formData;

      const res = await api.post('/auth/register', {
        name,
        email,
        password,
      });

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

      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '4rem' }}>
      <div className="card">
        <div className="text-center mb-4">
          <UserPlus size={48} className="text-accent mb-2" style={{ margin: '0 auto' }} />
          <h2>Create an Account</h2>
          <p className="text-secondary">Join the crowd and start writing</p>
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
            <label>Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

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

          {/* 👇 PASSWORD FIELD */}
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

          {/* 👇 CONFIRM PASSWORD FIELD */}
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Confirm Password</label>

            <input
              type={showConfirm ? 'text' : 'password'}
              required
              value={formData.confirm}
              onChange={(e) =>
                setFormData({ ...formData, confirm: e.target.value })
              }
              style={{ paddingRight: '40px' }}
            />

            <span
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '38px',
                cursor: 'pointer',
                color: '#888',
              }}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit" className="primary w-full mt-2">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-accent">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;