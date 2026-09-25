import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import { UserProvider } from './context/UserContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AdminProvider>
        <UserProvider>
          <ShopProvider>
            <App />
          </ShopProvider>
        </UserProvider>
      </AdminProvider>
    </ThemeProvider>
  </React.StrictMode>
);
