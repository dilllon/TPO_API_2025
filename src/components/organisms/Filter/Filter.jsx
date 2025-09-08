import { useState, useEffect } from "react";
import "./Filter.css";

function Filter({ categories, onFilter }) {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [inStock, setInStock] = useState(false);
    const [hasDiscount, setHasDiscount] = useState(false);

    useEffect(() => {
        onFilter({
            category: selectedCategory,
            minPrice: minPrice !== "" ? Number(minPrice) : undefined,
            maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
            inStock,
            hasDiscount,
        });
    }, [selectedCategory, minPrice, maxPrice, inStock, hasDiscount, onFilter]);

    return (
        <div className="products-filter">
            <button type="button" className="filter-btn" onClick={() => setShowFilters(f => !f)}>
                Filtrar
            </button>
            {showFilters && (
                <div className="filters" style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", background: "#fafafa" }}>
                    <div className="labels-filter">
                        <label>
                            Categoría:
                            <select
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Todas</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Precio mínimo:
                            <input
                                type="number"
                                value={minPrice}
                                onChange={e => setMinPrice(e.target.value)}
                                min="0"
                            />
                        </label>
                        <label>
                            Precio máximo:
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                min="0"
                            />
                        </label>
                    </div>
                    <div className="filter-checkboxs">
                        <label>
                            <input
                                type="checkbox"
                                checked={inStock}
                                onChange={e => setInStock(e.target.checked)}
                            />
                            Productos con stock
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={hasDiscount}
                                onChange={e => setHasDiscount(e.target.checked)}
                            />
                            Productos con descuento
                        </label>
                    </div>
                    <button type="button" style={{ marginTop: "1rem" }}
                        onClick={() => {
                            setSelectedCategory("");
                            setMinPrice("");
                            setMaxPrice("");
                            setInStock(false);
                            setHasDiscount(false);
                        }}>
                        Reestablecer filtros
                    </button>
                </div>
            )}
        </div>
    );
}

export default Filter;
