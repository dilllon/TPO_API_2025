import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './index.css';
import App from './App.jsx';
import { ProductsProvider } from './context/ProductContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ProductsProvider>
        <App />
      </ProductsProvider>
    </Provider>
  </StrictMode>,
);
