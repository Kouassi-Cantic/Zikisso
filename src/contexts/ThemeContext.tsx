import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppTheme } from '../types/theme';

interface ThemeContextType {
  currentTheme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const LOCAL_STORAGE_THEME_KEY = 'zikisso_mooc_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Thème de base par défaut : 'elephants' (emblème national)
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as AppTheme | null;
    return saved && ['elephants', 'republicain', 'foret', 'epure'].includes(saved)
      ? saved
      : 'elephants';
  });

  const setTheme = (theme: AppTheme) => {
    setCurrentTheme(theme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  };

  useEffect(() => {
    // Nettoyer les classes de thème existantes sur le body
    document.body.classList.remove('theme-elephants', 'theme-republicain', 'theme-foret', 'theme-epure');
    document.body.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur de ThemeProvider');
  }
  return context;
};
