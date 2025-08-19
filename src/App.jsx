import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Cart from './components/views/Cart/Cart';
import Home from './components/views/Home/Home';
import HomeRegistrado from './components/views/Home/HomeRegistrado';
import Login from './components/views/Login/Login';
import Products from './components/views/Products/Products';
import Register from './components/views/Register/Register';

function App() {
  return (
    <div className="app-gradient">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/r" element={<HomeRegistrado />} />
          <Route path="/clients/register" element={<Register />} />
          <Route path="/clients/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:id" element={<Products />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
