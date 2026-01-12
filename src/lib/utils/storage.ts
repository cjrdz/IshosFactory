// Session/Local storage helpers

import type { Cart } from '../../types/cart';

export function getCartFromStorage(): Cart | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem('ishos_cart');
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading cart from storage:', error);
    return null;
  }
}

export function saveCartToStorage(cart: Cart): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.setItem('ishos_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
}

export function clearCartFromStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem('ishos_cart');
  } catch (error) {
    console.error('Error clearing cart from storage:', error);
  }
}


