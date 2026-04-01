import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Lock } from 'lucide-react';

const TopicCard = ({ topic }) => {
  const isClosed = topic.status === 'closed';
  
  const getProgress = () => {
    if (topic.thresholdType === 'submissions') {
      return (topic.currentSubmissions / topic.thresholdValue) * 100;
    }
    return (topic.currentWordCount / topic.thresholdValue) * 100;
  };

  const progress = Math.min(getProgress(), 100);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3>{topic.title}</h3>
          {isClosed && <Lock size={18} className="text-secondary" />}
        </div>
        <p className="text-secondary mt-1 mb-4">{topic.description}</p>
        
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '4px', height: '8px', overflow: 'hidden', marginBottom: '0.5rem' }}>
          <div style={{ 
            height: '100%', 
            width: `${progress}%`,
            background: isClosed ? 'var(--text-secondary)' : 'var(--accent)',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Users size={14} /> {topic.currentSubmissions} submissions
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FileText size={14} /> {topic.currentWordCount} words
          </span>
        </div>
        <div className="text-center mt-1" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Target: {topic.thresholdValue} {topic.thresholdType === 'submissions' ? 'Submissions' : 'Words'}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <Link to={`/community/${topic._id}`} style={{ flex: 1 }}>
          <button className="secondary w-full">Read</button>
        </Link>
        {!isClosed && (
          <Link to={`/write/${topic._id}`} style={{ flex: 1 }}>
            <button className="primary w-full">Contribute</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopicCard;
