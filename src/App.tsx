/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedCategories } from './components/FeaturedCategories';
import { NewArrivalsSection } from './components/NewArrivalsSection';
import { EditorialSection } from './components/EditorialSection';
import { ProductGrid } from './components/ProductGrid';
import { AboutSection } from './components/AboutSection';
import { WhatsAppCtaBanner } from './components/WhatsAppCtaBanner';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { AdminModal } from './components/AdminModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { CartToast } from './components/CartToast';

function StorefrontContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col w-full max-w-full overflow-x-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#1D1718] text-[#F7EFE8]' : 'bg-[#FAF7F2] text-[#2B211E]'
      }`}
    >
      {/* 1. Premium Navbar */}
      <Navbar />

      {/* Main Storefront Body */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Featured Collection */}
        <FeaturedCategories />

        {/* 4. New Arrivals */}
        <NewArrivalsSection />

        {/* 5. Editorial Fashion Image Section */}
        <EditorialSection />

        {/* 6. Product Showcase & Filter Grid */}
        <ProductGrid />

        {/* 7. Boutique Heritage Story */}
        <AboutSection />

        {/* 8. WhatsApp Shopping CTA */}
        <WhatsAppCtaBanner />

        {/* 9. Contact / Bahawalpur Location */}
        <ContactSection />
      </main>

      {/* 10. Footer */}
      <Footer />

      {/* Modals & Floating Affordances */}
      <ProductDetailsModal />
      <AdminModal />
      <CartDrawer />
      <CartToast />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProductProvider>
        <CartProvider>
          <StorefrontContent />
        </CartProvider>
      </ProductProvider>
    </ThemeProvider>
  );
}
