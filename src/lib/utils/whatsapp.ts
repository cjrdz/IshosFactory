// WhatsApp message formatting

import type { CartItem } from '../../types/cart';
import { formatPrice } from './formatters';

export function formatWhatsAppMessage(
  items: CartItem[],
  total: number,
  customerName: string,
  phone: string,
  orderType: 'pickup' | 'delivery',
  address?: string,
  notes?: string,
  currencySymbol: string = '$'
): string {
  // Use simple, universally supported emojis and WhatsApp native formatting
  // WhatsApp supports: *bold*, _italic_, ~strikethrough~, ```monospace```
  // Using basic emojis that work across all platforms: ✏️ 📋 📱 📦 🛒 💰 ✅
  
  let message = `✏️ *PEDIDO*\n\n`;
  
  // Customer Information Section
  message += `📋 *INFORMACIÓN DEL CLIENTE*\n\n`;
  message += `Cliente: ${customerName}\n`;
  message += `Teléfono: 📱 ${phone}\n`;
  message += `Tipo de pedido: 📦 ${orderType === 'pickup' ? 'Recoger en tienda' : 'Entrega a domicilio'}\n`;
  
  if (orderType === 'delivery' && address) {
    message += `Dirección: ${address}\n`;
  }
  
  // Products Section
  message += `\n🛒 *PRODUCTOS*\n\n`;
  
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.product.name}*`;
    if (item.selectedSize) {
      message += ` (${item.selectedSize.name})`;
    }
    if (item.selectedFlavor) {
      message += `\n   Sabor: ${item.selectedFlavor}`;
    }
    message += `\n   Cantidad: ${item.quantity}`;
    message += `\n   Precio: ${formatPrice(item.subtotal, 'USD', currencySymbol)}\n`;
    
    if (item.notes) {
      message += `   Nota: ${item.notes}\n`;
    }
  });
  
  // Total Section
  message += `\n💰 *TOTAL: ${formatPrice(total, 'USD', currencySymbol)}*\n`;
  
  // Additional Notes
  if (notes) {
    message += `\n📋 *NOTAS ADICIONALES*\n`;
    message += `${notes}\n`;
  }
  
  // Closing
  message += `\n✅ *Gracias por tu pedido!*\n`;
  message += `Te contactaremos pronto para confirmar.`;
  
  return message;
}

export function generateWhatsAppURL(
  phoneNumber: string,
  message: string
): string {
  // Remove any non-digit characters from phone number
  const cleanedPhone = phoneNumber.replace(/\D/g, '');
  // Add country code if not present (El Salvador: +503)
  const fullPhone = cleanedPhone.startsWith('503') ? cleanedPhone : `503${cleanedPhone}`;
  
  // Properly encode the message for URL - encodeURIComponent handles UTF-8 emojis correctly
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${fullPhone}?text=${encodedMessage}`;
}


