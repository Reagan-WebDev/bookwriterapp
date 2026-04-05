import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, Users, PenTool, Sparkles } from 'lucide-react';

const Home = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 70px)' }}>
      {/* Hero Section */}
      <section style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Shape Stories <span className="text-accent">Together.</span>
        </h1>
        <p className="text-secondary" style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '2.5rem' }}>
          Join EchoWeave and collaborate with authors worldwide. Write chapters, get AI-powered suggestions, and compile your collective ideas into published books.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/register">
            <button className="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start Writing Now
            </button>
          </Link>
          <Link to="/login">
            <button className="secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Log In
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        padding: '4rem 2rem', 
        background: 'rgba(30, 41, 59, 0.4)',
        borderTop: '1px solid var(--border)'
      }}>
        <div className="container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          <div className="card text-center" style={{ padding: '2rem' }}>
            <Users size={40} className="text-accent" style={{ margin: '0 auto 1rem auto' }} />
            <h3>Crowdsourced</h3>
            <p className="text-secondary">Collaborate with fellow writers to complete ongoing stories.</p>
          </div>
          <div className="card text-center" style={{ padding: '2rem' }}>
            <PenTool size={40} className="text-accent" style={{ margin: '0 auto 1rem auto' }} />
            <h3>Write Chapters</h3>
            <p className="text-secondary">Contribute 1000+ words to progress a book toward its goal.</p>
          </div>
          <div className="card text-center" style={{ padding: '2rem' }}>
            <Sparkles size={40} className="text-accent" style={{ margin: '0 auto 1rem auto' }} />
            <h3>AI Assistant</h3>
            <p className="text-secondary">Stuck? Let our Gemini AI help you auto-complete your sentences.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        borderTop: '1px solid var(--border)',
        marginTop: 'auto'
      }}>
        <p className="text-secondary" style={{ margin: 0 }}>
          © {new Date().getFullYear()} EchoWeave. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
