import React from "react";
import { Provider } from "react-redux";
import { store } from "./store"; 
import AppNavigator from "./navigation/AppNavigator"; 
import { ThemeProvider } from './context/ThemeProvider';
export default function App() {
  return (
    <ThemeProvider>
    <Provider store={store}>
    
        <AppNavigator />
       
    </Provider>
    </ThemeProvider>
  );
}
