import AddProductForm from '@/components/atoms/Form/AddProductForm';
import Header from '../../organisms/Header/Header';
import HeaderRegistrado from '../../organisms/Header/HeaderRegistrado';

const isLoggedIn = localStorage.getItem('token') !== null;

function AddProductView() {
  const handleAddProduct = (productData) => {
    console.log('Nuevo producto:', productData);
    // Aquí puedes agregar la lógica para guardar el producto
  };

  return (
    <>
      {isLoggedIn ? <HeaderRegistrado /> : <Header />}
      <AddProductForm onSubmit={handleAddProduct} />
    </>
  );
}

export default AddProductView;
