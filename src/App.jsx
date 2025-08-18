import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/views/Home/Home';
import Register from './components/views/Register/Register';
import Login from './components/views/Login/Login';
import Profile from './components/views/Profile/Profile';
import Cart from './components/views/Cart/Cart';
import HomeRegistrado from './components/views/Home/HomeRegistrado';

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
