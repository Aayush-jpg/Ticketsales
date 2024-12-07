// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use this import for React 18+
import './index.css';
import App from './App';

// Create a root element and render your App component
const root = ReactDOM.createRoot(document.getElementById('root')); // Create root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
