import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Menu, X, Lock, ChevronDown, Sparkles, ShoppingBag } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppUrl } from '../utils/whatsapp';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { ProductCategory } from '../types';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { setAdminModalOpen, isAdmin, setActiveCategory } = useProducts();
  const { totalItems, setIsCartOpen } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const collectionCategories: { label: string; catId: ProductCategory; desc: string }[] = [
    { label: 'All Collections', catId: 'All', desc: 'Browse full boutique catalog' },
    { label: 'Chunri Dupattas', catId: 'Chunri', desc: 'Authentic Bahawalpuri tie-dye' },
    { label: 'Festive Suits', catId: 'Suits', desc: '2 & 3-piece complete ensembles' },
    { label: 'Luxury Dupattas', catId: 'Dupattas', desc: 'Crinkle chiffon & gotta finished' },
    { label: 'Unstitched Fabrics', catId: 'Unstitched', desc: 'Pure cambric & lawn fabrics' },
    { label: 'Ready to Wear', catId: 'Ready to Wear', desc: 'Stitched pret & kurtis' },
    { label: 'New Arrivals', catId: 'New Arrivals', desc: 'Fresh from the workshop' },
  ];

  const handleSelectCollection = (catId: ProductCategory) => {
    setActiveCategory(catId);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    const catalogEl = document.querySelector('#products') || document.querySelector('#catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? 'bg-[#1D1718]/95 backdrop-blur-md border-b border-[#3D2E32] shadow-sm py-2.5 sm:py-3'
            : 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE2D6] shadow-xs py-2.5 sm:py-3'
          : isDark
            ? 'bg-[#1D1718]/85 backdrop-blur-xs border-b border-transparent py-3.5 sm:py-4'
            : 'bg-[#FAF7F2]/85 backdrop-blur-xs border-b border-transparent py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          
          {/* Zone 1: Clean Brand Wordmark */}
          <a
            href="#home"
            className="flex flex-col text-left group min-w-0 transition-transform duration-200"
          >
            <span
              className={`font-serif text-base xs:text-lg sm:text-xl lg:text-2xl font-medium tracking-tight truncate transition-colors ${
                isDark ? 'text-[#F7EFE8] group-hover:text-[#DEC596]' : 'text-[#651F32] group-hover:text-[#4E1525]'
              }`}
            >
              Fairytale Chunri Closet
            </span>
            <span
              className={`text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-medium ${
                isDark ? 'text-[#DEC596]' : 'text-[#6B5B53]'
              }`}
            >
              Bahawalpur
            </span>
          </a>

          {/* Zone 2: Minimalist Navigation Links (Max 4 clean items) */}
          <nav className="hidden lg:flex items-center space-x-7 shrink-0">
            {/* Collections Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1 cursor-pointer flex items-center gap-1.5 group/link ${
                  dropdownOpen
                    ? isDark ? 'text-white' : 'text-[#651F32]'
                    : isDark ? 'text-[#F7EFE8]/80 hover:text-white' : 'text-[#2B211E]/80 hover:text-[#651F32]'
                }`}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#C9A96E] transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A96E] group-hover/link:w-full transition-all duration-300" />
              </button>

              {/* Luxury Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className={`absolute top-full left-0 mt-2 w-64 rounded-xl border shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${
                    isDark
                      ? 'bg-[#261D1F] border-[#3D2E32] text-[#F7EFE8]'
                      : 'bg-white border-[#EAE2D6] text-[#2B211E]'
                  }`}
                >
                  <div className="px-3 py-1.5 border-b border-[#C9A96E]/20 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A96E]">
                      Explore By Line
                    </span>
                    <Sparkles className="w-3 h-3 text-[#C9A96E]" />
                  </div>

                  <div className="space-y-0.5">
                    {collectionCategories.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleSelectCollection(item.catId)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex flex-col group/item cursor-pointer ${
                          isDark
                            ? 'hover:bg-[#1D1718] hover:text-[#DEC596]'
                            : 'hover:bg-[#FAF7F2] hover:text-[#651F32]'
                        }`}
                      >
                        <span className="font-semibold text-xs tracking-wide">
                          {item.label}
                        </span>
                        <span className="text-[10px] opacity-60 font-normal">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-1 pt-1.5 border-t border-[#C9A96E]/20">
                    <button
                      type="button"
                      onClick={() => handleNavClick('#collections')}
                      className="w-full text-center py-1.5 text-[11px] font-semibold text-[#651F32] dark:text-[#DEC596] hover:underline cursor-pointer"
                    >
                      View All Featured Showcase →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNavClick('#products')}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1 cursor-pointer relative group/link ${
                isDark ? 'text-[#F7EFE8]/80 hover:text-white' : 'text-[#2B211E]/80 hover:text-[#651F32]'
              }`}
            >
              <span>Catalog</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A96E] group-hover/link:w-full transition-all duration-300" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('#about')}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1 cursor-pointer relative group/link ${
                isDark ? 'text-[#F7EFE8]/80 hover:text-white' : 'text-[#2B211E]/80 hover:text-[#651F32]'
              }`}
            >
              <span>About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A96E] group-hover/link:w-full transition-all duration-300" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('#contact')}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1 cursor-pointer relative group/link ${
                isDark ? 'text-[#F7EFE8]/80 hover:text-white' : 'text-[#2B211E]/80 hover:text-[#651F32]'
              }`}
            >
              <span>Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A96E] group-hover/link:w-full transition-all duration-300" />
            </button>
          </nav>

          {/* Zone 3: Minimalist Right Actions (Sleek Icons + Primary WhatsApp Button) */}
          <div className="flex items-center space-x-1 sm:space-x-3 shrink-0">
            {/* Real Theme Toggle */}
            <ThemeToggle />

            {/* Shopping Cart Icon Button with Floating Pill Count */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping Cart with ${totalItems} items`}
              title={`View Shopping Cart (${totalItems} items)`}
              className={`relative p-2 sm:p-2.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isDark
                  ? 'hover:bg-[#261D1F] text-[#F7EFE8] hover:text-[#DEC596]'
                  : 'hover:bg-[#F3EDE4] text-[#2B211E] hover:text-[#651F32]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-[#651F32] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-[#DEC596] shadow-sm animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Discrete Admin Portal Lock Icon Button */}
            <button
              onClick={() => setAdminModalOpen(true)}
              title={isAdmin ? 'Owner Dashboard (Active)' : 'Owner Portal'}
              aria-label="Admin Portal"
              className={`flex p-2 sm:p-2.5 rounded-full transition-colors cursor-pointer items-center justify-center ${
                isAdmin
                  ? 'bg-[#651F32] text-white shadow-xs'
                  : isDark
                    ? 'hover:bg-[#261D1F] text-[#F7EFE8]/70 hover:text-white'
                    : 'hover:bg-[#F3EDE4] text-[#6B5B53] hover:text-[#651F32]'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#C9A96E]" />
            </button>

            {/* Primary Action: Sleek Rounded WhatsApp Order CTA */}
            <a
              href={getWhatsAppUrl(`Assalam o Alaikum, I am browsing Fairytale Chunri Closet and would like to place an order.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#651F32] hover:bg-[#4E1525] text-white text-xs font-semibold px-4 py-2 sm:py-2.5 rounded-full shadow-xs hover:shadow-md active:scale-98 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-transparent shrink-0" />
              <span>WhatsApp Order</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-md focus:outline-hidden cursor-pointer ${
                isDark ? 'text-white hover:bg-[#261D1F]' : 'text-[#2B211E] hover:bg-[#F3EDE4]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-black/60 backdrop-blur-xs z-50 animate-fade-in flex flex-col justify-start">
          <div
            className={`border-b px-6 pt-4 pb-8 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto ${
              isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#3D2E32]/30">
              <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
                Boutique Navigation
              </span>
              <ThemeToggle showLabel />
            </div>

            {/* Mobile Cart Trigger */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-lg border cursor-pointer flex items-center justify-between ${
                isDark
                  ? 'bg-[#261D1F] border-[#3D2E32] text-[#DEC596]'
                  : 'bg-white border-[#EAE2D6] text-[#651F32]'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                <ShoppingBag className="w-4 h-4" />
                <span>Shopping Cart</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#651F32] text-white">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </button>

            {/* Quick Links */}
            <div className="flex flex-col space-y-1">
              <button
                type="button"
                onClick={() => handleNavClick('#home')}
                className={`text-left py-2.5 text-base font-serif border-b cursor-pointer flex items-center justify-between ${
                  isDark ? 'text-[#F7EFE8] border-[#261D1F]' : 'text-[#2B211E] border-[#F3EDE4]'
                }`}
              >
                <span>Home</span>
                <span className="text-xs text-[#C9A96E]">→</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#products')}
                className={`text-left py-2.5 text-base font-serif border-b cursor-pointer flex items-center justify-between ${
                  isDark ? 'text-[#F7EFE8] border-[#261D1F]' : 'text-[#2B211E] border-[#F3EDE4]'
                }`}
              >
                <span>Catalog</span>
                <span className="text-xs text-[#C9A96E]">→</span>
              </button>

              {/* Collections Sub-list */}
              <div className="py-2 space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#C9A96E] font-semibold block mb-1">
                  Collections & Categories
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {collectionCategories.filter(c => c.catId !== 'All').map((cat) => (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => handleSelectCollection(cat.catId)}
                      className={`text-left p-2 rounded text-xs font-medium border cursor-pointer ${
                        isDark
                          ? 'bg-[#261D1F] border-[#3D2E32] text-[#F7EFE8] hover:border-[#DEC596]'
                          : 'bg-white border-[#EAE2D6] text-[#2B211E] hover:border-[#651F32]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNavClick('#about')}
                className={`text-left py-2.5 text-base font-serif border-b cursor-pointer flex items-center justify-between ${
                  isDark ? 'text-[#F7EFE8] border-[#261D1F]' : 'text-[#2B211E] border-[#F3EDE4]'
                }`}
              >
                <span>About Atelier</span>
                <span className="text-xs text-[#C9A96E]">→</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className={`text-left py-2.5 text-base font-serif border-b cursor-pointer flex items-center justify-between ${
                  isDark ? 'text-[#F7EFE8] border-[#261D1F]' : 'text-[#2B211E] border-[#F3EDE4]'
                }`}
              >
                <span>Contact & Location</span>
                <span className="text-xs text-[#C9A96E]">→</span>
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <a
                href={getWhatsAppUrl(`Assalam o Alaikum, I would like to inquire about Fairytale Chunri Closet.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#651F32] text-white py-3 rounded-full font-semibold text-sm shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>Chat on WhatsApp (+92 303 6466711)</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAdminModalOpen(true);
                }}
                className={`w-full text-center py-2 text-xs flex items-center justify-center gap-1.5 border rounded-full cursor-pointer ${
                  isDark
                    ? 'bg-[#261D1F] border-[#3D2E32] text-[#F7EFE8] hover:bg-[#35282B]'
                    : 'bg-white border-[#D8C7B5] text-[#6B5B53] hover:text-[#651F32]'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>{isAdmin ? 'Yasir Farooq (Admin Dashboard)' : 'Owner Login'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
