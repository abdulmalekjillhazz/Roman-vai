import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BrandLogo from '../../components/public/BrandLogo.jsx';
import { CLIENT_INFO } from '../../config/clientInfo.js';

export default function AdminDashboard() {
  const [token, setToken] = useState(() => sessionStorage.getItem('dst_admin_token') || '');
  const [adminUser, setAdminUser] = useState(() => sessionStorage.getItem('dst_admin_email') || '');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBase}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
  }

  // =========================================================================
  // 1. LOCKED GATE: IF NOT LOGGED IN, RENDER AUTHENTICATION FORM ONLY
  // =========================================================================
  if (!token) {
    return (
      <div className="min-h-[85vh] bg-brand-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-brand-sand max-w-md w-full p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold" />

          <div className="text-center">
            <BrandLogo variant="dark" showTagline={false} />
            <h1 className="font-display text-2xl font-bold text-brand-charcoal mt-6">
              DST Deco Admin Portal
            </h1>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="dstdeco@gmail.com"
                className="w-full bg-brand-cream/40 border border-brand-sand rounded-xl px-4 py-3 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
                Master Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-brand-cream/40 border border-brand-sand rounded-xl px-4 py-3 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold"
              />
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

  // =========================================================================
  // 2. PROTECTED DASHBOARD: ONLY VISIBLE AFTER AUTHENTICATION
  // =========================================================================
  return (
    <div className="min-h-screen bg-brand-cream py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Top Control Bar */}
        <div className="bg-white rounded-2xl border border-brand-sand p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-sans text-[11px] uppercase tracking-widest text-emerald-800 font-bold">
                Authenticated Session
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-brand-charcoal mt-1">
              DST Deco Control Center
            </h1>
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

        {/* Catalog Table */}
        <div className="bg-white rounded-2xl border border-brand-sand overflow-hidden shadow-sm">
          <div className="p-6 border-b border-brand-sand/60 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-brand-charcoal">
                Active Material Inventory
              </h2>
              <p className="text-xs text-brand-muted">
                18 Curated Luxury Materials across Wall, Flooring, Woodworking, and Profiles.
              </p>
            </div>
            <button
              onClick={fetchProducts}
              className="text-xs font-bold text-brand-gold hover:underline"
            >
              🔄 Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs text-brand-muted">
              Loading inventory...
            </div>
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
                    <th className="p-4">Stock Status</th>
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
                      <td className="p-4 font-mono text-stone-600">
                        {p.images?.length || 0} Photos
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.inStock ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800'
                        }`}>
                          {p.inStock ? '● In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
