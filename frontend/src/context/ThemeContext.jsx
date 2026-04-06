import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [font, setFont] = useState(localStorage.getItem('font') || 'sans');
  const [background, setBackground] = useState(localStorage.getItem('background') || 'default');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('font', font);
    localStorage.setItem('background', background);

    // Apply theme
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }

    // Apply font
    document.body.classList.remove('font-sans', 'font-serif', 'font-monospace');
    document.body.classList.add(`font-${font}`);

    // Apply background
    if (background !== 'default') {
      document.body.style.backgroundImage = `url(${background})`;
      // Ensure the background scales perfectly and covers the view, and does not tile
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
    }
  }, [theme, font, background]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, font, setFont, background, setBackground }}>
      {children}
    </ThemeContext.Provider>
  );
};
