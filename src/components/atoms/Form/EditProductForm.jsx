import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "../../../constants/products";
import './EditProductForm.css';

function EditProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const p = getProductById(id);
        if (!p) {
            setError("Producto no encontrado");
            return;
        }

        setForm({
            id: p.id,
            title: p.title,
            price: p.price,
            stock: p.stock,
            discount: p.discount && p.discount > 0 ? p.discount : undefined,
            description: p.description,
            brand: p.brand,
            category: p.category,
            image: p.image
        });
    }, [id]);

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

    const handleSubmit = (e) => {
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
                    <button type="submit" className="submit-button">Guardar cambios</button>
                    <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default EditProductForm;