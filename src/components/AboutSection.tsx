import React from 'react';
import { MapPin, UserCheck, MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppUrl } from '../utils/whatsapp';
import { useTheme } from '../context/ThemeContext';

export const AboutSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="about"
      className={`py-14 sm:py-24 border-t transition-colors duration-300 w-full max-w-full overflow-hidden ${
        isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Visual Column */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div
              className={`relative rounded-xl overflow-hidden shadow-lg border ${
                isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
              }`}
            >
              <img
                src="/images/real_maroon_gold_chunri_1790696956750.jpg"
                alt="Fairytale Chunri Closet authentic fabrics in Bahawalpur"
                className="w-full h-80 sm:h-96 object-cover object-top"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/images/cat_chunri_dupattas_1790695254180.jpg';
                }}
              />
              <div
                className={`p-5 border-t space-y-2 text-left ${
                  isDark ? 'border-[#3D2E32] text-[#D8C7B5]' : 'border-[#EAE2D6] text-[#6B5B53]'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>Origin</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#2B211E]'}`}>
                    Bahawalpur, Punjab
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Craft</span>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#2B211E]'}`}>
                    Hand-Tied Chunri & Festive Attire
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Owner</span>
                  <span className="font-semibold text-[#651F32] dark:text-[#DEC596]">
                    {BUSINESS_CONFIG.owner}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Prose Content Column */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-left">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#651F32] dark:text-[#DEC596] font-semibold mb-2">
                Our Story & Heritage
              </p>
              <h2
                className={`font-serif text-3xl sm:text-4xl font-medium tracking-tight ${
                  isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
                }`}
              >
                About Fairytale Chunri Closet
              </h2>
              <div className="w-12 h-0.5 bg-[#C9A96E] mt-3" />
            </div>

            {/* Core statement */}
            <p
              className={`text-base sm:text-lg leading-relaxed font-normal ${
                isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
              }`}
            >
              Fairytale Chunri Closet brings together beautiful traditional and contemporary clothing pieces for customers who appreciate color, craftsmanship and timeless Pakistani fashion.
            </p>

            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
              Based in the historic artisan city of Bahawalpur, Punjab, Pakistan, our collection celebrates the intricate resist-dye Chunri patterns and classic festive stitching that have adorned women across South Asia for generations. Every piece is carefully prepared, dyed, and inspected to ensure fast colors, graceful drape, and authentic traditional beauty.
            </p>

            {/* Factual Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-[#651F32] dark:text-[#DEC596]">
                  <MapPin className="w-4 h-4 text-[#C9A96E]" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Location</span>
                </div>
                <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'}`}>
                  Bahawalpur, Punjab, Pakistan
                </p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-[#651F32] dark:text-[#DEC596]">
                  <UserCheck className="w-4 h-4 text-[#C9A96E]" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Business Owner</span>
                </div>
                <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'}`}>
                  {BUSINESS_CONFIG.owner}
                </p>
              </div>
            </div>

            {/* WhatsApp Chat link */}
            <div className="pt-2">
              <a
                href={getWhatsAppUrl(`Assalam o Alaikum Yasir Bhai, I would like to learn more about your Chunri collections.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#651F32] dark:text-[#DEC596] hover:underline"
              >
                <MessageCircle className="w-4 h-4 text-[#651F32] dark:text-[#DEC596]" />
                <span>Connect directly with Yasir Farooq on WhatsApp →</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
