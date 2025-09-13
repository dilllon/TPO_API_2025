import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ProductsProvider } from './context/ProductContext';
import FavoritesProvider from './context/FavoritesContext.jsx';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import './index.css';
import { SearchProvider } from "./context/SearchContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductsProvider>
      <SearchProvider>
        <FavoritesProvider>
          <UserProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </UserProvider>
        </FavoritesProvider>
      </SearchProvider>
    </ProductsProvider>
  </StrictMode>,
);