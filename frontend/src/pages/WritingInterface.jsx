import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const WritingInterface = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  
  const [topic, setTopic] = useState(null);
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const MIN_WORDS = 1000;

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await api.get(`/topics/${topicId}`);
        setTopic(res.data);
      } catch (err) {
        setError('Topic not found or server error');
      }
    };
    fetchTopic();
  }, [topicId]);

  useEffect(() => {
    // Calculate word count
    const words = content.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [content]);

  const handleSubmit = async () => {
    if (wordCount < MIN_WORDS) return;

    setSubmitting(true);
    setError('');

    try {
      await api.post('/submissions', {
        topicId,
        content,
        wordCount
      });
      navigate(`/community/${topicId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
      setSubmitting(false);
    }
  };

  const handleAIAssist = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const res = await api.post('/ai/generate', {
        topicId,
        currentText: content.slice(-1500) // Send the last chunk to provide context
      });
      
      const generated = res.data.generatedText;
      setContent(prev => prev + (prev.endsWith(' ') || prev.endsWith('\n') || prev === '' ? '' : ' ') + generated);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate AI response. Try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (error && !topic) return <div className="container"><p className="text-danger">{error}</p></div>;
  if (!topic) return <div className="container"><p>Loading...</p></div>;

  const isComplete = wordCount >= MIN_WORDS;

  return (
    <div className="container" style={{ marginTop: '2rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2>{topic.title}</h2>
        <p className="text-secondary">{topic.description}</p>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <span style={{ fontWeight: 600 }}>Draft</span>
          <span style={{ 
            color: isComplete ? 'var(--success)' : 'var(--accent)',
            fontWeight: 600
          }}>
            {wordCount} / {MIN_WORDS} words
          </span>
        </div>
        
        <textarea
          style={{ 
            width: '100%', 
            minHeight: '60vh', 
            border: 'none', 
            borderRadius: 0,
            padding: '2rem',
            background: 'transparent',
            resize: 'vertical',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}
          placeholder="Start writing your submission here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {error && <span style={{ color: 'var(--danger)', flex: 1 }}>{error}</span>}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {!isComplete && <span className="text-secondary" style={{ fontSize: '0.9rem' }}>{MIN_WORDS - wordCount} words remaining</span>}
            
            <button 
              className="secondary" 
              disabled={isGenerating || submitting}
              onClick={handleAIAssist}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isGenerating ? '✨ Thinking...' : '✨ AI Assist'}
            </button>

            <button 
              className="primary" 
              disabled={!isComplete || submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Submitting...' : 'Submit to Book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingInterface;
