import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/views/Home/Home';
import Register from './components/views/Register/Register';
import Cart from './components/views/Cart/Cart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
