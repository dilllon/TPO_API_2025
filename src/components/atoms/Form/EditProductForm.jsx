import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProducts } from '@/context/ProductContext';
import './EditProductForm.css';

function EditProductForm() {
    const { productsData, getProductById, updateProduct, isLoading } = useProducts();
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isLoading) {
            console.log('Productos cargando...');
            return;
        }
        
        console.log('Buscando producto con ID:', id);
        console.log('Products data disponible:', productsData);
        
        const p = getProductById(id);
        console.log('Producto encontrado:', p);
        if (!p) {
            setError("Producto no encontrado");
            return;
        }

        setForm({
            id: p.id,
            title: p.title,
            price: p.price,
            stock: p.stock,
            discount: p.discount ?? 0,
            description: p.description,
            brand: p.brand,
            category: p.category,
            image: p.image
        });
    }, [productsData,id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' || name === 'discount' ? Number(value) : value
        }));
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!form) {
        return <div>Cargando datos del producto...</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.price) return setError("Titulo y precio son obligatorios.");

        const ok = updateProduct(form);
        if (!ok) return setError("No se pudo actualizar el producto");

        navigate(-1)
    };

    if (error) return <p style={{ color: "crimson" }}>{error}</p>;
    if (!form) return <p>Cargando...</p>

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
                        <input type="number" name="discount" value={form.discount} onChange={handleChange} />
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
                    <button type="submit" className="submit-button">Guardar cambios</button>
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default EditProductForm;