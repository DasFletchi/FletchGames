import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';

console.log("%c FLETCH GAMES v1.0.4 - UPLINK ESTABLISHED ", "background: #cc0000; color: #ffffff; font-weight: bold; padding: 4px;");

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    React.createElement(React.StrictMode, null, 
      React.createElement(App, null)
    )
  );
}