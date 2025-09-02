import Header from "@/components/organisms/Header/Header";
import ProductsDesc from "@/components/organisms/ProductsDesc/ProductsDesc";
import { ProductsProvider } from "@/context/ProductContext";

function EditProductView() {
    return (
        <>
            <Header/>
            <ProductsProvider>
                <ProductsDesc/>
            </ProductsProvider>
        </>
    )
}

export default EditProductView;