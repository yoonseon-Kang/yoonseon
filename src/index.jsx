import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Kakao Maps SDK 전역 설정
window.kakao = window.kakao || {};

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);