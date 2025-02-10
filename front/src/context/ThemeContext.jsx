import React, {
    createContext,
    useState,
    useEffect
  } from 'react';
  
  const defaultThemeContext = {
    darkTheme: false,
    toggleTheme: () => {},
  };
  
  export const ThemeContext = createContext(defaultThemeContext);
  
  export const ThemeProvider = ({ children }) => {
    const [darkTheme, setDarkTheme] = useState(() => {
      const savedTheme = localStorage.getItem('darkTheme');
      if (savedTheme !== null) {
        return JSON.parse(savedTheme);
      } else {
        const browserPrefersDark =
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches;
  
        return browserPrefersDark;
      }
    });
  
    const toggleTheme = () => {
      setDarkTheme((prevTheme) => {
        const newTheme = !prevTheme;
        localStorage.setItem('darkTheme', JSON.stringify(newTheme));
        return newTheme;
      });
    };
  
    useEffect(() => {
      const handleSystemThemeChange = (e) => {
        const newSystemTheme = e.matches;
        setDarkTheme(newSystemTheme);
      };
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }, []);
  
    useEffect(() => {
      if (darkTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkTheme]);
  
    return (
      <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  };
  