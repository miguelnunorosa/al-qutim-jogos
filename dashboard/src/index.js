import React from 'react';
import ReactDOM from 'react-dom/client';

// Tipografia: Spectral (títulos) + Inter (texto/dados) — ver src/theme/theme.js
import '@fontsource/spectral/500.css';
import '@fontsource/spectral/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals();