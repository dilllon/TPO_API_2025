import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ProductsProvider } from './context/ProductContext';
import FavoritesProvider from './context/FavoritesContext.jsx';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { RegisterProvider } from './context/RegisterContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductsProvider>
      <FavoritesProvider>
        <UserProvider>
          <CartProvider>
            <RegisterProvider>
              <App />
            </RegisterProvider>
          </CartProvider>
        </UserProvider>
      </FavoritesProvider>
    </ProductsProvider>
  </StrictMode>,
);