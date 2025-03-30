import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// 1️⃣ Create a ThemeContext
const ThemeContext = createContext({
  darkMode: false, // Default value
  toggleTheme: () => {}, // Function to toggle theme
});

// 2️⃣ Create a ThemeProvider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemPreference = useColorScheme() === 'dark'; // Check system theme
  const [darkMode, setDarkMode] = useState(systemPreference); // State for dark mode

  const toggleTheme = () => setDarkMode((prev) => !prev); // Toggle function

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3️⃣ Create a custom hook to use theme
export const useTheme = () => useContext(ThemeContext);
