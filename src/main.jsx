import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ProductsProvider } from './context/ProductContext';
import { UserProvider } from './context/UserContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductsProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </ProductsProvider>
  </StrictMode>,
);
