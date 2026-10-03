import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { getGeneralInquiryWhatsAppUrl, BUSINESS_CONFIG } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find hero section height or use sensible scroll threshold (e.g. 260px)
      const heroElement = document.getElementById('home');
      const threshold = heroElement ? heroElement.offsetHeight * 0.6 : 300;

      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <aside
      aria-label="WhatsApp Contact"
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-6 scale-90 pointer-events-none'
      }`}
    >
      <a
        href={getGeneralInquiryWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-[#25D366]/40"
        title={`Chat on WhatsApp (${BUSINESS_CONFIG.whatsappDisplay})`}
        aria-label="Direct WhatsApp Chat with Fairytale Chunri Closet"
      >
        {/* Subtle pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 group-hover:opacity-50 animate-ping pointer-events-none" />

        {/* Icon */}
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-transparent relative z-10" />

        {/* Hover Tooltip - Desktop */}
        <span className="hidden sm:inline-block absolute right-16 bg-[#2C2420] text-white text-xs font-medium px-3 py-1.5 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with {BUSINESS_CONFIG.owner} on WhatsApp
        </span>
      </a>
    </aside>
  );
};
