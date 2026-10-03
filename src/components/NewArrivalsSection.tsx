import React from 'react';
import { ArrowRight, Sparkles, MessageCircle, Eye, ShoppingBag } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { getProductWhatsAppUrl } from '../utils/whatsapp';
import { useTheme } from '../context/ThemeContext';

export const NewArrivalsSection: React.FC = () => {
  const { products, setSelectedProduct, setActiveCategory } = useProducts();
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);

  if (newArrivals.length === 0) return null;

  const handleViewAllNew = () => {
    setActiveCategory('New Arrivals');
    const catalogEl = document.querySelector('#products') || document.querySelector('#catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="new-arrivals"
      className={`py-16 sm:py-24 border-t transition-colors duration-300 ${
        isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4 text-left">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold mb-1.5 text-[#651F32] dark:text-[#DEC596]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Fresh From The Bahawalpur Workshop</span>
            </div>
            <h2
              className={`font-serif text-3xl sm:text-4xl font-medium tracking-tight ${
                isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
              }`}
            >
              New Seasonal Arrivals
            </h2>
            <p className={`text-xs sm:text-sm mt-1.5 ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
              The latest handcrafted Bahawalpuri tie-dye chunris and festive 3-piece ensembles.
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewAllNew}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#651F32] dark:text-[#DEC596] hover:underline group cursor-pointer"
          >
            <span>View All New Pieces</span>
            <ArrowRight className="w-4 h-4 text-[#C9A96E] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4-Item Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <div
              key={product.id}
              className={`group rounded-lg border overflow-hidden flex flex-col hover:-translate-y-1.5 transition-all duration-300 shadow-2xs hover:shadow-xl text-left ${
                isDark
                  ? 'bg-[#261D1F] border-[#3D2E32] hover:border-[#DEC596]'
                  : 'bg-white border-[#EAE2D6] hover:border-[#DEC596]'
              }`}
            >
              {/* Image Area */}
              <div
                onClick={() => setSelectedProduct(product)}
                className="relative aspect-4/5 overflow-hidden bg-[#F3EDE4] dark:bg-[#1D1718] cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('real_festive_trio_chunri')) {
                      target.src = '/images/real_festive_trio_chunri_1790696938379.jpg';
                    }
                  }}
                />

                <div
                  className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[11px] font-medium border flex items-center gap-1.5 shadow-2xs backdrop-blur-md ${
                    isDark ? 'bg-[#1D1718]/90 border-[#3D2E32]' : 'bg-[#FAF7F2]/95 border-[#EAE2D6]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-700 dark:text-emerald-400">New Arrival</span>
                </div>

                {/* Quick view button */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none sm:pointer-events-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="hidden sm:inline-flex items-center gap-1.5 bg-white text-[#2B211E] text-xs font-semibold px-4 py-2 rounded-md shadow-lg hover:bg-[#FAF7F2] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#651F32]" />
                    <span>Quick View</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div
                    className={`flex items-center gap-1.5 text-xs mb-1 font-medium ${
                      isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'
                    }`}
                  >
                    <span>{product.category}</span>
                    {product.fabric && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{product.fabric}</span>
                      </>
                    )}
                  </div>

                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className={`font-serif text-sm sm:text-base font-medium line-clamp-1 hover:text-[#651F32] dark:hover:text-[#DEC596] cursor-pointer transition-colors ${
                      isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
                    }`}
                  >
                    {product.name}
                  </h3>

                  <div className="mt-1">
                    <span className="text-sm sm:text-base font-semibold text-[#651F32] dark:text-[#DEC596] tabular-nums">
                      PKR {product.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div
                  className={`pt-2.5 border-t ${
                    isDark ? 'border-[#3D2E32]' : 'border-[#F3EDE4]'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => addToCart(product, 1)}
                      className={`inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs font-semibold border transition-all cursor-pointer ${
                        isDark
                          ? 'bg-[#1D1718] hover:bg-[#35282B] text-[#DEC596] border-[#3D2E32] hover:border-[#DEC596]'
                          : 'bg-[#FAF7F2] hover:bg-[#F3EDE4] text-[#651F32] border-[#EAE2D6] hover:border-[#651F32]'
                      }`}
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add</span>
                    </button>

                    <a
                      href={getProductWhatsAppUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 bg-[#651F32] hover:bg-[#4E1525] text-white py-1.5 px-2 rounded text-xs font-semibold transition-all shadow-2xs group/btn cursor-pointer"
                    >
                      <MessageCircle className="w-3 h-3 fill-white text-transparent" />
                      <span>Order</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
