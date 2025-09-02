import { useState } from 'react';
import styles from './AddProductForm.module.css';

function AddProductForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null
  });
  
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Crear preview de la imagen
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
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
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: null
    });
  };

  return (
    <form className={styles["add-product-form"]} onSubmit={handleSubmit}>
      <h2>Agregar Nuevo Producto</h2>

      <div className={styles["form-group"]}>
        <label htmlFor="name">Nombre del Producto</label>
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
        <label htmlFor="description">Descripción</label>
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
          <label htmlFor="price">Precio</label>
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
          <label htmlFor="stock">Stock</label>
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
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="category">Categoría</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="image">Imagen del Producto</label>
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

      <button type="submit" className={styles["submit-button"]}>
        Agregar Producto
      </button>
    </form>
  );
}

export default AddProductForm;