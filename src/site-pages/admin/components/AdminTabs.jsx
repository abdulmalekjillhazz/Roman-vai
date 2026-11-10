import React from 'react';

export default function AdminTabs({ activeTab, setActiveTab }) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {['products', 'new-product', 'categories', 'hero-images', 'faqs', 'business-profile'].map(tab => (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider ${
            activeTab === tab ? 'bg-brand-charcoal text-white' : 'bg-white border border-brand-sand text-brand-charcoal'
          }`}
        >
          {tab === 'products'
            ? 'Inventory'
            : tab === 'new-product'
            ? 'Add Product'
            : tab === 'categories'
            ? 'Categories'
            : tab === 'hero-images'
            ? 'Hero Images'
            : tab === 'faqs'
            ? 'FAQs'
            : 'Business Profile'}
        </button>
      ))}
    </div>
  );
}
