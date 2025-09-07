import { useState } from "react";

function Filter({ categories, onFilter }) {
	const [selectedCategory, setSelectedCategory] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [inStock, setInStock] = useState(false);

	const handleFilter = () => {
		onFilter({
			category: selectedCategory,
			minPrice: minPrice !== "" ? Number(minPrice) : undefined,
			maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
			inStock,
		});
	};

	return (
		<div>
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
			<label>
				<input
					type="checkbox"
					checked={inStock}
					onChange={e => setInStock(e.target.checked)}
				/>
				Solo mostrar productos en stock
			</label>
			<button type="button" onClick={handleFilter}>Filtrar</button>
		</div>
	);
}

export default Filter;
