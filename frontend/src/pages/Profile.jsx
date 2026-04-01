import React, { useState, useEffect } from 'react';
import api from '../api';
import { User, Book, Edit3 } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);

        const subRes = await api.get(`/submissions/user/${parsedUser.id}`);
        setSubmissions(subRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <div className="container">Please log in to view profile.</div>;

  const totalWords = submissions.reduce((acc, curr) => acc + curr.wordCount, 0);

  return (
    <div className="container" style={{ marginTop: '2rem', maxWidth: '900px' }}>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          background: 'var(--accent)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <User size={48} color="white" />
        </div>
        <div>
          <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>{user.name}</h2>
          <p className="text-secondary" style={{ margin: 0 }}>{user.email}</p>
          {user.role === 'admin' && <span style={{ 
            display: 'inline-block', 
            marginTop: '0.5rem', 
            background: 'var(--danger)', 
            padding: '0.2rem 0.5rem', 
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>Admin</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Book size={32} className="text-accent" />
          <div>
            <h3 style={{ margin: 0 }}>{submissions.length}</h3>
            <p className="text-secondary" style={{ margin: 0 }}>Total Submissions</p>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Edit3 size={32} className="text-accent" />
          <div>
            <h3 style={{ margin: 0 }}>{totalWords.toLocaleString()}</h3>
            <p className="text-secondary" style={{ margin: 0 }}>Words Written</p>
          </div>
        </div>
      </div>

      <h3>Your Contributions</h3>
      {submissions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {submissions.map(sub => (
            <div key={sub._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0 }} className="text-accent">{sub.topic?.title || 'Unknown Topic'}</h4>
                <span className="text-secondary">{new Date(sub.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-secondary">{sub.wordCount} words</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-secondary mt-2">You haven't contributed to any topics yet.</p>
      )}
    </div>
  );
};

export default Profile;
