import { useState } from 'react';
import styles from './AddProductForm.module.css';

function AddProductForm({ onSubmit, disabled = false }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    warranty: '',
    weight: '',
    dimensions: '',
    discount: '',
    features: '',
    tags: '',
    image: null,
    additionalImages: []
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [previewAdditionalImages, setPreviewAdditionalImages] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (name === 'image') {
        const file = files[0];
        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
        
        // Crear preview de la imagen principal
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          setPreviewImage(null);
        }
      } else if (name === 'additionalImages') {
        const fileArray = Array.from(files);
        setFormData(prev => ({
          ...prev,
          [name]: fileArray
        }));
        
        // Crear previews de las imágenes adicionales
        const previews = [];
        fileArray.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            previews.push(reader.result);
            if (previews.length === fileArray.length) {
              setPreviewAdditionalImages([...previews]);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      brand: '',
      warranty: '',
      weight: '',
      dimensions: '',
      discount: '',
      features: '',
      tags: '',
      image: null,
      additionalImages: []
    });
    setPreviewImage(null);
    setPreviewAdditionalImages([]);
  };

  return (
    <form className={styles["add-product-form"]} onSubmit={handleSubmit}>
      <h2>Agregar Nuevo Producto</h2>

      <div className={styles["form-group"]}>
        <label htmlFor="name">Nombre del Producto *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="description">Descripción *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles["form-row"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="price">Precio *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="stock">Stock *</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="discount">Descuento (%)</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            max="100"
            step="1"
          />
        </div>
      </div>

      <div className={styles["form-row"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="category">Categoría *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar categoría</option>
            <option value="Electro">Electrónica</option>
            <option value="Ropa">Ropa y Accesorios</option>
            <option value="Hogar">Hogar y Jardín</option>
            <option value="Deportes">Deportes</option>
            <option value="Libros">Libros</option>
            <option value="Juguetes">Juguetes</option>
            <option value="Automotriz">Automotriz</option>
            <option value="Salud">Salud y Belleza</option>
          </select>
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="brand">Marca *</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles["form-row"]}>
        <div className={styles["form-group"]}>
          <label htmlFor="weight">Peso</label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="ej: 500g, 1.2kg"
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="dimensions">Dimensiones</label>
          <input
            type="text"
            id="dimensions"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            placeholder="ej: 20 x 15 x 5 cm"
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="warranty">Garantía</label>
          <input
            type="text"
            id="warranty"
            name="warranty"
            value={formData.warranty}
            onChange={handleChange}
            placeholder="ej: 1 año, 6 meses"
          />
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="features">Características (separadas por coma)</label>
        <textarea
          id="features"
          name="features"
          value={formData.features}
          onChange={handleChange}
          placeholder="ej: Resistente al agua, Conectividad Bluetooth, Pantalla LCD"
          rows="3"
        />
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="tags">Etiquetas (separadas por coma)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="ej: gaming, oficina, inalámbrico"
        />
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="image">Imagen Principal *</label>
        <div className={styles["image-upload-container"]}>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className={styles["file-input"]}
            required
          />
          {previewImage && (
            <div className={styles["image-preview"]}>
              <img src={previewImage} alt="Vista previa" />
            </div>
          )}
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="additionalImages">Imágenes Adicionales</label>
        <div className={styles["image-upload-container"]}>
          <input
            type="file"
            id="additionalImages"
            name="additionalImages"
            onChange={handleChange}
            accept="image/*"
            className={styles["file-input"]}
            multiple
          />
          {previewAdditionalImages.length > 0 && (
            <div className={styles["additional-images-preview"]}>
              {previewAdditionalImages.map((preview, index) => (
                <div key={index} className={styles["image-preview-small"]}>
                  <img src={preview} alt={`Vista previa ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        className={styles["submit-button"]}
        disabled={disabled}
      >
        {disabled ? 'Agregando...' : 'Agregar Producto'}
      </button>
    </form>
  );
}

export default AddProductForm;