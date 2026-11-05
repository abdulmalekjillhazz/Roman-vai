import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import BrandLogo from '../../components/public/BrandLogo.jsx';

const emptyProductForm = {
  name: '',
  category: 'wall-products',
  categoryName: 'Wall Panels',
  description: '',
  thickness: 'Standard',
  dimensions: 'Custom',
  material: 'Composite',
  features: '',
  imageUrls: '',
  inStock: true,
  isFeatured: false
};

const emptyCategoryForm = {
  name: '',
  slug: '',
  description: ''
};

export default function AdminDashboard() {
  const [token, setToken] = useState(() => sessionStorage.getItem('dst_admin_token') || '');
  const [adminUser, setAdminUser] = useState(() => sessionStorage.getItem('dst_admin_email') || '');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [productMsg, setProductMsg] = useState('');
  const [categoryMsg, setCategoryMsg] = useState('');
  const [productError, setProductError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [uploadFiles, setUploadFiles] = useState([]);

  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    if (token) {
      fetchProducts();
      fetchCategories();
    }
  }, [token]);

  function authHeaders() {
    if (!token) return {};
    return {
                  Authorization: 'Bearer ' + token
    };
  }

  
  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBase}/products`, { headers: authHeaders() });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get(`${apiBase}/categories`, { headers: authHeaders() });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await axios.post(`${apiBase}/auth/login`, {
        email: loginEmail.trim(),
        password: loginPassword
      });

      if (res.data && res.data.token) {
        sessionStorage.setItem('dst_admin_token', res.data.token);
        sessionStorage.setItem('dst_admin_email', res.data.email);
        setToken(res.data.token);
        setAdminUser(res.data.email);
      } else {
        setLoginError('Authentication failed. Please verify .env credentials.');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid email or password. Access denied.');
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('dst_admin_token');
    sessionStorage.removeItem('dst_admin_email');
    setToken('');
    setAdminUser('');
    setLoginPassword('');
    setSelectedProductId('');
    setSelectedCategoryId('');
    setProductForm(emptyProductForm);
    setCategoryForm(emptyCategoryForm);
  }

  function resetProductForm() {
    setSelectedProductId('');
    setUploadFiles([]);
    setProductForm(emptyProductForm);
    setProductMsg('');
    setProductError('');
  }

  function resetCategoryForm() {
    setSelectedCategoryId('');
    setCategoryForm(emptyCategoryForm);
    setCategoryMsg('');
    setCategoryError('');
  }

  function handleProductFieldChange(field, value) {
    setProductForm(prev => ({ ...prev, [field]: value }));
  }

  const productImagePreview = [
    ...((productForm.imageUrls || '').split(/[\n,]/).map(url => url.trim()).filter(Boolean)),
    ...(uploadFiles || []).slice(0, 3).map(file => URL.createObjectURL(file))
  ].slice(0, 4);

  function handleCategoryFieldChange(field, value) {
    setCategoryForm(prev => ({ ...prev, [field]: value }));
  }

  async function submitProduct(e) {
    e.preventDefault();
    setProductMsg('');
    setProductError('');

    if (!productForm.name.trim()) {
      setProductError('Product name is required.');
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

    if (productForm.imageUrls) {
      const urls = productForm.imageUrls.split(/[\n,]/).map(url => url.trim()).filter(Boolean);
      urls.forEach(url => formData.append('images', url));
    }

    uploadFiles.forEach(file => formData.append('images', file));

    try {
      if (selectedProductId) {
        await axios.put(`${apiBase}/products/${selectedProductId}`, formData, {
          headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
        });
        setProductMsg('Product updated successfully.');
      } else {
        await axios.post(`${apiBase}/products`, formData, {
          headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' }
        });
        setProductMsg('Product created successfully.');
      }

      setUploadFiles([]);
      setProductForm(emptyProductForm);
      setSelectedProductId('');
      fetchProducts();
    } catch (err) {
      setProductError(err.response?.data?.message || 'Failed to save product.');
    }
  }

  async function submitCategory(e) {
    e.preventDefault();
    setCategoryMsg('');
    setCategoryError('');

    if (!categoryForm.name.trim()) {
      setCategoryError('Category name is required.');
      return;
    }

    const payload = {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim() || categoryForm.name.trim(),
      description: categoryForm.description.trim()
    };

    try {
      if (selectedCategoryId) {
        await axios.put(`${apiBase}/categories/${selectedCategoryId}`, payload, { headers: authHeaders() });
        setCategoryMsg('Category updated successfully.');
      } else {
        await axios.post(`${apiBase}/categories`, payload, { headers: authHeaders() });
        setCategoryMsg('Category created successfully.');
      }

      setCategoryForm(emptyCategoryForm);
      setSelectedCategoryId('');
      fetchCategories();
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Failed to save category.');
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${apiBase}/products/${id}`, { headers: authHeaders() });
      if (selectedProductId === id) resetProductForm();
      fetchProducts();
    } catch (err) {
      setProductError(err.response?.data?.message || 'Delete failed.');
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`${apiBase}/categories/${id}`, { headers: authHeaders() });
      if (selectedCategoryId === id) resetCategoryForm();
      fetchCategories();
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Delete failed.');
    }
  }

  function editProduct(product) {
    setSelectedProductId(product.id || product._id);
    setProductForm({
      name: product.name || '',
      category: product.category || 'wall-products',
      categoryName: product.categoryName || '',
      description: product.description || '',
      thickness: product.specifications?.thickness || 'Standard',
      dimensions: product.specifications?.dimensions || 'Custom',
      material: product.specifications?.material || 'Composite',
      features: (product.specifications?.features || []).join(', '),
      imageUrls: (product.images || []).join(', '),
      inStock: Boolean(product.inStock),
      isFeatured: Boolean(product.isFeatured)
    });
    setActiveTab('new-product');
  }

  function editCategory(category) {
    setSelectedCategoryId(category._id || category.slug);
    setCategoryForm({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || ''
    });
    setActiveTab('categories');
  }

  if (!token) {
    return (
      <div className="min-h-[85vh] bg-brand-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-brand-sand max-w-md w-full p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold" />
          <div className="text-center">
            <BrandLogo variant="dark" showTagline={false} />
            <h1 className="font-display text-2xl font-bold text-brand-charcoal mt-6">DST Deco Admin Portal</h1>
            <p className="font-sans text-xs text-brand-muted mt-2">
              Protected Area. Please enter the master admin credentials configured in your <code className="font-mono text-brand-charcoal bg-stone-100 px-1 py-0.5 rounded">.env</code> file.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4 font-sans">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">Admin Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-white border border-stone-200/90 rounded-xl px-4 py-3 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">Master Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-stone-200/90 rounded-xl pl-4 pr-11 py-3 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition focus:outline-none p-1 flex items-center justify-center cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-3 w-full py-3.5 bg-brand-charcoal hover:bg-stone-800 text-white rounded-xl font-bold text-xs font-sans tracking-wider uppercase transition shadow-md disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-sand/50 text-center font-mono text-[10px] text-stone-400">
            CLASSICAL DECOR I D • SECURE ACCESS GATE
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-sans text-[11px] uppercase tracking-widest text-emerald-800 font-bold">Authenticated Session</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-brand-charcoal mt-1">DST Deco Control Center</h1>
            <p className="font-sans text-xs text-brand-muted mt-0.5">
              Logged in as: <strong className="font-mono text-brand-charcoal">{adminUser}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-brand-cream border border-brand-sand px-3 py-1.5 rounded-xl">
              Catalog Items: <strong>{products.length}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold font-sans border border-red-200 transition"
            >
              🔒 Sign Out
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {['products', 'new-product', 'categories'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                activeTab === tab ? 'bg-brand-charcoal text-white' : 'bg-white border border-brand-sand text-brand-charcoal'
              }`}
            >
              {tab === 'products' ? 'Inventory' : tab === 'new-product' ? 'Add Product' : 'Categories'}
            </button>
          ))}
        </div>

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-brand-sand overflow-hidden shadow-sm">
            <div className="p-6 border-b border-brand-sand/60 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-brand-charcoal">Active Material Inventory</h2>
                <p className="text-xs text-brand-muted">Manage product catalog and stock visibility.</p>
              </div>
              <button onClick={fetchProducts} className="text-xs font-bold text-brand-gold hover:underline">🔄 Refresh</button>
            </div>

            {loading ? (
              <div className="py-20 text-center text-xs text-brand-muted">Loading inventory...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-brand-cream/60 text-brand-charcoal font-bold uppercase tracking-wider text-[11px] border-b border-brand-sand">
                    <tr>
                      <th className="p-4">SKU / ID</th>
                      <th className="p-4">Material</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Thickness & Size</th>
                      <th className="p-4">Images</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-sand/40">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-brand-cream/20 transition">
                        <td className="p-4 font-mono font-bold text-brand-charcoal">{p.sku || p.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-brand-charcoal">{p.name}</div>
                          <div className="text-[11px] text-brand-muted line-clamp-1">{p.description}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] font-medium">
                            {p.categoryName}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-stone-600">
                          <div>Thick: {p.specifications?.thickness || 'N/A'}</div>
                          <div>Dim: {p.specifications?.dimensions || 'N/A'}</div>
                        </td>
                        <td className="p-4 font-mono text-stone-600">{p.images?.length || 0} Photos</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            p.inStock ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800'
                          }`}>
                            {p.inStock ? '● In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => editProduct(p)} className="rounded bg-amber-100 px-2.5 py-1.5 text-[10px] font-bold text-amber-800">Edit</button>
                            <button type="button" onClick={() => deleteProduct(p.id || p._id)} className="rounded bg-red-100 px-2.5 py-1.5 text-[10px] font-bold text-red-700">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'new-product' && (
          <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="font-display text-xl font-bold text-brand-charcoal">{selectedProductId ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-xs text-brand-muted">Create or update product entries, stock status, and product images.</p>
              </div>
              {selectedProductId && (
                <button type="button" onClick={resetProductForm} className="text-xs font-bold text-brand-charcoal hover:underline">Cancel edit</button>
              )}
            </div>

            {productError && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{productError}</div>}
            {productMsg && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{productMsg}</div>}

            <form onSubmit={submitProduct} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Product Name</label>
                <input value={productForm.name} onChange={e => handleProductFieldChange('name', e.target.value)} placeholder="e.g. Natural Flexible Stone" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Category</label>
                <select value={productForm.category} onChange={e => handleProductFieldChange('category', e.target.value)} className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold floating-input">
                  {categories.length ? categories.map(cat => (
                    <option key={cat.slug || cat._id} value={cat.slug || cat._id}>{cat.name}</option>
                  )) : (
                    <>
                      <option value="wall-products">Wall Panels</option>
                      <option value="flooring-products">Flooring</option>
                      <option value="aluminum-profiles">Profiles & Fixing</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Category Label</label>
                <input value={productForm.categoryName} onChange={e => handleProductFieldChange('categoryName', e.target.value)} placeholder="Wall Panels" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Description</label>
                <textarea rows="4" value={productForm.description} onChange={e => handleProductFieldChange('description', e.target.value)} placeholder="Architectural description..." className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Thickness</label>
                <input value={productForm.thickness} onChange={e => handleProductFieldChange('thickness', e.target.value)} placeholder="e.g. 5mm" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Dimensions</label>
                <input value={productForm.dimensions} onChange={e => handleProductFieldChange('dimensions', e.target.value)} placeholder="e.g. 1220mm x 2440mm" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Material</label>
                <input value={productForm.material} onChange={e => handleProductFieldChange('material', e.target.value)} placeholder="e.g. Natural Stone / Resin" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Featured?</label>
                <select value={productForm.isFeatured ? 'true' : 'false'} onChange={e => handleProductFieldChange('isFeatured', e.target.value === 'true')} className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold floating-input">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Features (comma separated)</label>
                <input value={productForm.features} onChange={e => handleProductFieldChange('features', e.target.value)} placeholder="Waterproof, Fire rated, Eco friendly" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Existing / Remote Image URLs</label>
                <textarea rows="3" value={productForm.imageUrls} onChange={e => handleProductFieldChange('imageUrls', e.target.value)} className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input" placeholder="https://example.com/1.jpg, https://example.com/2.jpg" />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Upload Image Files</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => setUploadFiles(Array.from(e.target.files || []))}
                  className="w-full rounded-xl border border-dashed border-stone-300 bg-white px-3 py-3 text-xs text-brand-charcoal file:mr-3 file:rounded file:border-0 file:bg-brand-charcoal file:px-3 file:py-2 file:text-xs file:font-bold file:text-white floating-input"
                />
                {uploadFiles.length > 0 && <div className="mt-2 text-[10px] text-brand-muted">{uploadFiles.length} file(s) selected</div>}
              </div>

              {productImagePreview.length > 0 && (
                <div className="md:col-span-2">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Preview</div>
                  <div className="grid grid-cols-4 gap-3">
                    {productImagePreview.map((src, index) => (
                      <div key={`${src}-${index}`} className="overflow-hidden rounded-xl border border-brand-sand bg-brand-cream/30">
                        <img src={src} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="md:col-span-2 flex items-center gap-3">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                  <input type="checkbox" checked={productForm.inStock} onChange={e => handleProductFieldChange('inStock', e.target.checked)} className="h-4 w-4 rounded border-brand-sand text-brand-gold focus:ring-brand-gold" />
                  In Stock
                </label>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={resetProductForm} className="rounded-xl border border-brand-sand bg-white px-4 py-2.5 text-xs font-bold text-brand-charcoal">Clear</button>
                <button type="submit" className="rounded-xl bg-brand-charcoal px-5 py-2.5 text-xs font-bold text-white">{selectedProductId ? 'Update Product' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-display text-xl font-bold text-brand-charcoal">Categories</h2>
                  <p className="text-xs text-brand-muted">Manage product groupings.</p>
                </div>
                {selectedCategoryId && (
                  <button type="button" onClick={resetCategoryForm} className="text-xs font-bold text-brand-charcoal hover:underline">Clear</button>
                )}
              </div>

              {categories.length === 0 ? (
                <div className="text-xs text-brand-muted py-6">No categories yet.</div>
              ) : (
                <div className="space-y-3">
                  {categories.map(category => (
                    <div key={category.slug || category._id} className="flex items-center justify-between rounded-2xl border border-brand-sand bg-brand-cream/30 p-3">
                      <div>
                        <div className="font-bold text-brand-charcoal">{category.name}</div>
                        <div className="text-[11px] text-brand-muted">/{category.slug}</div>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => editCategory(category)} className="rounded bg-amber-100 px-2.5 py-1.5 text-[10px] font-bold text-amber-800">Edit</button>
                        <button type="button" onClick={() => deleteCategory(category._id || category.slug)} className="rounded bg-red-100 px-2.5 py-1.5 text-[10px] font-bold text-red-700">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-brand-charcoal">{selectedCategoryId ? 'Edit Category' : 'Add Category'}</h2>
              <p className="text-xs text-brand-muted mt-1">Create or edit category pages for your product catalog.</p>

              {categoryError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{categoryError}</div>}
              {categoryMsg && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{categoryMsg}</div>}

              <form onSubmit={submitCategory} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Category Name</label>
                  <input value={categoryForm.name} onChange={e => handleCategoryFieldChange('name', e.target.value)} placeholder="e.g. Wall Panels" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input" />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Category Slug</label>
                  <input value={categoryForm.slug} onChange={e => handleCategoryFieldChange('slug', e.target.value)} className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input" placeholder="wall-panels" />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Description</label>
                  <textarea rows="4" value={categoryForm.description} onChange={e => handleCategoryFieldChange('description', e.target.value)} placeholder="Category summary..." className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-gray-200 focus:outline-none focus:border-brand-gold floating-input" />
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={resetCategoryForm} className="rounded-xl border border-brand-sand bg-white px-4 py-2.5 text-xs font-bold text-brand-charcoal">Clear</button>
                  <button type="submit" className="rounded-xl bg-brand-charcoal px-5 py-2.5 text-xs font-bold text-white">{selectedCategoryId ? 'Update Category' : 'Save Category'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
