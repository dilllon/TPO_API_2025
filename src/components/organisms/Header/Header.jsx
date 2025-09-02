import './Header.css';
import '../../molecules/NavBar/NavBar'
import NavBar from '../../molecules/NavBar/NavBar';
import { ProductsProvider } from "@/context/ProductContext";

function Header() {
  return (
  <header className="header">
    <ProductsProvider>
      <NavBar/>
    </ProductsProvider>
  </header>
  );
}

export default Header;
