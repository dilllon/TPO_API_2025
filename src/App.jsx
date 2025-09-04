import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Cart from './components/views/Cart/Cart';
import Home from './components/views/Home/Home';
import Login from './components/views/Login/Login';
import AddProductView from './components/views/ProductsView/AddProductView';
import EditProductView from './components/views/ProductsView/EditProductView';
import ProductsView from './components/views/ProductsView/ProductsView';
import Register from './components/views/Register/Register';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/clients/register" element={<Register />} />
          <Route path="/clients/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:id" element={<ProductsView />} />
          <Route 
            path="/products/:id/edit" 
            element={
              <ProtectedRoute requiredRole="seller">
                <EditProductView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products/add" 
            element={
              <ProtectedRoute requiredRole="seller">
                <AddProductView />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
