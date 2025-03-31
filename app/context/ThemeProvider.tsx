import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';


const lightColors = {
  background: 'white',
  card: '#FFFFFF',
  text: '#333333',
  subText: '#555555',
  primary: '#007AFF',
};

const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#EAEAEA',
  subText: '#B3B3B3',
  primary: '#0A84FF',
};


const ThemeContext = createContext({
  darkMode: false,
  colors: lightColors, 
  toggleTheme: () => {},
});


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemPreference = useColorScheme() === 'dark';
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, colors: darkMode ? darkColors : lightColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export const useTheme = () => useContext(ThemeContext);
export default ThemeProvider;