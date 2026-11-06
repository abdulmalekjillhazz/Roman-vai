import React from 'react';

export default function ProductInventory({ products, loading, fetchProducts, editProduct, deleteProduct }) {
  return (
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
  );
}
