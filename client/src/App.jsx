import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/public/Navbar.jsx';
import BrandLogo from './components/public/BrandLogo.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import SiteImageGalleryPage from './pages/SiteImageGalleryPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import LeadFormModal from './components/public/LeadFormModal.jsx';
import { CLIENT_INFO } from './config/clientInfo.js';

export default function App() {
  const [quoteModal, setQuoteModal] = useState({ open: false, item: '' });

  function handleOpenQuote(itemName) {
    setQuoteModal({ open: true, item: itemName });
  }

  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-brand-cream text-brand-charcoal font-sans">
          <Navbar onOpenQuote={handleOpenQuote} />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage onOpenQuote={handleOpenQuote} />} />
              <Route path="/category/:categorySlug" element={<HomePage onOpenQuote={handleOpenQuote} />} />
              <Route path="/product/:slug" element={<ProductDetailPage onOpenQuote={handleOpenQuote} />} />
              <Route path="/gallery" element={<SiteImageGalleryPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          {/* Official Contact & Corporate Showroom Section */}
          <section id="contact" className="bg-brand-charcoal text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-stone-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
              <div>
                <BrandLogo variant="light" showTagline={true} />
                <p className="font-sans text-stone-400 text-xs sm:text-sm mt-4 leading-relaxed">
                  Dubai's premier B2B interior & exterior architectural surfaces supplier. Supplying wholesale contractors, interior designers, and luxury projects with WPC, SPC, LVT, Flexible Stone, and PU Stone solutions.
                </p>
                <div className="mt-4 font-mono text-[11px] text-brand-gold">
                  Showroom: {CLIENT_INFO.location}
                </div>
                <div className="text-[11px] text-stone-400 font-sans mt-1">
                  Operating Hours: {CLIENT_INFO.workingHours}
                </div>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm">
                <h3 className="font-display text-brand-gold font-bold uppercase tracking-wider text-xs">
                  Direct Inquiries & Trade Desk
                </h3>
                <p className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-brand-gold text-brand-charcoal flex items-center justify-center font-bold text-xs shrink-0">W</span>
                  <a href={`https://wa.me/${CLIENT_INFO.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition font-mono font-medium">
                    {CLIENT_INFO.phoneDisplay} (Direct WhatsApp)
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-brand-gold text-brand-charcoal flex items-center justify-center font-bold text-xs shrink-0">✉</span>
                  <a href={`mailto:${CLIENT_INFO.email}`} className="hover:text-brand-gold transition font-medium">
                    {CLIENT_INFO.email}
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-brand-gold text-brand-charcoal flex items-center justify-center font-bold text-xs shrink-0">✉</span>
                  <a href={`mailto:${CLIENT_INFO.secondaryEmail}`} className="hover:text-brand-gold transition font-medium">
                    {CLIENT_INFO.secondaryEmail}
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-brand-gold text-brand-charcoal flex items-center justify-center font-bold text-xs shrink-0">IG</span>
                  <a href={CLIENT_INFO.socials.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition font-medium">
                    Instagram: {CLIENT_INFO.socials.instagramHandle}
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-brand-gold text-brand-charcoal flex items-center justify-center font-bold text-xs shrink-0">f</span>
                  <a href={CLIENT_INFO.socials.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition font-medium">
                    Facebook: /{CLIENT_INFO.socials.facebookHandle}
                  </a>
                </p>
              </div>

              <div className="bg-stone-900/90 p-6 sm:p-7 rounded-3xl border border-brand-sand/20">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-brand-gold font-bold">
                  B2B Trade Service
                </span>
                <h4 className="font-display font-bold text-base text-white mt-1">Direct Supply & Contractor Rates</h4>
                <p className="text-xs text-stone-400 mt-2 font-sans leading-relaxed">
                  Direct commercial supply across Dubai and UAE for interior designers, fit-out contractors, and project developers.
                </p>
                <button
                  onClick={() => handleOpenQuote('Wholesale Trade Inquiry & Catalog')}
                  className="mt-5 w-full py-3 bg-brand-gold hover:bg-brand-goldHover text-brand-charcoal font-sans font-bold rounded-xl text-xs sm:text-sm tracking-wide transition shadow-lg"
                >
                  Request Trade Quotation
                </button>
              </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-sans">
              <p>© {new Date().getFullYear()} {CLIENT_INFO.brandName} ({CLIENT_INFO.tradeName}). All rights reserved.</p>
              <p className="mt-2 sm:mt-0 font-medium text-stone-400">{CLIENT_INFO.tagline} • {CLIENT_INFO.location}</p>
            </div>
          </section>

          {/* Luxury Floating WhatsApp Trade Concierge */}
          <a
            href={`https://wa.me/${CLIENT_INFO.whatsappNumber}?text=${encodeURIComponent("Hello Classical Decor ID, I'd like to inquire about your architectural catalog and wholesale pricing.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba59] hover:to-[#0e7467] text-white pl-4 pr-5 py-3 rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.35)] hover:shadow-[0_12px_35px_rgb(37,211,102,0.5)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0 border border-white/25 backdrop-blur-sm"
          >
            <div className="relative">
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.031 0C5.396 0 .029 5.367.029 12.002c0 2.118.553 4.187 1.603 6.007L0 24l6.167-1.618a11.97 11.97 0 005.864 1.518h.005c6.634 0 12.001-5.367 12.001-12.002C24.037 5.368 18.67 0 12.031 0zm0 21.897c-1.8 0-3.565-.484-5.105-1.4l-.366-.217-3.793.995 1.013-3.697-.238-.379a9.92 9.92 0 01-1.521-5.197c0-5.498 4.474-9.972 9.975-9.972 2.664 0 5.168 1.038 7.051 2.922a9.92 9.92 0 012.921 7.052c0 5.499-4.474 9.973-9.975 9.973zm5.467-7.464c-.299-.15-1.771-.874-2.046-.974-.275-.1-.475-.15-.675.15s-.774.974-.95 1.173c-.174.2-.349.225-.648.075-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.494-1.78-1.669-2.079-.175-.3-.019-.462.131-.611.135-.134.299-.349.449-.524.15-.175.2-.3.3-.5.1-.2.05-.374-.025-.524-.075-.15-.675-1.623-.925-2.222-.243-.583-.49-.504-.674-.513-.174-.009-.374-.01-.574-.01s-.524.075-.798.374c-.275.3-1.049 1.024-1.049 2.5 0 1.474 1.074 2.898 1.224 3.098.15.2 2.113 3.227 5.119 4.526.715.309 1.273.494 1.708.632.718.228 1.371.196 1.888.118.577-.087 1.771-.724 2.021-1.423.25-.699.25-1.298.175-1.423-.075-.125-.275-.2-.575-.35z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-sans font-bold text-xs tracking-wide">WhatsApp Trade Desk</span>
              <span className="text-[10px] text-white/90 font-sans font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                <span>Direct Dubai Support</span>
              </span>
            </div>
          </a>

          <LeadFormModal
            isOpen={quoteModal.open}
            initialCategory={quoteModal.item}
            onClose={() => setQuoteModal({ open: false, item: '' })}
          />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
