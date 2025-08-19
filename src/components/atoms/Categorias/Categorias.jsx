// import "./Categorias.css";
import { getCategoryNames } from '../../../constants/products';

function Categorias() {
    const isLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("isLoggedIn") === "true";  
    const base = isLoggedIn ? "/r" : "/";

    const categoryNames = getCategoryNames();
  return (
          <li className="dropdown">
                <a href="" className="dropdown-toggle">Categorías ▼</a>
                <ul className="dropdown-menu">
                  {categoryNames.map((categoryName, index) => (
                    <li key={index}>
                      <a href={`${base}#category-${categoryName.toLowerCase()}`}>
                        {categoryName}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>  
  );
}

export default Categorias;
