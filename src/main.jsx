import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ProductsProvider } from './context/ProductContext';
import FavoritesProvider from './context/FavoritesContext.jsx';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import './index.css';
import { SearchProvider } from "./context/SearchContext";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  // <StrictMode> // Comentado temporalmente para evitar doble ejecución de efectos
  <>
    <ProductsProvider>
      <SearchProvider>
        <UserProvider>
          <FavoritesProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </FavoritesProvider>
        </UserProvider>
      </SearchProvider>
    </ProductsProvider>
    <ToastContainer />
  </>
  // </StrictMode>
);
