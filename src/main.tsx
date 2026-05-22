import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { store } from '@store/store';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="">
        {' '}
        {/* basename="zing" */}
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
