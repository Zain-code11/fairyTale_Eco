import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight, MapPin, User, FileText, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { generateCartWhatsAppUrl, BUSINESS_CONFIG } from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const whatsappOrderUrl = generateCartWhatsAppUrl(cartItems, {
    name: customerName,
    phone: customerPhone,
    city: customerCity,
    instructions: customerNotes,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className={`w-full max-w-lg h-full flex flex-col shadow-2xl border-l transition-transform duration-300 animate-in slide-in-from-right ${
          isDark ? 'bg-[#1D1718] border-[#3D2E32] text-[#F7EFE8]' : 'bg-[#FAF7F2] border-[#EAE2D6] text-[#2B211E]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Drawer Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-[#651F32] text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 id="cart-title" className="font-serif text-lg font-medium leading-none">
                Your Shopping Cart
              </h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
                {totalItems} item{totalItems !== 1 ? 's' : ''} selected for order
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                title="Clear all suits"
                className={`text-xs px-2.5 py-1 rounded transition-colors ${
                  isDark ? 'text-red-400 hover:bg-red-950/40' : 'text-red-600 hover:bg-red-50'
                }`}
              >
                Clear Cart
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className={`p-2 rounded-md cursor-pointer transition-colors ${
                isDark ? 'text-white hover:bg-[#35282B]' : 'text-[#2B211E] hover:bg-[#EAE2D6]'
              }`}
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center border ${
                  isDark ? 'bg-[#261D1F] border-[#3D2E32] text-[#DEC596]' : 'bg-white border-[#EAE2D6] text-[#651F32]'
                }`}
              >
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium">Your Cart is Empty</h3>
                <p className={`text-xs sm:text-sm mt-1 max-w-xs ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
                  You haven't selected any suits yet. Browse our handcrafted Bahawalpuri collections to add pieces.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  const catalog = document.querySelector('#products') || document.querySelector('#collections');
                  catalog?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-[#651F32] hover:bg-[#4E1525] text-white text-xs font-semibold px-5 py-2.5 rounded-md shadow-xs transition-colors cursor-pointer"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Product Cards */}
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border flex gap-3 sm:gap-4 transition-colors ${
                        isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-24 sm:w-22 sm:h-28 rounded-lg overflow-hidden shrink-0 bg-[#F3EDE4] dark:bg-[#1D1718] border border-[#C9A96E]/20">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.currentTarget.src = '/images/real_festive_trio_chunri_1790696938379.jpg';
                          }}
                        />
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 flex flex-col justify-between text-left">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#651F32] dark:text-[#DEC596]">
                                {item.product.category}
                              </span>
                              <h4 className="font-serif text-sm font-medium line-clamp-1">
                                {item.product.name}
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className={`p-1 rounded text-stone-400 hover:text-red-600 transition-colors ${
                                isDark ? 'hover:bg-[#1D1718]' : 'hover:bg-[#FAF7F2]'
                              }`}
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Selected attributes */}
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {item.selectedSize && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                  isDark ? 'bg-[#1D1718] border-[#3D2E32] text-stone-300' : 'bg-[#FAF7F2] border-[#EAE2D6] text-stone-700'
                                }`}
                              >
                                {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                  isDark ? 'bg-[#1D1718] border-[#3D2E32] text-stone-300' : 'bg-[#FAF7F2] border-[#EAE2D6] text-stone-700'
                                }`}
                              >
                                {item.selectedColor}
                              </span>
                            )}
                            {item.product.fabric && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                  isDark ? 'bg-[#1D1718] border-[#3D2E32] text-stone-300' : 'bg-[#FAF7F2] border-[#EAE2D6] text-stone-700'
                                }`}
                              >
                                {item.product.fabric}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price and Stepper */}
                        <div className="pt-2 flex items-center justify-between border-t border-[#C9A96E]/15 mt-2">
                          <div>
                            <span className="text-xs font-semibold text-[#651F32] dark:text-[#DEC596] tabular-nums">
                              PKR {lineTotal.toLocaleString()}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[10px] opacity-60 block">
                                (PKR {item.product.price.toLocaleString()} each)
                              </span>
                            )}
                          </div>

                          <div className="flex items-center border rounded-md overflow-hidden bg-transparent">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className={`p-1 px-2 text-xs transition-colors cursor-pointer ${
                                isDark ? 'hover:bg-[#1D1718] text-white' : 'hover:bg-[#FAF7F2] text-[#2B211E]'
                              }`}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className={`p-1 px-2 text-xs transition-colors cursor-pointer ${
                                isDark ? 'hover:bg-[#1D1718] text-white' : 'hover:bg-[#FAF7F2] text-[#2B211E]'
                              }`}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional: Add Delivery Details Accordion / Toggle */}
              <div
                className={`p-3.5 rounded-xl border space-y-2.5 text-left transition-colors ${
                  isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#651F32] dark:text-[#DEC596]">
                    Order Details (Optional)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(!showOrderForm)}
                    className="text-xs text-[#C9A96E] hover:underline cursor-pointer"
                  >
                    {showOrderForm ? 'Hide' : 'Add Name & Address'}
                  </button>
                </div>

                {showOrderForm ? (
                  <div className="space-y-2.5 pt-1 animate-in fade-in">
                    <div>
                      <label className="text-[11px] font-medium block mb-1 opacity-80">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ayesha Khan"
                        className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-hidden ${
                          isDark
                            ? 'bg-[#1D1718] border-[#3D2E32] text-white focus:border-[#C9A96E]'
                            : 'bg-[#FAF7F2] border-[#D8C7B5] text-[#2B211E] focus:border-[#651F32]'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-medium block mb-1 opacity-80">
                          City / Delivery Area
                        </label>
                        <input
                          type="text"
                          value={customerCity}
                          onChange={(e) => setCustomerCity(e.target.value)}
                          placeholder="e.g. Bahawalpur / Lahore"
                          className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-hidden ${
                            isDark
                              ? 'bg-[#1D1718] border-[#3D2E32] text-white focus:border-[#C9A96E]'
                              : 'bg-[#FAF7F2] border-[#D8C7B5] text-[#2B211E] focus:border-[#651F32]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium block mb-1 opacity-80">
                          Contact Phone
                        </label>
                        <input
                          type="text"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. 0300 1234567"
                          className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-hidden ${
                            isDark
                              ? 'bg-[#1D1718] border-[#3D2E32] text-white focus:border-[#C9A96E]'
                              : 'bg-[#FAF7F2] border-[#D8C7B5] text-[#2B211E] focus:border-[#651F32]'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium block mb-1 opacity-80">
                        Custom Stitching / Notes
                      </label>
                      <input
                        type="text"
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="e.g. Unstitched fabric or stitched Medium"
                        className={`w-full px-3 py-1.5 text-xs rounded border focus:outline-hidden ${
                          isDark
                            ? 'bg-[#1D1718] border-[#3D2E32] text-white focus:border-[#C9A96E]'
                            : 'bg-[#FAF7F2] border-[#D8C7B5] text-[#2B211E] focus:border-[#651F32]'
                        }`}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] opacity-70">
                    Add your name and delivery city to have them pre-filled in your WhatsApp message.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Cart Drawer Sticky Bottom Summary & WhatsApp Checkout */}
        {cartItems.length > 0 && (
          <div
            className={`p-4 sm:p-5 border-t space-y-3 shrink-0 ${
              isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
            }`}
          >
            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between opacity-80">
                <span>Selected Suits ({totalItems}):</span>
                <span className="tabular-nums">PKR {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Delivery:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Calculated on WhatsApp
                </span>
              </div>
              <div className="pt-2 border-t flex justify-between text-base font-semibold">
                <span>Estimated Total:</span>
                <span className="text-[#651F32] dark:text-[#DEC596] tabular-nums font-bold">
                  PKR {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Direct Multi-item WhatsApp Order Button */}
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3.5 px-4 rounded-lg font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white text-transparent" />
              <span>Order All Suits on WhatsApp ({totalItems})</span>
            </a>

            <div className="flex items-center justify-center gap-1.5 text-[11px] opacity-70">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Direct chat with Yasir Farooq ({BUSINESS_CONFIG.whatsappDisplay})</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
