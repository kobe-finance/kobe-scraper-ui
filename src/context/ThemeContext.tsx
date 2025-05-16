import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const THEME_KEY = 'kobe-scraper-theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    
    // Use saved theme if available, otherwise check system preference
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check for system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Update document class when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme class and add new one
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Update localStorage
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      // Only update if there's no user preference saved
      if (!localStorage.getItem(THEME_KEY)) {
        setThemeState(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    // Add event listener for preference changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Toggle between light and dark
  const toggleTheme = () => {
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Explicitly set theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
