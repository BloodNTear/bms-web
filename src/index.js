import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import { LoadingProvider } from './utilities/loadingContext.jsx';
import { AuthProvider } from './contexts/authContext.jsx';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <React.StrictMode>
      <BrowserRouter>
        <LoadingProvider>
          <AuthProvider>
                <App />
          </AuthProvider>
        </LoadingProvider>
      </BrowserRouter>
  </React.StrictMode>
);