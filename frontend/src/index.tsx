// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\src\index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // Added .tsx extension for Vite compatibility
import './index.css';     // This imports your new Tailwind v4 styles

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Check your index.html to ensure <div id='root'></div> exists.");
}

// Create the React root and render the App
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);