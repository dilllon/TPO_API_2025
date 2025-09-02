import EditProductForm from "@/components/atoms/Form/EditProductForm";
import Header from "@/components/organisms/Header/Header";
import { ProductsProvider } from "@/context/ProductContext";

function EditProductView() {
    return (
        <>
            <Header/>
            <ProductsProvider>
                <EditProductForm/>
            </ProductsProvider>
        </>
    )
}

export default EditProductView;