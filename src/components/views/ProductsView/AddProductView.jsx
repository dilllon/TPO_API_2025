import AddProductForm from '@/components/atoms/Form/AddProductForm';
import Header from '../../organisms/Header/Header';
import { ProductsProvider } from '@/context/ProductContext';

function AddProductView() {

  return (
    <>
      <Header />
      <ProductsProvider>
        <AddProductForm/>
      </ProductsProvider>
    </>
  );
}

export default AddProductView;
