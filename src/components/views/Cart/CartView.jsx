import Header from "@/components/organisms/Header/Header";
import Cart from '@/components/organisms/Cart/Cart';
import { ProductsProvider } from "@/context/ProductContext";

function CartView() {

  return (
    <>
      <Header />
      <ProductsProvider>
        <Cart />
      </ProductsProvider>
    </>
  );
}

export default CartView;