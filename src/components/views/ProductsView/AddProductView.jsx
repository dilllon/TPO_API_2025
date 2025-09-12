import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { useProducts } from '../../../context/ProductContext';
import AddProductForm from '../../atoms/Form/AddProductForm';
import Header from '../../organisms/Header/Header';

function AddProductView() {
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useUser();
  const { lastId } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Verificar si el usuario está autenticado
  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Acceso Denegado</h2>
          <p>Debes iniciar sesión para agregar productos.</p>
          <button onClick={() => navigate('/clients/login')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Iniciar Sesión
          </button>
        </div>
      </>
    );
  }

  const handleAddProduct = async (productData) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Generar un ID único para el producto
      const productId = lastId() + 1;
      
      // Preparar los datos del producto para la API
      const newProduct = {
        id: String(productId),
        title: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        category: productData.category,
        brand: productData.brand || "Generic",
        warranty: productData.warranty || "1 año",
        weight: productData.weight || "N/A",
        dimensions: productData.dimensions || "N/A",
        discount: productData.discount ? parseInt(productData.discount) : undefined,
        image: productData.image !== undefined && productData.image !== null && productData.image !== '' ? `/src/assets/images/productos/${productData.image.name}` : '/src/assets/images/productos/default.jpg',
        images: [
          productData.image !== undefined && productData.image !== null && productData.image !== ''  ? `/src/assets/images/productos/${productData.image.name}` : '/src/assets/images/productos/default.jpg',
          productData.additionalImages !== undefined && productData.additionalImages !== null && productData.additionalImages !== ''  ? productData.additionalImages.map(img => `/src/assets/images/productos/${img.name}`) : []
        ],
        features: productData.features !== undefined && productData.features !== null && productData.features !== ''  
          ? productData.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
          : [],
        tags: productData.tags !== undefined && productData.tags !== null && productData.tags !== ''  
          ? productData.tags.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0)
          : [productData.category.toLowerCase()],
        userId: userData.id,
        sellerUsername: userData.username,
        sku: `${productData.category.toUpperCase()}-${productId}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        rating: {
          average: 0,
          count: 0
        }
      };

      // Enviar el producto a la API
      const response = await fetch('http://localhost:9000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const createdProduct = await response.json();
      
      console.log('Producto creado exitosamente:', createdProduct);
      
      // Mostrar mensaje de éxito
      alert(`Producto "${newProduct.title}" agregado exitosamente!`);
      
      // Redirigir a la página principal o a la vista del producto
      navigate('/');
      
    } catch (error) {
      console.error('Error al agregar producto:', error);
      setError('Error al agregar el producto. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '1rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}
        
        <AddProductForm 
          onSubmit={handleAddProduct} 
          disabled={isSubmitting}
        />
        
        {isSubmitting && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1rem', 
            color: '#6c757d' 
          }}>
            Agregando producto...
          </div>
        )}
      </div>
    </>
  );
}

export default AddProductView;