import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ProductsProvider } from './context/ProductContext';
import FavoritesProvider from './context/FavoritesContext.jsx';
import { UserProvider } from './context/UserContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductsProvider>
      <FavoritesProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </FavoritesProvider>
    </ProductsProvider>
  </StrictMode>,
);