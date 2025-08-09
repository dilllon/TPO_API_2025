import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/views/Home/Home';
import Register from './components/views/Register/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
