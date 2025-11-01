import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { useProducts } from '../../../context/ProductContext';
import { API_BASE_URL } from '../../../config/api';
import AddProductForm from '../../atoms/Form/AddProductForm';
import Header from '../../organisms/Header/Header';
import { toast } from 'react-toastify';

function AddProductView() {
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useUser();
  const { lastId, addProduct } = useProducts();
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
      // Resolver categoryId: buscar por nombre o crear si no existe
      let categoryId = null;
      const savedUserData = localStorage.getItem('userData');
      const headers = {
        'Content-Type': 'application/json',
        ...(savedUserData ? { Authorization: `Bearer ${JSON.parse(savedUserData).token}` } : {})
      };

      // Buscar categoría existente
      try {
        const catRes = await fetch(`${API_BASE_URL}/categories`, { headers });
        if (catRes.ok) {
          const cats = await catRes.json();
          const found = cats.find(c => 
            c.name?.toLowerCase() === productData.category.toLowerCase()
          );
          if (found?.id) categoryId = found.id;
        }
      } catch (err) {
        console.warn('Error buscando categoría:', err);
      }

      // Si no existe, crear nueva categoría
      if (!categoryId) {
        try {
          const createRes = await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name: productData.category, description: '' })
          });

          if (createRes.ok) {
            const created = await createRes.json();
            categoryId = created.id;
          }
        } catch (err) {
          console.warn('Error creando categoría:', err);
        }
      }

      if (!categoryId) {
        setError('No se pudo resolver la categoría. Verifica tu conexión e intenta nuevamente.');
        setIsSubmitting(false);
        return;
      }
      
      // Preparar payload mínimo (el backend genera timestamps, ratings, etc.)
      const newProduct = {
        title: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        categoryId,
        userId: userData.id,
        brand: productData.brand || "Generic",
        discount: productData.discount ? parseInt(productData.discount) : undefined,
        image: productData.image ? `/src/assets/images/productos/${productData.image.name}` : '/src/assets/images/productos/default.jpg',
      };

      // Usar la función del contexto para agregar el producto
      const result = await addProduct(newProduct);
      
      if (result.success) {
        console.log('Producto creado exitosamente:', result.product);
        
        // Mostrar mensaje de éxito
        toast.success(`Producto "${newProduct.title}" agregado exitosamente!`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Redirigir a la página principal
        navigate('/');
      } else {
        throw new Error(result.error || 'Error al agregar el producto');
      }
      
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