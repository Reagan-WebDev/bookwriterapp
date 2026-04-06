import React, { useState, useEffect } from 'react';
import api from '../api';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

if (pdfMake && pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfMake && pdfFonts) {
  pdfMake.vfs = pdfFonts.vfs;
}

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
      const res = await api.get(`/submissions/topic/${topic._id}`);
      const submissions = res.data;
      
      const docDefinition = {
        info: {
          title: `${topic.title} - Compiled Book`,
          author: 'EchoWeave Community',
        },
        content: [
          { text: topic.title, fontSize: 26, bold: true, margin: [0, 0, 0, 10] },
          { text: topic.description, fontSize: 14, margin: [0, 0, 0, 20], color: '#666666' },
          { text: `Compiled On: ${new Date().toLocaleDateString()}`, margin: [0, 0, 0, 5] },
          { text: `Total Submissions: ${submissions.length}`, margin: [0, 0, 0, 5] },
          { text: `Total Words: ${topic.currentWordCount}`, margin: [0, 0, 0, 30] },
        ],
        defaultStyle: {
          fontSize: 12,
          lineHeight: 1.5,
        }
      };

      if (submissions.length === 0) {
        docDefinition.content.push({ text: 'No submissions found for this topic.', italics: true });
      }

      submissions.forEach((sub, index) => {
        const authorName = sub.user && sub.user.name ? sub.user.name : 'Anonymous';
        
        docDefinition.content.push({ 
          text: `Chapter ${index + 1}`, 
          fontSize: 18, 
          bold: true,
          pageBreak: index === 0 ? undefined : 'before',
          margin: [0, 20, 0, 5] 
        });
        
        docDefinition.content.push({ 
          text: `By: ${authorName}`, 
          italics: true, 
          color: '#666666',
          margin: [0, 0, 0, 15] 
        });
        
        docDefinition.content.push({ 
          text: sub.content, 
          alignment: 'justify',
          margin: [0, 0, 0, 20] 
        });
      });

      const fileName = `${topic.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_book.pdf`;
      pdfMake.createPdf(docDefinition).download(fileName);

    } catch (err) {
      console.error(err);
      alert(`Failed to compile book. Error: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h2>Admin Dashboard</h2>
      <p className="text-secondary mb-4">Manage topics and monitor the book writing progress.</p>

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
                Status: <span style={{ color: topic.status === 'open' ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>{topic.status.toUpperCase()}</span>
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
              {topic.status === 'closed' && (
                <button 
                  className="primary"
                  onClick={() => handleCompileBook(topic)}
                >
                  Compile Book
                </button>
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
