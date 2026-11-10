import React, { useMemo, useState } from 'react';
import { createAdminApi } from './api.js';
import useAdminAuth from './hooks/useAdminAuth.js';
import useCatalogStatus from './hooks/useCatalogStatus.js';
import useProducts from './hooks/useProducts.js';
import useCategories from './hooks/useCategories.js';
import useHeroImages from './hooks/useHeroImages.js';
import useFAQs from './hooks/useFAQs.js';
import useServices from './hooks/useServices.js';
import useProjects from './hooks/useProjects.js';
import useBusinessProfile from './hooks/useBusinessProfile.js';
import AdminLogin from './components/AdminLogin.jsx';
import AdminHeader from './components/AdminHeader.jsx';
import AdminTabs from './components/AdminTabs.jsx';
import ProductInventory from './components/ProductInventory.jsx';
import ProductEditor from './components/ProductEditor.jsx';
import CategoriesPanel from './components/CategoriesPanel.jsx';
import HeroImagesPanel from './components/HeroImagesPanel.jsx';
import FAQPanel from './components/FAQPanel.jsx';
import BusinessProfilePanel from './components/BusinessProfilePanel.jsx';
import ServicesPanel from './components/ServicesPanel.jsx';
import ProjectsPanel from './components/ProjectsPanel.jsx';

export default function AdminDashboard() {
  const auth = useAdminAuth();
  const api = useMemo(() => createAdminApi(auth.token, auth.handleSessionExpired), [auth.token, auth.handleSessionExpired]);
  const [activeTab, setActiveTab] = useState('products');
  const enabled = Boolean(auth.token);
  const catalogStatus = useCatalogStatus(api, enabled);

  // Keep feature state mounted so switching tabs preserves unfinished edits.
  const productManager = useProducts(api, enabled, catalogStatus);
  const categoryManager = useCategories(api, enabled);
  const heroManager = useHeroImages(api, enabled);
  const faqManager = useFAQs(api, enabled);
  const serviceManager = useServices(api, enabled);
  const projectManager = useProjects(api, enabled);
  const businessProfileManager = useBusinessProfile(api, enabled);

  function handleLogout() {
    auth.handleLogout();
    productManager.resetProductForm();
    categoryManager.resetCategoryForm();
    faqManager.resetFaqForm();
  }

  function editProduct(product) {
    productManager.editProduct(product);
    setActiveTab('new-product');
  }

  function editCategory(category) {
    categoryManager.editCategory(category);
    setActiveTab('categories');
  }

  function editFaq(faq) {
    faqManager.editFAQ(faq);
    setActiveTab('faqs');
  }

  if (!auth.token) return <AdminLogin auth={auth} />;

  return (
    <div className="min-h-screen bg-brand-cream py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <AdminHeader auth={auth} productCount={productManager.products.length} onLogout={handleLogout} />
        <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'hero-images' && (
          <HeroImagesPanel heroManager={heroManager} catalogStatus={catalogStatus} />
        )}

        {activeTab === 'products' && (
          <ProductInventory
            products={productManager.products}
            loading={productManager.loading}
            fetchProducts={productManager.fetchProducts}
            editProduct={editProduct}
            deleteProduct={productManager.deleteProduct}
          />
        )}

        {activeTab === 'new-product' && (
          <ProductEditor productManager={productManager} categories={categoryManager.categories} />
        )}

        {activeTab === 'categories' && (
          <CategoriesPanel categoryManager={categoryManager} onEditCategory={editCategory} />
        )}

        {activeTab === 'faqs' && (
          <FAQPanel faqManager={faqManager} onEditFaq={editFaq} />
        )}

        {activeTab === 'services' && (
          <ServicesPanel serviceManager={serviceManager} />
        )}

        {activeTab === 'projects' && (
          <ProjectsPanel projectManager={projectManager} />
        )}

        {activeTab === 'business-profile' && (
          <BusinessProfilePanel businessProfileManager={businessProfileManager} />
        )}
      </div>
    </div>
  );
}
