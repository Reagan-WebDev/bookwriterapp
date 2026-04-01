import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SubmissionCard = ({ submission }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Create a short excerpt
  const excerpt = submission.content.slice(0, 300) + (submission.content.length > 300 ? '...' : '');

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0 }} className="text-accent">{submission.user?.name || 'Anonymous User'}</h4>
        <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
          {new Date(submission.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <div style={{ 
        whiteSpace: 'pre-wrap', 
        lineHeight: 1.6, 
        color: 'var(--text-secondary)'
      }}>
        {expanded ? submission.content : excerpt}
      </div>
      
      {submission.content.length > 300 && (
        <button 
          className="secondary mt-3" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <><ChevronUp size={16} /> Show Less</>
          ) : (
            <><ChevronDown size={16} /> Read Full Submission</>
          )}
        </button>
      )}
    </div>
  );
};

const Community = () => {
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopicAndSubmissions = async () => {
      try {
        const [topicRes, subRes] = await Promise.all([
          api.get(`/topics/${topicId}`),
          api.get(`/submissions/topic/${topicId}`)
        ]);
        setTopic(topicRes.data);
        setSubmissions(subRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopicAndSubmissions();
  }, [topicId]);

  if (loading) return <div className="container"><p>Loading community submissions...</p></div>;
  if (!topic) return <div className="container"><p>Topic not found.</p></div>;

  return (
    <div className="container" style={{ marginTop: '2rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Community Contributions</h2>
          <p className="text-secondary">Reading submissions for: <span className="text-primary">{topic.title}</span></p>
        </div>
        {topic.status !== 'closed' && (
          <Link to={`/write/${topic._id}`}>
            <button className="primary">Add Your Story</button>
          </Link>
        )}
      </div>

      {submissions.length > 0 ? (
        <div>
          {submissions.map(sub => (
            <SubmissionCard key={sub._id} submission={sub} />
          ))}
        </div>
      ) : (
        <div className="card text-center text-secondary">
          No submissions yet for this topic. Be the first!
        </div>
      )}
    </div>
  );
};

export default Community;
