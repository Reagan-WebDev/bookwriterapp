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
  
  // AI Panel States
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiPromptText, setAiPromptText] = useState('');
  const [aiResponse, setAiResponse] = useState('');

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
    setIsAiPanelOpen(true);
  };

  const handleAskAI = async () => {
    if (!aiPromptText.trim()) return;
    setIsGenerating(true);
    setAiResponse('');
    
    try {
      const res = await api.post('/ai/generate', {
        topicId,
        currentText: content.slice(-1500), // context
        promptText: aiPromptText
      });
      setAiResponse(res.data.generatedText);
    } catch (err) {
      console.error(err);
      setAiResponse(err.response?.data?.message || 'Failed to generate response.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsertAIResponse = () => {
    setContent(prev => prev + (prev.endsWith(' ') || prev.endsWith('\n') || prev === '' ? '' : ' ') + aiResponse);
    setAiResponse('');
    setAiPromptText('');
  };

  if (error && !topic) return <div className="container"><p className="text-danger">{error}</p></div>;
  if (!topic) return <div className="container"><p>Loading...</p></div>;

  const isComplete = wordCount >= MIN_WORDS;

  return (
    <div className="container" style={{ marginTop: '2rem', maxWidth: isAiPanelOpen ? '1200px' : '900px', transition: 'max-width 0.3s ease' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>{topic.title}</h2>
          <p className="text-secondary">{topic.description}</p>
        </div>
        <button 
          className="secondary" 
          onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          ✨ {isAiPanelOpen ? 'Close AI Panel' : 'Open AI Assistant'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isAiPanelOpen ? '2fr 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Main Writing Area */}
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
            
            {!isAiPanelOpen && (
              <button 
                className="secondary" 
                onClick={handleAIAssist}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                ✨ AI Assist
              </button>
            )}

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

      {/* AI Side Panel */}
      {isAiPanelOpen && (
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', minHeight: '60vh' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ✨ Gemini Assistant
          </h3>
          <p className="text-secondary" style={{ fontSize: '0.9rem', margin: 0 }}>
            Ask me to outline the next paragraph, describe a character, or brainstorm ideas!
          </p>

          <textarea
            style={{ 
              width: '100%', 
              padding: '1rem',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'white',
              resize: 'vertical',
              minHeight: '100px'
            }}
            placeholder="E.g. What should happen next after the explosion?"
            value={aiPromptText}
            onChange={(e) => setAiPromptText(e.target.value)}
          />
          
          <button 
            className="secondary" 
            onClick={handleAskAI}
            disabled={isGenerating || !aiPromptText.trim()}
          >
            {isGenerating ? 'Thinking...' : 'Ask AI'}
          </button>

          {aiResponse && (
            <div style={{ marginTop: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                padding: '1rem', 
                background: 'rgba(30, 41, 59, 0.4)', 
                borderRadius: '8px', 
                border: '1px solid var(--border)',
                maxHeight: '300px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {aiResponse}
              </div>
              <button 
                className="primary" 
                onClick={handleInsertAIResponse}
              >
                Insert into Draft
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default WritingInterface;
