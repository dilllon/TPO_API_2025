import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useProduct, useProducts } from "../../../hooks/useProducts";
import './EditProductForm.css';

function EditProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { canEditProduct } = useAuth();
    const { product, loading: productLoading, error: productError } = useProduct(id);
    const { updateProduct } = useProducts();
    const [form, setForm] = useState(null);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (productError) {
            setError("Error al cargar el producto");
            return;
        }

        if (!product) return;

        // Verificar permisos para editar este producto
        if (!canEditProduct(product.sellerId || product.sellerUsername)) {
            setError("No tienes permisos para editar este producto");
            return;
        }

        setForm({
            // Preservar todos los campos del producto original
            ...product,
            // Solo permitir editar estos campos específicos
            id: product.id,
            title: product.title,
            price: product.price,
            stock: product.stock,
            discount: product.discount && product.discount > 0 ? product.discount : undefined,
            description: product.description,
            brand: product.brand,
            category: product.category,
            image: product.image
        });
    }, [product, productError, canEditProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => {
            let processedValue = value;
            
            if (name === 'price' || name === 'stock') {
                processedValue = Number(value);
            } else if (name === 'discount') {
                // Manejo especial para descuento
                const numValue = Number(value);
                // Si es 0 o valor vacío, no asignar la propiedad discount
                processedValue = numValue > 0 ? numValue : undefined;
            }
            
            return {
                ...prev,
                [name]: processedValue
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.price) return setError("Titulo y precio son obligatorios.");

        setUpdating(true);
        setError("");

        // Agregar timestamp de actualización
        const updatedData = {
            ...form,
            updatedAt: new Date().toISOString()
        };

        const result = await updateProduct(form.id, updatedData);
        
        if (result.success) {
            // Forzar una recarga de productos en el navegador para sincronizar
            window.dispatchEvent(new Event('products-updated'));
            navigate(-1);
        } else {
            setError(result.error || "No se pudo actualizar el producto");
        }
        
        setUpdating(false);
    };

    if (productLoading) return <p>Cargando producto...</p>
    if (error) return <p style={{ color: "crimson" }}>{error}</p>;
    if (!form) return <p>Cargando formulario...</p>

    return (
        <div className="edit-product-form">
            <h2>Editar producto: {form.title}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Título
                        <input name="title" value={form.title} onChange={handleChange} />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Descripción
                        <textarea name="description" rows={4} value={form.description} onChange={handleChange} />
                    </label>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>
                            Precio
                            <input type="number" name="price" value={form.price} onChange={handleChange} />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Stock
                            <input type="number" name="stock" value={form.stock} onChange={handleChange} />
                        </label>
                    </div>
                </div>
                <div className="form-group">
                    <label>
                        Descuento (%)
                        <input 
                            type="number" 
                            name="discount" 
                            value={form.discount || ''} 
                            onChange={handleChange}
                            placeholder="0 para sin descuento"
                            min="0"
                            max="100"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Marca
                        <input name="brand" value={form.brand} onChange={handleChange} />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Categoría
                        <input name="category" value={form.category} onChange={handleChange} />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Imagen (URL)
                        <input name="image" value={form.image} onChange={handleChange} />
                    </label>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                    <button type="submit" className="submit-button" disabled={updating}>
                        {updating ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)} disabled={updating}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProductForm;