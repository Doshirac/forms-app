import React from 'react';
import ReactDOM from 'react-dom/client';
import { Suspense } from 'react';
import './index.css';
import App from './App';

// import i18n (needs to be bundled ;))
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback="...is loading">
      <App />
    </Suspense>
  </React.StrictMode>
);
