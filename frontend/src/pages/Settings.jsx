import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Monitor, Image as ImageIcon, Type } from 'lucide-react';

const Settings = () => {
  const { theme, setTheme, font, setFont, background, setBackground } = useTheme();

  // Aesthetic placeholder backgrounds from Unsplash that fit writing vibes
  const backgrounds = [
    { id: 'default', name: 'Standard Gradient', url: 'default', preview: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' },
    { id: 'bg1', name: 'Cosmic Nebula', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2000&q=80', preview: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80' },
    { id: 'bg2', name: 'Forest Horizon', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80', preview: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80' },
    { id: 'bg3', name: 'Minimal Architecture', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=80', preview: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="container" style={{ marginTop: '2rem', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <SettingsIcon size={32} className="text-accent" />
        <h2 style={{ margin: 0 }}>Preferences</h2>
      </div>

      <div className="card mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Theme Toggle */}
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Monitor size={20} className="text-accent" /> UI Theme
          </h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className={theme === 'dark' ? 'primary' : 'secondary'}
              onClick={() => setTheme('dark')}
              style={{ flex: 1 }}
            >
              Dark Mode
            </button>
            <button 
              className={theme === 'light' ? 'primary' : 'secondary'}
              onClick={() => setTheme('light')}
              style={{ flex: 1 }}
            >
              Light Mode
            </button>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)' }} />

        {/* Font Selection */}
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Type size={20} className="text-accent" /> Interface Font Style
          </h3>
          <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            Choose how you want text to appear while writing. (Compiled books will always use the standardized book font).
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className={font === 'sans' ? 'primary' : 'secondary'}
              onClick={() => setFont('sans')}
              style={{ flex: 1, fontFamily: "'Open Sans', sans-serif" }}
            >
              Sans-Serif (Modern)
            </button>
            <button 
              className={font === 'serif' ? 'primary' : 'secondary'}
              onClick={() => setFont('serif')}
              style={{ flex: 1, fontFamily: "'Georgia', serif" }}
            >
              Serif (Classic)
            </button>
            <button 
              className={font === 'monospace' ? 'primary' : 'secondary'}
              onClick={() => setFont('monospace')}
              style={{ flex: 1, fontFamily: "'Courier New', monospace" }}
            >
              Monospace (Typewriter)
            </button>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)' }} />

        {/* Background Image Setup */}
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ImageIcon size={20} className="text-accent" /> Background Wallpaper
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {backgrounds.map(bg => (
              <div 
                key={bg.id}
                onClick={() => setBackground(bg.url)}
                style={{ 
                  height: '100px', 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  border: background === bg.url ? '3px solid var(--accent)' : '3px solid transparent',
                  background: bg.id === 'default' ? bg.preview : `url(${bg.preview}) center/cover`,
                  display: 'flex',
                  alignItems: 'flex-end',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease',
                  boxShadow: 'var(--shadow)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ 
                  background: 'rgba(0,0,0,0.6)', 
                  width: '100%', 
                  padding: '0.2rem', 
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: 'white'
                }}>
                  {bg.name}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
