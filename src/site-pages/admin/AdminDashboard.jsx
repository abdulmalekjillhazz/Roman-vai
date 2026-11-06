import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Camera, User } from 'lucide-react';
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
  thumbnail: '',
  inStock: true,
  isFeatured: false
};

const emptyCategoryForm = {
  name: '',
  slug: '',
  description: ''
};

export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminAvatar, setAdminAvatar] = useState('');
  const avatarInputRef = useRef(null);

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
  const [uploadPreviews, setUploadPreviews] = useState([]);
  const [savingProduct, setSavingProduct] = useState(false);
  const [catalogStatus, setCatalogStatus] = useState(null);
  const [cleanupWarning, setCleanupWarning] = useState('');

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

  useEffect(() => {
    setToken(sessionStorage.getItem('dst_admin_token') || '');
    setAdminUser(sessionStorage.getItem('dst_admin_email') || '');
    setAdminAvatar(localStorage.getItem('dst_admin_avatar') || '');
  }, []);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Profile photo must be 5 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setAdminAvatar(base64);
        localStorage.setItem('dst_admin_avatar', base64);
      }
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAdminAvatar('');
    localStorage.removeItem('dst_admin_avatar');
  }

  useEffect(() => {
    const previews = uploadFiles.map(file => ({ file, url: URL.createObjectURL(file) }));
    setUploadPreviews(previews);
    return () => previews.forEach(preview => URL.revokeObjectURL(preview.url));
  }, [uploadFiles]);

  useEffect(() => {
    if (token) {
      fetchProducts();
      fetchCategories();
      fetchCatalogStatus();
    }
  }, [token]);

  function authHeaders() {
    if (!token) return {};
    return {
                  Authorization: 'Bearer ' + token
    };
  }

  async function fetchCatalogStatus() {
    try {
      const response = await axios.get(`${apiBase}/products/admin/status`, { headers: authHeaders() });
      setCatalogStatus(response.data);
    } catch {
      setCatalogStatus({ persistenceAvailable: false, uploadsAvailable: false, message: 'Cannot verify catalog storage. Refresh or sign in again before making changes.' });
    }
  }

  function showCleanupWarning(response) {
    const failures = response?.data?.cloudinaryFailures || [];
    setCleanupWarning(failures.length ? `The catalog change was saved, but these unused Cloudinary images could not be deleted. Ask your administrator to remove them: ${failures.join(', ')}` : '');
  }

  
  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBase}/products`, { headers: authHeaders() });
      setProducts(res.data);
    } catch (err) {
      setProductError(err.response?.data?.message || 'Could not load the product catalog. Please refresh.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const res = await axios.get(`${apiBase}/categories`, { headers: authHeaders() });
      setCategories(res.data);
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Could not load categories. Please refresh.');
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
      if (err.response?.status === 401) {
        setLoginError('Email or password is incorrect. Please try again.');
      } else if (err.response?.data?.message) {
        setLoginError(err.response.data.message);
      } else {
        setLoginError('Sign-in is temporarily unavailable. Please try again in a moment.');
      }
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
    setUploadFiles([]);
    setCatalogStatus(null);
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

  const existingImageUrls = (productForm.imageUrls || '').split(/\r?\n/).map(url => url.trim()).filter(Boolean);

  function setAsThumbnail(url) {
    if (!url) return;
    const remaining = existingImageUrls.filter(u => u !== url);
    const reordered = [url, ...remaining];
    handleProductFieldChange('imageUrls', reordered.join('\n'));
    handleProductFieldChange('thumbnail', url);
    setProductMsg('Selected image is now set as the #1 Primary Thumbnail! Click "Update Product" to save.');
  }

  function removeExistingImage(urlToRemove) {
    const remainingUrls = (productForm.imageUrls || '')
      .split(/\r?\n/)
      .map(url => url.trim())
      .filter(url => url && url !== urlToRemove);
    handleProductFieldChange('imageUrls', remainingUrls.join('\n'));
    if (productForm.thumbnail === urlToRemove) {
      handleProductFieldChange('thumbnail', remainingUrls[0] || '');
    }
  }

  function removeUploadFile(fileToRemove) {
    setUploadFiles(files => files.filter(file => file !== fileToRemove));
  }

  function moveExistingImage(index, direction) {
    const urls = [...existingImageUrls];
    const target = index + direction;
    if (target < 0 || target >= urls.length) return;
    const temp = urls[index];
    urls[index] = urls[target];
    urls[target] = temp;
    handleProductFieldChange('imageUrls', urls.join('\n'));
    handleProductFieldChange('thumbnail', urls[0]);
  }

  function moveUpload(index, direction) {
    setUploadFiles(files => {
      const next = [...files];
      const target = index + direction;
      if (target < 0 || target >= next.length) return files;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function selectUploadFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (uploadFiles.length + files.length > 12) {
      setProductError('Select a maximum of 12 new images per save. Remove a selected image to add another.');
      return;
    }
    if (files.some(file => file.size > 8 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
      setProductError('Use JPG, PNG or WebP images, each 8 MB or smaller.');
      return;
    }
    setProductError('');
    setUploadFiles(current => [...current, ...files]);
  }

  function handleCategoryFieldChange(field, value) {
    setCategoryForm(prev => ({ ...prev, [field]: value }));
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
        response = await axios.put(`${apiBase}/products/${selectedProductId}`, formData, {
          headers: authHeaders()
        });
        setProductMsg('Product updated successfully.');
      } else {
        response = await axios.post(`${apiBase}/products`, formData, {
          headers: authHeaders()
        });
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
    if (!catalogStatus?.persistenceAvailable) return;
    if (!window.confirm('Delete this product?')) return;
    try {
      const response = await axios.delete(`${apiBase}/products/${id}`, { headers: authHeaders() });
      if (selectedProductId === id) resetProductForm();
      showCleanupWarning(response);
      setProductMsg('Product deleted successfully.');
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
    setUploadFiles([]);
    setProductError('');
    setProductMsg('');
    setSelectedProductId(product.id || product._id);
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
      <div className="flex min-h-[85vh] items-center justify-center bg-white p-4 font-sans">
        <div className="relative w-full max-w-md overflow-hidden rounded-[20px] border border-stone-100 bg-white p-7 shadow-[0_20px_55px_rgba(15,23,42,0.2)] sm:p-9">
          <div className="text-center">
            <div className="flex justify-center">
              <BrandLogo variant="dark" showTagline={false} />
            </div>
            <h1 className="mt-5 font-display text-[28px] font-bold leading-tight text-stone-950">DST Deco Admin Portal</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Sign in to manage your product catalog.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            {loginError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-900">Admin Email</label>
              <div className="relative">
                <Mail aria-hidden="true" size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-brand-charcoal shadow-[0_5px_14px_rgba(15,23,42,0.12)] placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-900">Master Password</label>
              <div className="relative">
                <LockKeyhole aria-hidden="true" size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-11 text-sm text-brand-charcoal shadow-[0_5px_14px_rgba(15,23,42,0.12)] placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3.5 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center p-1 text-slate-500 transition hover:text-slate-800 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-[0_10px_20px_rgba(5,150,105,0.3)] transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight aria-hidden="true" size={17} />
            </button>
          </form>

          <div className="mt-7 border-t border-slate-200 pt-5 text-center text-xs text-stone-400">
            Authorized administrators only
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Corner Admin Avatar Photo with Live Upload */}
            <div className="relative group shrink-0">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                aria-label="Upload Admin Profile Photo"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                title="Click to upload or change administrator profile picture"
                className="relative h-14 w-14 rounded-full border-2 border-amber-500 ring-2 ring-amber-400/30 overflow-hidden shadow-sm flex items-center justify-center bg-stone-100 hover:ring-amber-500 transition active:scale-95 cursor-pointer"
              >
                {adminAvatar ? (
                  <img src={adminAvatar} alt="Admin Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#292524] to-[#1c1917] flex items-center justify-center text-[#E5A924] font-bold font-serif text-xl border border-white/10">
                    {adminUser ? adminUser[0].toUpperCase() : 'A'}
                  </div>
                )}
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold">
                  <Camera size={16} />
                  <span className="mt-0.5">Upload</span>
                </div>
              </button>

              {/* Online Green Indicator Dot */}
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" title="Administrator Online" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-sans text-[11px] uppercase tracking-widest text-emerald-800 font-bold">Authenticated Admin</span>
                {adminAvatar && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="text-[10px] text-stone-400 hover:text-red-600 underline ml-1 cursor-pointer"
                    title="Remove custom photo"
                  >
                    remove photo
                  </button>
                )}
              </div>
              <h1 className="font-display text-2xl font-bold text-brand-charcoal mt-0.5">DST Deco Control Center</h1>
              <p className="font-sans text-xs text-brand-muted mt-0.5">
                Logged in as: <strong className="font-mono text-brand-charcoal">{adminUser || 'master_admin'}</strong>
              </p>
            </div>
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
                      <th className="p-4">Thumbnail</th>
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
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100 shadow-xs">
                            <img
                              src={p.thumbnail || p.images?.[0]}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute bottom-0 right-0 rounded-tl bg-amber-500 px-1 py-0.5 text-[8px] font-black text-stone-950" title="Primary Thumbnail">★</span>
                          </div>
                        </td>
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
                <input value={productForm.name} onChange={e => handleProductFieldChange('name', e.target.value)} placeholder="e.g. Natural Flexible Stone" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
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
                <input value={productForm.categoryName} onChange={e => handleProductFieldChange('categoryName', e.target.value)} placeholder="Wall Panels" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Description</label>
                <textarea rows="4" value={productForm.description} onChange={e => handleProductFieldChange('description', e.target.value)} placeholder="Architectural description..." className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Thickness</label>
                <input value={productForm.thickness} onChange={e => handleProductFieldChange('thickness', e.target.value)} placeholder="e.g. 5mm" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Dimensions</label>
                <input value={productForm.dimensions} onChange={e => handleProductFieldChange('dimensions', e.target.value)} placeholder="e.g. 1220mm x 2440mm" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Material</label>
                <input value={productForm.material} onChange={e => handleProductFieldChange('material', e.target.value)} placeholder="e.g. Natural Stone / Resin" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
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
                <input value={productForm.features} onChange={e => handleProductFieldChange('features', e.target.value)} placeholder="Waterproof, Fire rated, Eco friendly" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Existing / Remote Image URLs</label>
                <textarea rows="3" value={productForm.imageUrls} onChange={e => handleProductFieldChange('imageUrls', e.target.value)} className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" placeholder="One image URL per line" />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Upload Image Files</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => setUploadFiles(Array.from(e.target.files || []).slice(0, 12))}
                  className="w-full rounded-xl border border-dashed border-stone-300 bg-white px-3 py-3 text-xs text-brand-charcoal file:mr-3 file:rounded file:border-0 file:bg-brand-charcoal file:px-3 file:py-2 file:text-xs file:font-bold file:text-white floating-input"
                />
                <p className="mt-2 text-[10px] text-brand-muted">Upload up to 12 images at once; each image can be up to 8 MB.</p>
              </div>

              {(existingImageUrls.length > 0 || uploadFiles.length > 0) && (
                <div className="md:col-span-2">
                  <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                          Photos & Finishes Manager ({existingImageUrls.length} Active)
                        </span>
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
                          ★ #1 is Final Thumbnail
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        The 1st photo is the official catalog thumbnail. Click &quot;⭐ Set as Final Thumbnail&quot; on any photo to make it the primary cover, or use ◀ / ▶ to arrange the sequence (1st, 2nd, 3rd...).
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
                    {existingImageUrls.map((src, index) => {
                      const isMainThumb = index === 0;
                      return (
                        <div
                          key={src}
                          className={`relative overflow-hidden rounded-2xl border-2 transition-all p-2.5 bg-white flex flex-col justify-between shadow-xs ${
                            isMainThumb
                              ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-md bg-amber-50/25'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-100">
                            <img src={src} alt={`Finish ${index + 1}`} className="h-full w-full object-cover" />
                            {/* Position Badge */}
                            <span
                              className={`absolute left-1.5 top-1.5 rounded-md px-2 py-0.5 text-[9px] font-mono font-bold shadow-sm ${
                                isMainThumb
                                  ? 'bg-amber-500 text-stone-950 font-black ring-1 ring-white/50'
                                  : 'bg-black/75 text-white'
                              }`}
                            >
                              {isMainThumb ? '★ #1 Final Thumbnail' : `#${index + 1} Finish Option`}
                            </span>
                          </div>

                          <div className="mt-2.5 space-y-1.5">
                            {!isMainThumb ? (
                              <button
                                type="button"
                                onClick={() => setAsThumbnail(src)}
                                className="flex w-full items-center justify-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2 py-1.5 text-[10px] font-bold text-amber-900 transition hover:bg-amber-100 active:scale-95"
                              >
                                <span>⭐ Set as Final Thumbnail</span>
                              </button>
                            ) : (
                              <div className="flex w-full items-center justify-center gap-1 rounded-lg border border-amber-500/40 bg-amber-100/70 py-1.5 text-[10px] font-black text-amber-950">
                                <span>✓ Active Catalog Cover</span>
                              </div>
                            )}

                            <div className="flex items-center justify-between gap-1 pt-1 border-t border-stone-100">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => moveExistingImage(index, -1)}
                                  title="Move earlier in sequence"
                                  className="rounded border border-stone-200 bg-stone-50 px-2 py-1 text-[10px] font-bold text-stone-700 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-50"
                                >
                                  ◀
                                </button>
                                <button
                                  type="button"
                                  disabled={index === existingImageUrls.length - 1}
                                  onClick={() => moveExistingImage(index, 1)}
                                  title="Move later in sequence"
                                  className="rounded border border-stone-200 bg-stone-50 px-2 py-1 text-[10px] font-bold text-stone-700 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-50"
                                >
                                  ▶
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeExistingImage(src)}
                                className="rounded px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {uploadFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="relative overflow-hidden rounded-2xl border border-dashed border-emerald-500 bg-emerald-50/30 p-2.5 flex flex-col justify-between"
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-100">
                          <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
                          <span className="absolute left-1.5 top-1.5 rounded-md bg-emerald-700 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                            New Upload #{index + 1}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[9px] font-medium text-stone-600">{file.name}</p>
                        <div className="mt-2 flex items-center justify-between gap-1 border-t border-emerald-200 pt-1">
                          <div className="flex gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveUpload(index, -1)}
                              className="rounded border border-stone-200 bg-white px-2 py-0.5 text-[9px] font-bold text-stone-700 disabled:opacity-30"
                            >
                              ◀
                            </button>
                            <button
                              type="button"
                              disabled={index === uploadFiles.length - 1}
                              onClick={() => moveUpload(index, 1)}
                              className="rounded border border-stone-200 bg-white px-2 py-0.5 text-[9px] font-bold text-stone-700 disabled:opacity-30"
                            >
                              ▶
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeUploadFile(file)}
                            className="text-[10px] font-bold text-red-600 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedProductId && (
                    <p className="mt-2.5 text-[10px] text-brand-muted">
                      ℹ️ Remember to click &quot;Update Product&quot; below to permanently save your final thumbnail and sequence order.
                    </p>
                  )}
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
                  <input value={categoryForm.name} onChange={e => handleCategoryFieldChange('name', e.target.value)} placeholder="e.g. Wall Panels" className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Category Slug</label>
                  <input value={categoryForm.slug} onChange={e => handleCategoryFieldChange('slug', e.target.value)} className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" placeholder="wall-panels" />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">Description</label>
                  <textarea rows="4" value={categoryForm.description} onChange={e => handleCategoryFieldChange('description', e.target.value)} placeholder="Category summary..." className="w-full rounded-xl border border-stone-200/90 bg-white px-3.5 py-2.5 text-xs text-brand-charcoal placeholder-stone-400 focus:outline-none focus:border-brand-gold floating-input" />
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
