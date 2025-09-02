import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Cart from './components/views/Cart/Cart';
import Home from './components/views/Home/Home';
import Login from './components/views/Login/Login';
import ProductsView from './components/views/ProductsView/ProductsView';
import AddProductView from './components/views/ProductsView/AddProductView';
import Register from './components/views/Register/Register';
import EditProductView from './components/views/ProductsView/EditProductView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients/register" element={<Register />} />
        <Route path="/clients/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:id" element={<ProductsView />} />
        <Route path="/products/:id/edit" element={<EditProductView />} />
        <Route path="/products/add" element={<AddProductView />} />
      </Routes>
    </Router>
  );
}

export default App;
