import React from 'react';
import { MessageCircle, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { getProductWhatsAppUrl } from '../utils/whatsapp';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct } = useProducts();
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <article
      className={`group rounded-lg border overflow-hidden flex flex-col hover:-translate-y-1.5 transition-all duration-300 shadow-2xs hover:shadow-xl ${
        isDark
          ? 'bg-[#261D1F] border-[#3D2E32] hover:border-[#DEC596]'
          : 'bg-white border-[#EAE2D6] hover:border-[#DEC596]'
      }`}
    >
      {/* Product Image Area */}
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

        {/* Status indicator */}
        <div
          className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[11px] font-medium border flex items-center gap-1.5 shadow-2xs backdrop-blur-md ${
            isDark ? 'bg-[#1D1718]/90 border-[#3D2E32]' : 'bg-[#FAF7F2]/95 border-[#EAE2D6]'
          }`}
        >
          {product.available ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 dark:text-emerald-400">Available</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
              <span className="text-stone-500 dark:text-stone-400">Out of Stock</span>
            </>
          )}
        </div>

        {product.newArrival && (
          <div className="absolute top-3 right-3 bg-[#651F32] text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold shadow-2xs border border-[#C9A96E]/40">
            New
          </div>
        )}

        {/* Hover overlay with quick view */}
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

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 text-left">
        <div>
          {/* Metadata row: Category · Fabric */}
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

          {/* Product Name */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className={`font-serif text-base sm:text-lg font-medium leading-snug line-clamp-1 hover:text-[#651F32] dark:hover:text-[#DEC596] transition-colors cursor-pointer ${
              isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
            }`}
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-semibold text-[#651F32] dark:text-[#DEC596] tabular-nums tracking-tight">
              PKR {product.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div
          className={`pt-3 border-t space-y-2 ${
            isDark ? 'border-[#3D2E32]' : 'border-[#F3EDE4]'
          }`}
        >
          {/* Dual Shopping Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              disabled={!product.available}
              className={`inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
                !product.available
                  ? 'opacity-50 cursor-not-allowed bg-stone-100 dark:bg-stone-800 text-stone-400 border-transparent'
                  : isDark
                    ? 'bg-[#1D1718] hover:bg-[#35282B] text-[#DEC596] border-[#3D2E32] hover:border-[#DEC596]'
                    : 'bg-[#FAF7F2] hover:bg-[#F3EDE4] text-[#651F32] border-[#EAE2D6] hover:border-[#651F32]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <a
              href={getProductWhatsAppUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-1.5 bg-[#651F32] hover:bg-[#4E1525] text-white py-2 px-2 rounded-md text-xs font-semibold transition-all shadow-2xs group/wa cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-transparent group-hover/wa:scale-110 transition-transform" />
              <span>Order on WA</span>
            </a>
          </div>

          {/* View Details Link */}
          <button
            type="button"
            onClick={() => setSelectedProduct(product)}
            className={`w-full text-center py-0.5 text-xs font-medium transition-colors cursor-pointer ${
              isDark ? 'text-[#D8C7B5] hover:text-white' : 'text-[#6B5B53] hover:text-[#2B211E]'
            }`}
          >
            View Details & Sizing →
          </button>
        </div>

      </div>

    </article>
  );
};
