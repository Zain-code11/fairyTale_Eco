import React from 'react';
import { ShoppingBag, ArrowRight, X, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export const CartToast: React.FC = () => {
  const { lastAdded, dismissToast, setIsCartOpen, totalItems } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!lastAdded) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 right-5 sm:right-8 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm w-full"
    >
      <div
        className={`p-3.5 rounded-xl border shadow-2xl flex items-center gap-3 backdrop-blur-md transition-colors ${
          isDark
            ? 'bg-[#261D1F]/95 border-[#3D2E32] text-[#F7EFE8]'
            : 'bg-white/95 border-[#EAE2D6] text-[#2B211E]'
        }`}
      >
        {/* Thumbnail */}
        <div className="w-12 h-14 rounded-md overflow-hidden shrink-0 bg-[#F3EDE4] border border-[#C9A96E]/20">
          <img
            src={lastAdded.product.image}
            alt={lastAdded.product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            <span>Added to Cart!</span>
          </div>
          <p className="font-serif text-xs font-medium truncate mt-0.5">
            {lastAdded.product.name}
          </p>
          <button
            type="button"
            onClick={() => {
              dismissToast();
              setIsCartOpen(true);
            }}
            className="text-[11px] font-semibold text-[#651F32] dark:text-[#DEC596] hover:underline flex items-center gap-1 mt-1 cursor-pointer"
          >
            <span>View Cart ({totalItems})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={dismissToast}
          className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
