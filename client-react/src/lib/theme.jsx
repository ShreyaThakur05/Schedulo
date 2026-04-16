import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

// Apply theme immediately before React renders (called at module load time)
const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('schedulo-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      return 'dark';
    }
  } catch (e) {}
  document.documentElement.classList.remove('dark');
  return 'light';
};

const initialTheme = getInitialTheme();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(initialTheme);

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem('schedulo-theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
