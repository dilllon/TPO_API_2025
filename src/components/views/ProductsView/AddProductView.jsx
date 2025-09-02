import AddProductForm from '@/components/atoms/Form/AddProductForm';
import Header from '../../organisms/Header/Header';

function AddProductView() {
  const handleAddProduct = (productData) => {
    console.log('Nuevo producto:', productData);
    // Aquí puedes agregar la lógica para guardar el producto
  };

  return (
    <>
      <Header />
      <AddProductForm onSubmit={handleAddProduct} />
    </>
  );
}

export default AddProductView;
