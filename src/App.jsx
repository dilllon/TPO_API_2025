import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/views/Home/Home';
import Login from './components/views/Login/Login';
import ProductsView from './components/views/ProductsView/ProductsView';
import AddProductView from './components/views/ProductsView/AddProductView';
import Register from './components/views/Register/Register';
import EditProductView from './components/views/ProductsView/EditProductView';
import CartView from './components/views/Cart/CartView';
import MyPurchases from './components/views/MyPurchasesView/MyPurchasesView';
import MyProductsView from './components/views/ProductsView/MyProductsView';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients/register" element={<Register />} />
        <Route path="/clients/login" element={<Login />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/products/:id" element={<ProductsView />} />
        <Route path="/products/:id/edit" element={<EditProductView />} />
        <Route path="/products/add" element={<AddProductView />} />
        <Route path="/products/my-products" element={<MyProductsView />} />
        <Route path="/clients/previous-orders" element={<MyPurchases />} />
      </Routes>
    </Router>
  );
}

export default App;
