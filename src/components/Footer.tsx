import React from 'react';
import { MapPin, Phone, MessageCircle, Lock } from 'lucide-react';
import { BUSINESS_CONFIG, getGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';
import { useProducts } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

export const Footer: React.FC = () => {
  const { setAdminModalOpen, isAdmin } = useProducts();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      className={`pt-14 pb-12 border-t transition-colors duration-300 w-full max-w-full overflow-hidden ${
        isDark ? 'bg-[#181213] border-[#3D2E32] text-[#D8C7B5]' : 'bg-[#2B211E] border-[#3D302C] text-[#D8C7B5]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10 text-left">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl text-white font-medium block tracking-tight">
              Fairytale Chunri Closet
            </span>
            <p className="text-xs sm:text-sm text-[#A8988B] leading-relaxed max-w-sm font-normal">
              Authentic Bahawalpuri hand-tie-dye Chunri, festive dupattas, and traditional luxury unstitched & ready-to-wear collections.
            </p>
            <div className="pt-2 text-xs text-[#8C7A6B] space-y-1">
              <p>
                Owner: <strong className="text-white font-medium">{BUSINESS_CONFIG.owner}</strong>
              </p>
              <p>
                Based in: <span className="text-[#D8C7B5]">{BUSINESS_CONFIG.location}</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
              Boutique Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleScroll('#home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#collections')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Featured Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#new-arrivals')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Catalog & Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#editorial')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Artisan Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScroll('#contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-[#A8988B]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                <span>{BUSINESS_CONFIG.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C9A96E] shrink-0" />
                <a
                  href={`tel:${BUSINESS_CONFIG.whatsappRaw}`}
                  className="hover:text-white transition-colors tabular-nums"
                >
                  {BUSINESS_CONFIG.whatsappDisplay}
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={getGeneralInquiryWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#651F32] hover:bg-[#4E1525] text-white text-xs font-semibold px-4 py-2.5 rounded-md transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                <span>Order on WhatsApp</span>
              </a>
              <ThemeToggle />
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7A6B] gap-4">
          <p>
            © 2026 Fairytale Chunri Closet. Bahawalpur, Punjab, Pakistan.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[#A8988B]">
              Handcrafted in Pakistan
            </span>
            <span className="text-white/20">|</span>
            <button
              onClick={() => setAdminModalOpen(true)}
              className="text-[#8C7A6B] hover:text-[#C9A96E] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3 h-3 text-[#C9A96E]" />
              <span>{isAdmin ? 'Admin Dashboard (Active)' : 'Admin Login'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
