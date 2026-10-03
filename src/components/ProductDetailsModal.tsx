import React, { useState, useEffect } from 'react';
import { X, MessageCircle, MapPin, ShieldCheck, Share2, Check, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { getProductWhatsAppUrl, BUSINESS_CONFIG } from '../utils/whatsapp';
import { useTheme } from '../context/ThemeContext';

export const ProductDetailsModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useProducts();
  const { addToCart, setIsCartOpen, totalItems } = useCart();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
      }
    };
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setActiveImageIndex(0);
      setCopied(false);
      setQuantity(1);
      setAddedNotice(false);
      setSelectedSize(selectedProduct.sizes && selectedProduct.sizes.length > 0 ? selectedProduct.sizes[0] : '');
      setSelectedColor(selectedProduct.colors && selectedProduct.colors.length > 0 ? selectedProduct.colors[0] : '');
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProduct, setSelectedProduct]);

  if (!selectedProduct) return null;

  const images = selectedProduct.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : [selectedProduct.image];

  const currentImage = images[activeImageIndex] || selectedProduct.image;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${selectedProduct.name} - Fairytale Chunri Closet`,
          text: `Check out ${selectedProduct.name} (PKR ${selectedProduct.price.toLocaleString()}) at Fairytale Chunri Closet in Bahawalpur!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedSize, selectedColor);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const whatsappDirectUrl = getProductWhatsAppUrl(selectedProduct, {
    size: selectedSize,
    color: selectedColor,
    quantity,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setSelectedProduct(null)}
    >
      <div
        className={`relative rounded-xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border my-auto transition-all ${
          isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full shadow-md cursor-pointer transition-colors ${
            isDark ? 'bg-[#1D1718] text-white hover:bg-[#35282B]' : 'bg-white text-[#2B211E] hover:bg-[#F3EDE4]'
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Mobile & Desktop Image: High-res presentation */}
          <div className="relative bg-[#1D1718] flex flex-col justify-between">
            <div className="relative aspect-4/5 md:aspect-auto md:h-full overflow-hidden flex items-center justify-center">
              <img
                src={currentImage}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('real_festive_trio_chunri')) {
                    target.src = '/images/real_festive_trio_chunri_1790696938379.jpg';
                  }
                }}
              />
              
              {/* Status chip */}
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded text-xs font-semibold border border-white/15 flex items-center gap-1.5 shadow-md text-white">
                {selectedProduct.available ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-300">In Stock & Ready</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-stone-400" />
                    <span className="text-stone-300">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Additional image thumbnails if multiple */}
            {images.length > 1 && (
              <div className="p-3 bg-black/40 border-t border-white/10 flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-14 rounded overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#C9A96E]' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Purchasing & Product Information */}
          <div className="p-6 sm:p-7 flex flex-col justify-between space-y-5 text-left">
            
            <div className="space-y-3.5">
              
              {/* Category & Fabric metadata */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#651F32] dark:text-[#DEC596]">
                <span>{selectedProduct.category}</span>
                {selectedProduct.fabric && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{selectedProduct.fabric}</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h2
                id="modal-product-title"
                className={`font-serif text-2xl font-medium leading-tight ${
                  isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
                }`}
              >
                {selectedProduct.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-[#651F32] dark:text-[#DEC596] tabular-nums">
                  PKR {selectedProduct.price.toLocaleString()}
                </span>
                <span className="text-xs opacity-70">
                  (Bahawalpur Direct)
                </span>
              </div>

              {/* Description */}
              <div className={`pt-2 border-t ${isDark ? 'border-[#3D2E32]' : 'border-[#EAE2D6]'}`}>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#D8C7B5]' : 'text-[#2B211E]'}`}>
                  {selectedProduct.description}
                </p>
              </div>

              {/* Select Sizes */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className={`pt-2 border-t ${isDark ? 'border-[#3D2E32]' : 'border-[#EAE2D6]'}`}>
                  <label className="text-[11px] uppercase tracking-wider opacity-75 font-semibold block mb-1.5">
                    Select Sizing / Fabric Form:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`border px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all ${
                          selectedSize === size
                            ? 'bg-[#651F32] text-white border-[#651F32] shadow-xs'
                            : isDark
                              ? 'bg-[#1D1718] border-[#3D2E32] text-stone-300 hover:border-[#DEC596]'
                              : 'bg-white border-[#D8C7B5] text-[#2B211E] hover:border-[#651F32]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Select Colors */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div className={`pt-2 border-t ${isDark ? 'border-[#3D2E32]' : 'border-[#EAE2D6]'}`}>
                  <label className="text-[11px] uppercase tracking-wider opacity-75 font-semibold block mb-1.5">
                    Select Color:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`border px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-all ${
                          selectedColor === color
                            ? 'bg-[#651F32] text-white border-[#651F32] shadow-xs'
                            : isDark
                              ? 'bg-[#1D1718] border-[#3D2E32] text-stone-300 hover:border-[#DEC596]'
                              : 'bg-white border-[#D8C7B5] text-[#2B211E] hover:border-[#651F32]'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-[#3D2E32]' : 'border-[#EAE2D6]'}`}>
                <span className="text-xs font-semibold opacity-80">
                  Quantity:
                </span>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className={`p-1.5 px-3 text-xs transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-[#1D1718] text-white' : 'hover:bg-[#FAF7F2] text-[#2B211E]'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className={`p-1.5 px-3 text-xs transition-colors cursor-pointer ${
                      isDark ? 'hover:bg-[#1D1718] text-white' : 'hover:bg-[#FAF7F2] text-[#2B211E]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Provenance note */}
              <div
                className={`p-2.5 rounded-md border flex items-center gap-2 text-[11px] ${
                  isDark
                    ? 'bg-[#1D1718] border-[#3D2E32] text-[#D8C7B5]'
                    : 'bg-[#F3EDE4]/80 border-[#EAE2D6] text-[#2B211E]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#651F32] dark:text-[#DEC596] shrink-0" />
                <span>
                  Dispatched directly from Bahawalpur, Punjab, Pakistan.
                </span>
              </div>

            </div>

            {/* Action Buttons */}
            <div className={`space-y-2.5 pt-3 border-t ${isDark ? 'border-[#3D2E32]' : 'border-[#EAE2D6]'}`}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Add to Cart button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!selectedProduct.available}
                  className={`inline-flex items-center justify-center gap-2 py-3 px-4 rounded-md font-semibold text-xs sm:text-sm border transition-all cursor-pointer shadow-xs ${
                    !selectedProduct.available
                      ? 'opacity-50 cursor-not-allowed bg-stone-200 text-stone-500'
                      : addedNotice
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : isDark
                          ? 'bg-[#1D1718] hover:bg-[#35282B] text-[#DEC596] border-[#DEC596]/40 hover:border-[#DEC596]'
                          : 'bg-white hover:bg-[#FAF7F2] text-[#651F32] border-[#D8C7B5] hover:border-[#651F32]'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* Direct WhatsApp Order Button */}
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#651F32] hover:bg-[#4E1525] text-white py-3 px-4 rounded-md font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* View Cart link if items exist */}
              {totalItems > 0 && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="text-xs font-semibold text-[#651F32] dark:text-[#DEC596] hover:underline cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>View Shopping Cart ({totalItems} item{totalItems > 1 ? 's' : ''}) →</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-xs opacity-75 px-1 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <span>Direct Artisan Inquiry ({BUSINESS_CONFIG.owner})</span>
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1 text-[#651F32] dark:text-[#DEC596] hover:underline cursor-pointer font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-semibold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
