import { useCallback, useEffect, useState } from 'react';
import { emptyProductForm } from '../formDefaults.js';
import useProductImages from './useProductImages.js';

export default function useProducts(api, enabled, catalogStatus) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [productMsg, setProductMsg] = useState('');
  const [productError, setProductError] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [cleanupWarning, setCleanupWarning] = useState('');

  const imageManager = useProductImages({ productForm, handleProductFieldChange, setProductMsg, setProductError });
  const { uploadFiles, setUploadFiles, existingImageUrls } = imageManager;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products`);
      setProducts(res.data);
    } catch (err) {
      setProductError(err.response?.data?.message || 'Could not load the product catalog. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (enabled) fetchProducts();
  }, [enabled, fetchProducts]);

  function showCleanupWarning(response) {
    const failures = response?.data?.cloudinaryFailures || [];
    setCleanupWarning(failures.length ? `The catalog change was saved, but these unused Cloudinary images could not be deleted. Ask your administrator to remove them: ${failures.join(', ')}` : '');
  }

  function resetProductForm() {
    setSelectedProductId('');
    setUploadFiles([]);
    setProductForm(emptyProductForm);
    setProductMsg('');
    setProductError('');
  }

  function handleProductFieldChange(field, value) {
    setProductForm(prev => ({ ...prev, [field]: value }));
  }

  async function submitProduct(e) {
    e.preventDefault();
    setProductMsg('');
    setProductError('');

    if (savingProduct) return;
    if (!catalogStatus?.persistenceAvailable) {
      setProductError('Catalog is read-only. Connect MongoDB before saving changes.');
      return;
    }

    if (!productForm.name.trim()) {
      setProductError('Product name is required.');
      return;
    }
    if (!productForm.description.trim()) {
      setProductError('Add a useful product description before saving.');
      return;
    }

    const formData = new FormData();
    formData.append('name', productForm.name.trim());
    formData.append('category', productForm.category);
    formData.append('categoryName', productForm.categoryName || productForm.category);
    formData.append('description', productForm.description.trim());
    formData.append('thickness', productForm.thickness || 'Standard');
    formData.append('dimensions', productForm.dimensions || 'Custom');
    formData.append('material', productForm.material || 'Composite');
    formData.append('features', productForm.features || '');
    formData.append('inStock', String(productForm.inStock));
    formData.append('isFeatured', String(productForm.isFeatured));

    let orderedUrls = [...existingImageUrls];
    if (productForm.thumbnail && orderedUrls.includes(productForm.thumbnail)) {
      orderedUrls = [productForm.thumbnail, ...orderedUrls.filter(u => u !== productForm.thumbnail)];
    }
    formData.append('imageUrls', JSON.stringify(orderedUrls));
    formData.append('thumbnail', orderedUrls[0] || '');

    if (uploadFiles.length > 12) {
      setProductError('Upload a maximum of 12 images at a time.');
      return;
    }
    uploadFiles.forEach(file => formData.append('images', file));

    setSavingProduct(true);
    try {
      let response;
      if (selectedProductId) {
        response = await api.put(`/products/${encodeURIComponent(selectedProductId)}`, formData);
        setProductMsg('Product updated successfully.');
      } else {
        response = await api.post(`/products`, formData);
        setProductMsg('Product created successfully.');
      }
      showCleanupWarning(response);

      setUploadFiles([]);
      setProductForm(emptyProductForm);
      setSelectedProductId('');
      fetchProducts();
    } catch (err) {
      setProductError(err.response?.data?.message || 'Failed to save product.');
      const failures = err.response?.data?.cloudinaryFailures || [];
      if (failures.length) setCleanupWarning(`Upload cleanup needs attention. Cloudinary asset IDs: ${failures.join(', ')}`);
    } finally {
      setSavingProduct(false);
    }
  }

  async function deleteProduct(id) {
    if (!catalogStatus?.persistenceAvailable) return;
    if (!window.confirm('Delete this product?')) return;
    try {
      const response = await api.delete(`/products/${id}`);
      if (selectedProductId === id) resetProductForm();
      showCleanupWarning(response);
      setProductMsg('Product deleted successfully.');
      fetchProducts();
    } catch (err) {
      setProductError(err.response?.data?.message || 'Delete failed.');
    }
  }

  function editProduct(product) {
    setUploadFiles([]);
    setProductError('');
    setProductMsg('');
    setSelectedProductId(product.id || product.slug || product._id);
    const existingImgs = product.images || [];
    const mainThumb = product.thumbnail || existingImgs[0] || '';
    setProductForm({
      name: product.name || '',
      category: product.category || 'wall-products',
      categoryName: product.categoryName || '',
      description: product.description || '',
      thickness: product.specifications?.thickness || 'Standard',
      dimensions: product.specifications?.dimensions || 'Custom',
      material: product.specifications?.material || 'Composite',
      features: (product.specifications?.features || []).join(', '),
      imageUrls: existingImgs.join('\n'),
      thumbnail: mainThumb,
      inStock: Boolean(product.inStock),
      isFeatured: Boolean(product.isFeatured)
    });
  }

  return {
    products, loading, selectedProductId, productForm, productMsg, productError,
    savingProduct, cleanupWarning, fetchProducts, resetProductForm,
    handleProductFieldChange, submitProduct, deleteProduct, editProduct,
    ...imageManager
  };
}
