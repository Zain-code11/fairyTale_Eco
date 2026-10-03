import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/initialProducts';
import { useProducts } from '../context/ProductContext';
import { ProductCategory } from '../types';
import { useTheme } from '../context/ThemeContext';

export const FeaturedCategories: React.FC = () => {
  const { setActiveCategory } = useProducts();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSelectCategory = (catId: ProductCategory) => {
    setActiveCategory(catId);
    const catalogElement = document.querySelector('#products') || document.querySelector('#catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="collections"
      className={`py-14 sm:py-24 border-t transition-colors duration-300 w-full max-w-full overflow-hidden ${
        isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#651F32] dark:text-[#DEC596] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Curated For You</span>
          </div>
          <h2
            className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight ${
              isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
            }`}
          >
            Featured Collections
          </h2>
          <div className="w-12 h-0.5 bg-[#C9A96E] mx-auto mt-4 mb-3" />
          <p className={`text-sm sm:text-base ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
            Explore our curated selections of handcrafted chunris, festive stitched ensembles, and pure unstitched fabrics.
          </p>
        </div>

        {/* Clean, Balanced 3-Column Grid - Equal Proportions & High Fashion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => handleSelectCategory(category.id)}
              className={`group rounded-xl border overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5 ${
                isDark
                  ? 'bg-[#261D1F] border-[#3D2E32] hover:border-[#DEC596]'
                  : 'bg-white border-[#EAE2D6] hover:border-[#DEC596]'
              }`}
            >
              {/* Balanced Portrait Aspect Ratio for All Cards */}
              <div className="relative aspect-4/3 sm:aspect-16/11 overflow-hidden bg-[#1D1718]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-700 ease-out"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/images/real_festive_trio_chunri_1790696938379.jpg';
                  }}
                />
                
                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Title badge overlay */}
                <div className="absolute bottom-3 left-4 right-4 text-left">
                  <span className="text-[10px] uppercase tracking-widest text-[#DEC596] font-semibold block mb-0.5">
                    Collection
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-medium drop-shadow-sm">
                    {category.name}
                  </h3>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3 text-left">
                <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
                  {category.description}
                </p>

                <div
                  className={`pt-3 border-t flex items-center justify-between transition-colors ${
                    isDark ? 'border-[#3D2E32]' : 'border-[#F3EDE4]'
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#651F32] dark:text-[#DEC596] inline-flex items-center gap-1.5 group-hover:underline">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[11px] opacity-60 font-medium">
                    Bahawalpur
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
