import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './redux/store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(13,0,24,0.95)',
              color: '#f8f4ff',
              border: '1px solid rgba(255,26,127,0.3)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              fontFamily: 'Satoshi, sans-serif',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#070010' } },
            error:   { iconTheme: { primary: '#ff1a7f', secondary: '#070010' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
