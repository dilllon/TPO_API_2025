import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/views/Home/Home';
import Login from './components/views/Login/Login';
import Register from './components/views/Register/Register';
import Profile from './components/views/Profile/Profile';
import ProductsView from './components/views/ProductsView/ProductsView';
import AddProductView from './components/views/ProductsView/AddProductView';
import EditProductView from './components/views/ProductsView/EditProductView';
import CartView from './components/views/Cart/CartView';
import MyPurchases from './components/views/MyPurchasesView/MyPurchasesView';
import MyProductsView from './components/views/ProductsView/MyProductsView';
import ProtectedView from './components/views/ProtectedView/ProtectedView';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients/register" element={<Register />} />
        <Route path="/clients/login" element={<Login />} />
        <Route path="/clients/profile" element={<Profile />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/products/:id" element={<ProductsView />} />
        <Route path="/products/:id/edit" element={
          <ProtectedView>
            <EditProductView />
          </ProtectedView>
        } />
        <Route path="/products/add" element={
          <ProtectedView>
            <AddProductView />
          </ProtectedView>
        } />
        <Route path="/products/my-products" element={
          <ProtectedView>
            <MyProductsView />
          </ProtectedView>
        } />
        <Route path="/clients/previous-orders" element={
          <ProtectedView>
            <MyPurchases />
          </ProtectedView>
        } />
      </Routes>
    </Router>
  );
}

export default App;
