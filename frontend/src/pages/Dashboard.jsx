import React, { useState, useEffect } from 'react';
import api from '../api';
import TopicCard from '../components/TopicCard';

const Dashboard = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await api.get('/topics');
        setTopics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Available Topics</h2>
        <p className="text-secondary">Contribute your story to ongoing book projects.</p>
      </div>

      {loading ? (
        <p>Loading topics...</p>
      ) : topics.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {topics.map(topic => (
            <TopicCard key={topic._id} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p className="text-secondary">No active topics found.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
