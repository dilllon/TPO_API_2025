import { useMemo, useState } from 'react';
import styles from './AddProductForm.module.css';

const INITIAL_FORM_STATE = {
  title: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
  newCategoryName: '',
  brand: '',
  warranty: '',
  discount: '',
  imageUrl: '',
  additionalImages: '',
};

function AddProductForm({
  onSubmit,
  disabled = false,
  categories = [],
  loadingCategories = false,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [previewUrl, setPreviewUrl] = useState('');

  const categoryOptions = useMemo(() => {
    if (!Array.isArray(categories)) {
      return [];
    }
    return categories
      .filter((category) => category && typeof category.name === 'string')
      .map((category) => ({
        id: category.id,
        name: category.name,
      }));
  }, [categories]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'imageUrl') {
      setPreviewUrl(value.trim());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (typeof onSubmit !== 'function') {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      setFormData(INITIAL_FORM_STATE);
      setPreviewUrl('');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Agregar nuevo producto</h2>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Nombre del producto</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={disabled}
            placeholder="Ej: Notebook Gamer X"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="brand">Marca</label>
          <input
            id="brand"
            name="brand"
            type="text"
            value={formData.brand}
            onChange={handleChange}
            required
            disabled={disabled}
            placeholder="Ej: Acer"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Precio (ARS)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
            disabled={disabled}
            placeholder="Ej: 329999.99"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={formData.stock}
            onChange={handleChange}
            required
            disabled={disabled}
            placeholder="Ej: 25"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="discount">Descuento (%)</label>
          <input
            id="discount"
            name="discount"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.discount}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Opcional"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="warranty">Garantia</label>
          <input
            id="warranty"
            name="warranty"
            type="text"
            value={formData.warranty}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Ej: 12 meses"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="categoryId">ID de categoria existente</label>
          <input
            id="categoryId"
            name="categoryId"
            type="text"
            value={formData.categoryId}
            onChange={handleChange}
            disabled={disabled || loadingCategories}
            list={categoryOptions.length > 0 ? 'category-options' : undefined}
            placeholder="#"
          />
          {categoryOptions.length > 0 && (
            <datalist id="category-options">
              {categoryOptions.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </datalist>
          )}
          <p className={styles.helperText}>
            Ingresa el numero de una categoria existente o crea una nueva en el campo siguiente.
          </p>
          {loadingCategories && (
            <p className={styles.helperText}>Cargando categorias disponibles...</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newCategoryName">Crear nueva categoria</label>
          <input
            id="newCategoryName"
            name="newCategoryName"
            type="text"
            value={formData.newCategoryName}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Ej: Accesorios Smart Home"
          />
          <p className={styles.helperText}>
            Se utilizara solo si ingresas un nombre en este campo.
          </p>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Descripcion</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          disabled={disabled}
          placeholder="Describe las principales caracteristicas y beneficios del producto..."
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="imageUrl">Imagen principal (URL)</label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          disabled={disabled}
          placeholder="https://..."
        />
        <p className={styles.helperText}>
          Ingresa una URL publica. Se usara como imagen principal del producto.
        </p>
        {previewUrl && (
          <div className={styles.imagePreview}>
            <img src={previewUrl} alt="Vista previa del producto" />
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="additionalImages">Imagenes adicionales (una por linea)</label>
        <textarea
          id="additionalImages"
          name="additionalImages"
          value={formData.additionalImages}
          onChange={handleChange}
          disabled={disabled}
          placeholder={'https://...\nhttps://...'}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={disabled}
        >
          {disabled ? 'Enviando...' : 'Crear producto'}
        </button>
      </div>
    </form>
  );
}

export default AddProductForm;

