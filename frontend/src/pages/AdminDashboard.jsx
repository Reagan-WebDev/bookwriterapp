import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminDashboard = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    thresholdType: 'submissions',
    thresholdValue: 10
  });

  const fetchTopics = async () => {
    try {
      const res = await api.get('/topics');
      setTopics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      await api.post('/topics', newTopic);
      setNewTopic({ title: '', description: '', thresholdType: 'submissions', thresholdValue: 10 });
      fetchTopics();
    } catch (err) {
      console.error(err);
      alert('Failed to create topic');
    }
  };

  const handleCloseTopic = async (id) => {
    try {
      await api.put(`/topics/${id}/close`);
      fetchTopics();
    } catch (err) {
      console.error(err);
      alert('Failed to close topic');
    }
  };

  const handleCompileBook = async (topic) => {
    try {
      await api.put(`/topics/${topic._id}/compile`);
      alert(`Success! "${topic.title}" has been compiled and moved to the Library.`);
      fetchTopics(); // Refresh to update UI
    } catch (err) {
      console.error(err);
      alert(`Failed to compile book. Error: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h2>Admin Dashboard</h2>
      <p className="text-secondary mb-4">Manage topics and supervise writing limits.</p>

      <div className="card mb-4">
        <h3>Create New Topic</h3>
        <form onSubmit={handleCreateTopic} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              required
              value={newTopic.title}
              onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              required
              rows="3"
              style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border)', borderRadius: '8px', width: '100%', resize: 'vertical' }}
              value={newTopic.description}
              onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
            ></textarea>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Threshold Type</label>
              <select 
                style={{ width: '100%', padding: '0.8rem', background: 'rgba(15, 23, 42, 0.6)', color: 'white', border: '1px solid var(--border)', borderRadius: '8px' }}
                value={newTopic.thresholdType}
                onChange={(e) => setNewTopic({ ...newTopic, thresholdType: e.target.value })}
              >
                <option value="submissions">Submissions Count</option>
                <option value="wordCount">Total Word Count</option>
              </select>
            </div>
            <div className="form-group">
              <label>Threshold Value</label>
              <input 
                type="number" 
                required
                min="1"
                value={newTopic.thresholdValue}
                onChange={(e) => setNewTopic({ ...newTopic, thresholdValue: Number(e.target.value) })}
              />
            </div>
          </div>
          <button type="submit" className="primary mt-2">Publish Topic</button>
        </form>
      </div>

      <h3>Active Topics</h3>
      <div style={{ marginTop: '1rem' }}>
        {topics.map(topic => (
          <div key={topic._id} className="card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>{topic.title}</h4>
              <p className="text-secondary" style={{ margin: 0, fontSize: '0.9rem' }}>
                Status: <span style={{ color: topic.status === 'open' ? 'var(--success)' : topic.isCompiled ? 'var(--accent)' : 'var(--danger)', fontWeight: 'bold' }}>
                  {topic.isCompiled ? 'COMPILED' : topic.status.toUpperCase()}
                </span>
                {' | '}
                {topic.currentSubmissions} subs / {topic.currentWordCount} words 
                {' '} (Target: {topic.thresholdValue} {topic.thresholdType})
              </p>
            </div>
            <div>
              {topic.status === 'open' && (
                <button 
                  style={{ background: 'var(--danger)', color: 'white' }}
                  onClick={() => handleCloseTopic(topic._id)}
                >
                  Force Close
                </button>
              )}
              {topic.status === 'closed' && !topic.isCompiled && (
                <button 
                  className="primary"
                  onClick={() => handleCompileBook(topic)}
                >
                  Compile to Library
                </button>
              )}
              {topic.isCompiled && (
                <span className="text-accent" style={{ fontWeight: 'bold' }}>✓ In Library</span>
              )}
            </div>
          </div>
        ))}
        {topics.length === 0 && <p className="text-secondary text-center">No topics available.</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
