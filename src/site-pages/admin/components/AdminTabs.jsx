import React from 'react';
import { Boxes, ClipboardList, FolderKanban, HelpCircle, Image as ImageIcon, Layers3, MessageSquare, Settings2, Tags } from 'lucide-react';

const TAB_META = {
  products: ['Inventory', Boxes],
  'new-product': ['Add Product', ClipboardList],
  categories: ['Categories', Tags],
  'hero-images': ['Hero Images', ImageIcon],
  faqs: ['FAQs', HelpCircle],
  services: ['Services', Settings2],
  projects: ['Projects', FolderKanban],
  reviews: ['Reviews', MessageSquare],
  'business-profile': ['Business Profile', Layers3]
};

export default function AdminTabs({ activeTab, setActiveTab }) {
  return (
    <nav aria-label="Admin sections" className="mb-6 overflow-x-auto rounded-2xl border border-stone-200/80 bg-white/80 p-2 shadow-[0_10px_28px_-18px_rgba(28,25,23,0.45)] backdrop-blur-sm">
      <div className="flex min-w-max gap-1.5">
      {['products', 'new-product', 'categories', 'hero-images', 'faqs', 'services', 'projects', 'reviews', 'business-profile'].map(tab => (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          aria-current={activeTab === tab ? 'page' : undefined}
          className={`min-h-11 rounded-xl px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition sm:px-4 sm:text-[11px] ${
            activeTab === tab
              ? 'bg-brand-charcoal text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
          }`}
        >
          {(() => {
            const [label, Icon] = TAB_META[tab];
            return <><Icon aria-hidden="true" size={15} strokeWidth={2.2} /><span>{label}</span></>;
          })()}
        </button>
      ))}
      </div>
    </nav>
  );
}
