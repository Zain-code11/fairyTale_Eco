import React from 'react';
import { Sparkles, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { useTheme } from '../context/ThemeContext';

export const EditorialSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="editorial"
      className={`py-16 sm:py-28 border-t relative overflow-hidden transition-colors duration-300 w-full max-w-full ${
        isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
      }`}
    >
      {/* Subtle gold hairline */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#651F32]/10 border border-[#C9A96E]/40 text-[#651F32] dark:text-[#DEC596] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>The Heritage of Bahawalpur</span>
          </div>
          <h2
            className={`font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight ${
              isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
            }`}
          >
            Tradition, Refined
          </h2>
          <div className="w-16 h-0.5 bg-[#C9A96E] mx-auto mt-4 mb-4" />
          <p
            className={`text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'
            }`}
          >
            Every suit in the Fairytale Chunri Closet is individually resist-dyed with thousands of handcrafted knots, celebrating centuries of royal textile art from Southern Punjab.
          </p>
        </div>

        {/* Editorial Collage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Main Visual Column */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <div
                className={`relative rounded-xl overflow-hidden border shadow-md group aspect-3/4 ${
                  isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
                }`}
              >
                <img
                  src="/images/real_emerald_gold_chunri_1790700347618.jpg"
                  alt="Emerald Green & Gold Zari Handcrafted Chunri"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/images/cat_festive_suits_1790695267577.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-left">
                  <span className="text-[10px] uppercase tracking-wider text-[#DEC596] font-semibold block">Festive Palette</span>
                  <p className="font-serif text-sm sm:text-base leading-snug">Deep Emerald & Gold Zari</p>
                </div>
              </div>

              <div
                className={`p-5 rounded-xl border text-left ${
                  isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
                }`}
              >
                <span className="text-[11px] font-semibold text-[#651F32] dark:text-[#DEC596] uppercase tracking-wider block mb-1">
                  100% Hand-Tied Bandhani
                </span>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
                  Pure crinkle chiffon and luxury cambric lawn tied knot by knot using time-honored resist dyeing.
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-10">
              <div className="p-5 bg-[#651F32] text-white rounded-xl text-left shadow-lg border border-[#C9A96E]/30">
                <span className="text-[10px] uppercase tracking-widest text-[#DEC596] font-semibold block mb-1">
                  Boutique Guarantee
                </span>
                <p className="font-serif text-lg leading-snug mb-1">Fast & Vibrant Dyes</p>
                <p className="text-xs text-white/85 leading-relaxed">
                  Deep, authentic pigments that preserve brilliance across celebrations and generations.
                </p>
              </div>

              <div
                className={`relative rounded-xl overflow-hidden border shadow-md group aspect-3/4 ${
                  isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
                }`}
              >
                <img
                  src="/images/real_maroon_gold_chunri_1790696956750.jpg"
                  alt="Plum Wine Maroon Festive Ensemble"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/images/cat_chunri_dupattas_1790695254180.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-left">
                  <span className="text-[10px] uppercase tracking-wider text-[#DEC596] font-semibold block">Signature Tone</span>
                  <p className="font-serif text-sm sm:text-base leading-snug">Plum Wine & Champagne Gota</p>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Prose & WhatsApp Direct Action */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="w-12 h-1 bg-[#C9A96E]" />
            
            <h3
              className={`font-serif text-2xl sm:text-3xl leading-snug font-medium ${
                isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
              }`}
            >
              Curated by Yasir Farooq for Everyday Grace & Special Occasions
            </h3>

            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
              From festive Mehndi yellows and celebratory crimson reds to modern slate and lilac tones, each design honors the rich cultural splendor of Bahawalpur.
            </p>

            <ul className={`space-y-3 pt-2 text-xs sm:text-sm ${isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'}`}>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#651F32] dark:text-[#DEC596] shrink-0 mt-0.5" />
                <span>Genuine handcrafted chunri sourced directly from Bahawalpur artisans</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#651F32] dark:text-[#DEC596] shrink-0 mt-0.5" />
                <span>Available in unstitched 3-piece fabrics and bespoke tailored cuts</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#651F32] dark:text-[#DEC596] shrink-0 mt-0.5" />
                <span>Direct WhatsApp consultation with real garment photos & video previews</span>
              </li>
            </ul>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppUrl('Assalam o Alaikum, I would like to inquire about your authentic Bahawalpuri Chunri collection.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#651F32] hover:bg-[#4E1525] text-white px-7 py-3.5 rounded-md text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consult on WhatsApp</span>
              </a>

              <a
                href="#products"
                className={`inline-flex items-center justify-center gap-2 border px-6 py-3.5 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#261D1F] hover:bg-[#35282B] text-[#F7EFE8] border-[#3D2E32]'
                    : 'bg-white hover:bg-[#F3EDE4] text-[#2B211E] border-[#D8C7B5]'
                }`}
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4 text-[#C9A96E]" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
