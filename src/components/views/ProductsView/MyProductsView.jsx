import React, { useEffect, useState } from 'react';
import { useProducts } from '../../../context/ProductContext';
import { useUser } from '../../../context/UserContext';
import { Link } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import ProductCard from '../../molecules/ProductCard/ProductCard';
import './ProductsView.css';
import Header from '@/components/organisms/Header/Header';

const MyProductsView = () => {
  const { productsData, isLoading } = useProducts();
  const { userData } = useUser();
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    if (productsData && userData) {
      const userProducts = productsData.filter(product => product.userId === userData.id);
      setMyProducts(userProducts);
    }
  }, [productsData, userData]);

  if (isLoading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (!userData) {
    return <div className="error-message">Debes iniciar sesión para ver tus productos</div>;
  }

  if (myProducts.length === 0) {
    return (
      <>
        <Header />
        <div className="no-products">
            <h2>No tienes productos publicados</h2>
            <Link to="/products/add">
            <Button type="primary">Publicar un producto</Button>
            </Link>
        </div>
      </>
    );
  }

  return (
    <>
    <Header />
    <div className="products-container">
      <div className="products-header">
        <h1>Mis Productos</h1>
        <Link to="/products/add">
          <Button type="primary">Publicar nuevo producto</Button>
        </Link>
      </div>
      <div className="products-grid">
        {myProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            variant="editable"
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default MyProductsView;
