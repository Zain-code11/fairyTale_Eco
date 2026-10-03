import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowRight, Sparkles, ChevronLeft, ChevronRight, ShoppingBag, Check } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { useTheme } from '../context/ThemeContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ProductCategory } from '../types';

interface HeroSlide {
  id: string;
  tag: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  category: ProductCategory;
  badge: string;
  highlights: string[];
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    tag: 'Signature Line',
    eyebrow: 'BAHAWALPUR ROYAL ATELIER · HAND-TIED BANDHANI',
    title: 'Elegance Woven in Every Detail',
    subtitle: 'Authentic 3-Piece Festive Chunri',
    description: 'Masterpiece 3-piece ensemble featuring vibrant crimson red body with sunshine yellow and dark forest green border contrasts, dense handcrafted bandhani dots, and matching pure crinkle chiffon dupatta.',
    image: '/images/real_festive_trio_chunri_1790696938379.jpg',
    category: 'Suits',
    badge: '100% Fast Color Guarantee',
    highlights: ['Hand-Tied Bandhani', 'Crinkle Chiffon', 'Traditional Gota'],
  },
  {
    id: 'hero-2',
    tag: 'Heirloom Craft',
    eyebrow: 'PURE FABRIC · HERITAGE RESIST DYES',
    title: 'Timeless Motifs, Ethereal Grace',
    subtitle: 'Mustard & Marigold Chunri Dupattas',
    description: 'Lightweight crinkle chiffon dupattas treated with heritage herbal resist dyeing. Gracefully finished with golden gotta kinari borders for festive celebrations and wedding wear.',
    image: '/images/hero_chunri_collection_1790695232484.jpg',
    category: 'Dupattas',
    badge: 'Dense Artisan Knotwork',
    highlights: ['Airy Drape', 'Fast Color Dye', 'Gold Kinari Trim'],
  },
  {
    id: 'hero-3',
    tag: 'Limited Edition',
    eyebrow: 'PRINCE ATELIER · STITCHED PRET',
    title: 'Heritage Crafted for Celebrations',
    subtitle: 'Royal Maroon & Gold Luxury Ensemble',
    description: 'A fusion of Bahawalpur royal court heritage and modern tailored silhouettes, featuring intricate block-printed borders and handcrafted metallic embellishments.',
    image: '/images/real_maroon_gold_chunri_1790696956750.jpg',
    category: 'Ready to Wear',
    badge: 'Limited Festive Batch',
    highlights: ['Tailored Cut', 'Silk Accents', 'Ready to Ship'],
  },
];

export const Hero: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { setActiveCategory } = useProducts();
  const { addToCart } = useCart();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [addedDirectly, setAddedDirectly] = useState(false);

  const SLIDE_DURATION = 6000;
  const PROGRESS_INTERVAL = 50;

  // Auto-advancing slide with animated progress
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (PROGRESS_INTERVAL / SLIDE_DURATION) * 100;
        if (next >= 100) {
          setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
          return 0;
        }
        return next;
      });
    }, PROGRESS_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, activeSlide]);

  const current = HERO_SLIDES[activeSlide];

  const handleSelectSlide = (index: number) => {
    setActiveSlide(index);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  };

  const handleExploreCategory = () => {
    setActiveCategory(current.category);
    const catalog = document.querySelector('#products') || document.querySelector('#collections');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickAdd = () => {
    addToCart(
      {
        id: current.id,
        name: current.title + ' (' + current.subtitle + ')',
        category: current.category === 'All' ? 'Suits' : current.category,
        price: 8500,
        description: current.description,
        image: current.image,
        colors: ['Bahawalpur Heritage Palette'],
        sizes: ['Standard Form'],
        available: true,
        featured: true,
        newArrival: true,
        fabric: current.highlights[1] || 'Pure Chiffon',
        createdAt: new Date().toISOString(),
      },
      1
    );
    setAddedDirectly(true);
    setTimeout(() => setAddedDirectly(false), 2200);
  };

  return (
    <section
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full max-w-full overflow-hidden pt-4 pb-12 sm:pb-16 lg:py-20 transition-colors duration-500 ${
        isDark ? 'bg-[#1D1718]' : 'bg-[#FAF7F2]'
      }`}
    >
      {/* Ambient background glows - safely constrained within section */}
      <div
        className={`absolute top-0 right-0 w-72 sm:w-96 lg:w-[500px] h-72 sm:h-96 lg:h-[500px] rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${
          isDark ? 'bg-[#651F32]/15' : 'bg-[#EAE2D6]/70'
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-64 sm:w-80 lg:w-[450px] h-64 sm:h-80 lg:h-[450px] rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${
          isDark ? 'bg-[#C9A96E]/10' : 'bg-[#C9A96E]/15'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Animated Dynamic Editorial Content */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left order-2 lg:order-1">
            
            {/* Slide Index & Eyebrow with Animated Gold Progress Line */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="font-serif text-xs sm:text-sm italic font-semibold text-[#C9A96E] tracking-wider tabular-nums">
                0{activeSlide + 1} / 0{HERO_SLIDES.length}
              </span>
              
              {/* Thin Animated Gold Bar */}
              <div className="relative w-12 sm:w-16 h-[2px] bg-[#C9A96E]/25 rounded-full overflow-hidden shrink-0">
                <div
                  className="absolute top-0 left-0 h-full bg-[#C9A96E] transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-semibold text-[#651F32] dark:text-[#DEC596] truncate max-w-[280px] sm:max-w-none">
                <Sparkles className="w-3 h-3 text-[#C9A96E] shrink-0" />
                <span className="truncate">{current.eyebrow}</span>
              </div>
            </div>

            {/* Dynamic Headline with Smooth Fade Animation */}
            <div key={`title-${current.id}`} className="space-y-1.5 sm:space-y-2 animate-fade-in">
              <h1
                className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.14] break-words ${
                  isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
                }`}
              >
                {current.title}
              </h1>
              <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#651F32] dark:text-[#DEC596] italic font-normal tracking-tight">
                {current.subtitle}
              </p>
            </div>

            {/* Description Text */}
            <p
              key={`desc-${current.id}`}
              className={`text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-normal animate-fade-in ${
                isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'
              }`}
            >
              {current.description}
            </p>

            {/* Feature Highlights Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
              {current.highlights.map((h) => (
                <span
                  key={h}
                  className={`text-[10px] sm:text-[11px] font-medium px-2.5 sm:px-3 py-1 rounded-full border transition-colors ${
                    isDark
                      ? 'bg-[#261D1F] border-[#3D2E32] text-[#F7EFE8]'
                      : 'bg-white border-[#EAE2D6] text-[#2B211E]'
                  }`}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Action Buttons - Fully Responsive Mobile Stack */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              {/* Explore Collection */}
              <button
                type="button"
                onClick={handleExploreCategory}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#651F32] hover:bg-[#4E1525] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-xl active:scale-98 cursor-pointer group"
              >
                <span>Explore {current.category}</span>
                <ArrowRight className="w-4 h-4 text-[#DEC596] group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Quick Add to Cart (Price Removed as Requested) */}
              <button
                type="button"
                onClick={handleQuickAdd}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 border px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 shadow-2xs active:scale-98 cursor-pointer ${
                  addedDirectly
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isDark
                      ? 'bg-[#261D1F] hover:bg-[#35282B] text-[#F7EFE8] border-[#3D2E32]'
                      : 'bg-white hover:bg-[#FAF7F2] text-[#2B211E] border-[#D8C7B5]'
                }`}
              >
                {addedDirectly ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#651F32] dark:text-[#DEC596]" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Direct WhatsApp Order */}
              <a
                href={getWhatsAppUrl(`Assalam o Alaikum Yasir Bhai, I saw the featured ${current.title} (${current.subtitle}) on Fairytale Chunri Closet and would like to order.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shadow-xs cursor-pointer text-xs font-semibold"
                title="Chat on WhatsApp about this piece"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span className="sm:hidden">Order on WhatsApp</span>
              </a>
            </div>

            {/* Interactive Carousel Dots & Thumbnail Selector */}
            <div className="pt-3 sm:pt-4 border-t border-[#C9A96E]/20 flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => handleSelectSlide(idx)}
                    className={`group/tab relative px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer flex items-center gap-1 sm:gap-1.5 border shrink-0 ${
                      activeSlide === idx
                        ? 'bg-[#651F32] text-white border-[#651F32] shadow-xs'
                        : isDark
                          ? 'bg-[#261D1F] text-[#D8C7B5] border-[#3D2E32] hover:border-[#DEC596]'
                          : 'bg-white text-[#6B5B53] border-[#EAE2D6] hover:border-[#651F32]'
                    }`}
                  >
                    <span className="font-serif italic font-semibold text-[10px] sm:text-[11px]">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] sm:text-[11px] truncate max-w-[80px] sm:max-w-[100px]">
                      {slide.category}
                    </span>
                  </button>
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className={`p-1.5 sm:p-2 rounded-full border transition-colors cursor-pointer ${
                    isDark ? 'border-[#3D2E32] hover:bg-[#261D1F] text-white' : 'border-[#EAE2D6] hover:bg-white text-[#2B211E]'
                  }`}
                  aria-label="Previous featured suit"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={`p-1.5 sm:p-2 rounded-full border transition-colors cursor-pointer ${
                    isDark ? 'border-[#3D2E32] hover:bg-[#261D1F] text-white' : 'border-[#EAE2D6] hover:bg-white text-[#2B211E]'
                  }`}
                  aria-label="Next featured suit"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Modern Aesthetic Visual Frame (Responsive, Zero Overflow) */}
          <div className="lg:col-span-6 relative order-1 lg:order-2 w-full max-w-full">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              
              {/* Outer Layer: Aesthetic Champagne Gold Offset Frame (Safely bounds on mobile) */}
              <div className="hidden sm:block absolute -inset-2.5 lg:-inset-4 rounded-3xl border border-[#C9A96E]/30 pointer-events-none transition-transform duration-700 -rotate-1" />
              <div className="hidden sm:block absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#651F32]/10 via-[#C9A96E]/15 to-transparent rotate-1 pointer-events-none" />

              {/* Main Visual Presentation Container */}
              <div
                className={`relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border transition-all duration-500 w-full ${
                  isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
                }`}
              >
                <div className="relative h-[320px] xs:h-[380px] sm:h-[460px] lg:h-[530px] overflow-hidden bg-[#1D1718] w-full">
                  
                  {/* Cross-fading background images with subtle Ken Burns scale */}
                  {HERO_SLIDES.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className={`w-full h-full object-cover object-top transition-transform duration-[6000ms] ease-out ${
                          activeSlide === idx && !isPaused ? 'scale-106' : 'scale-100'
                        }`}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        onError={(e) => {
                          e.currentTarget.src = '/images/real_festive_trio_chunri_1790696938379.jpg';
                        }}
                      />
                    </div>
                  ))}

                  {/* Gradient Scrim for Contrast & Elegance */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Top-Right: Floating Artisan Provenance Badge */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-black/65 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#C9A96E]/50 flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C9A96E] animate-pulse" />
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#DEC596] font-semibold">
                      Authentic Masterpiece
                    </span>
                  </div>

                  {/* Top-Left: Category & Artisan Craft Badge (NO PRICE - PRICE REMOVED) */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-white/90 dark:bg-[#1D1718]/90 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[#C9A96E]/40 text-[10px] sm:text-xs font-semibold text-[#651F32] dark:text-[#DEC596] shadow-sm flex items-center gap-1.5">
                    <span>{current.category}</span>
                    <span className="text-stone-300 dark:text-stone-600">·</span>
                    <span className="text-[10px] sm:text-xs opacity-85 font-medium">{current.tag}</span>
                  </div>

                  {/* Bottom Vignette Overlay with Product Details */}
                  <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-6 lg:p-7 text-white text-left">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] uppercase tracking-widest text-[#DEC596] font-medium mb-1 flex-wrap">
                      <span>{current.tag}</span>
                      <span>·</span>
                      <span>{current.badge}</span>
                    </div>
                    <p className="font-serif text-lg sm:text-xl lg:text-2xl leading-snug drop-shadow-sm font-medium">
                      {current.subtitle}
                    </p>
                    <p className="text-[11px] sm:text-xs text-white/80 mt-1 max-w-md line-clamp-2">
                      {current.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Aesthetic Artisan Badge - Responsively anchored */}
              <div
                className={`hidden md:flex absolute -bottom-4 left-4 lg:-left-4 z-30 p-3 rounded-xl shadow-2xl border items-center gap-2.5 backdrop-blur-md animate-float ${
                  isDark
                    ? 'bg-[#261D1F]/95 border-[#3D2E32] text-white'
                    : 'bg-white/95 border-[#EAE2D6] text-[#2B211E]'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#651F32] text-[#DEC596] flex items-center justify-center font-serif font-bold text-xs shrink-0 border border-[#DEC596]/40">
                  FC
                </div>
                <div className="text-left pr-1">
                  <p className="text-xs font-semibold text-[#651F32] dark:text-[#DEC596]">
                    Bahawalpur Direct Atelier
                  </p>
                  <p className="text-[10px] opacity-75">
                    Fast color guarantee & pure fabric
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
