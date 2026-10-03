import { Product, CartItem } from '../types';

export const BUSINESS_CONFIG = {
  name: 'Fairytale Chunri Closet',
  owner: 'Yasir Farooq',
  location: 'Bahawalpur, Punjab, Pakistan',
  whatsappRaw: '923036466711',
  whatsappDisplay: '+92 303 6466711',
  email: 'info@fairytalechunri.com',
};

/**
 * Generates a clean, valid WhatsApp URL without spaces or illegal characters
 */
export function getWhatsAppUrl(message?: string): string {
  const baseUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappRaw}`;
  if (!message) {
    return baseUrl;
  }
  return `${baseUrl}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Creates pre-filled WhatsApp message for a single selected product / suit
 */
export function getProductWhatsAppUrl(
  product: Product,
  options?: { size?: string; color?: string; quantity?: number }
): string {
  const qty = options?.quantity && options.quantity > 0 ? options.quantity : 1;
  const itemTotal = product.price * qty;

  let message = `Assalam o Alaikum Yasir Bhai,\n\nI would like to order this suit from Fairytale Chunri Closet:\n\n`;
  message += `👗 *Item:* ${product.name}\n`;
  message += `🏷️ *Category:* ${product.category}\n`;
  if (product.fabric) {
    message += `🧵 *Fabric:* ${product.fabric}\n`;
  }
  if (options?.size) {
    message += `📏 *Size/Form:* ${options.size}\n`;
  }
  if (options?.color) {
    message += `🎨 *Color:* ${options.color}\n`;
  }
  if (qty > 1) {
    message += `🔢 *Quantity:* ${qty} pcs\n`;
    message += `💰 *Total Price:* PKR ${itemTotal.toLocaleString()} (PKR ${product.price.toLocaleString()} each)\n`;
  } else {
    message += `💰 *Price:* PKR ${product.price.toLocaleString()}\n`;
  }
  message += `\n📍 Dispatched to: Bahawalpur / Delivery in Pakistan\n`;
  message += `Please confirm availability and sharing payment/dispatch details. Thank you!`;

  return getWhatsAppUrl(message);
}

/**
 * Creates pre-filled WhatsApp message for ALL items currently in the cart
 * Sends full order breakdown: each suit, fabric, size, color, quantity, price, and total.
 */
export function generateCartWhatsAppUrl(
  items: CartItem[],
  customerInfo?: { name?: string; phone?: string; city?: string; instructions?: string }
): string {
  if (!items || items.length === 0) {
    return getWhatsAppUrl(`Assalam o Alaikum Yasir Bhai, I would like to inquire about placing an order at Fairytale Chunri Closet.`);
  }

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  let message = `Assalam o Alaikum Yasir Bhai,\n\nI would like to place an order from *Fairytale Chunri Closet*:\n\n`;

  if (customerInfo?.name?.trim()) {
    message += `👤 *Customer Name:* ${customerInfo.name.trim()}\n`;
  }
  if (customerInfo?.city?.trim()) {
    message += `📍 *Delivery City / Address:* ${customerInfo.city.trim()}\n`;
  }
  if (customerInfo?.phone?.trim()) {
    message += `📞 *Contact Number:* ${customerInfo.phone.trim()}\n`;
  }
  if (customerInfo?.name || customerInfo?.city || customerInfo?.phone) {
    message += `\n`;
  }

  message += `🛍️ *Order Breakdown (${totalQty} item${totalQty > 1 ? 's' : ''}):*\n`;
  message += `═══════════════════════════\n`;

  items.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    message += `${index + 1}. *${item.product.name}*\n`;
    message += `   • Category: ${item.product.category}\n`;
    if (item.product.fabric) {
      message += `   • Fabric: ${item.product.fabric}\n`;
    }
    if (item.selectedSize) {
      message += `   • Size/Form: ${item.selectedSize}\n`;
    }
    if (item.selectedColor) {
      message += `   • Color: ${item.selectedColor}\n`;
    }
    message += `   • Quantity: ${item.quantity} × PKR ${item.product.price.toLocaleString()}\n`;
    message += `   • Subtotal: *PKR ${itemTotal.toLocaleString()}*\n\n`;
  });

  message += `═══════════════════════════\n`;
  message += `💰 *TOTAL ORDER AMOUNT: PKR ${totalPrice.toLocaleString()}*\n`;
  message += `═══════════════════════════\n\n`;

  if (customerInfo?.instructions?.trim()) {
    message += `📝 *Customer Notes:* ${customerInfo.instructions.trim()}\n\n`;
  }

  message += `Please confirm availability of these suits and share payment/delivery schedule for Bahawalpur. Thank you!`;

  return getWhatsAppUrl(message);
}

/**
 * Creates pre-filled WhatsApp message for general contact
 */
export function getGeneralInquiryWhatsAppUrl(customMessage?: string): string {
  const message = customMessage || `Assalam o Alaikum, I have an inquiry regarding Fairytale Chunri Closet collections.`;
  return getWhatsAppUrl(message);
}
