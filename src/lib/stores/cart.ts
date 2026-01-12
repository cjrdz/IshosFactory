// Cart store using nanostores

import { atom, computed } from 'nanostores';
import type { Cart, CartItem } from '../../types/cart';
import type { Product, ProductSize } from '../../types/menu';
import { getCartFromStorage, saveCartToStorage, clearCartFromStorage } from '../utils/storage';

function generateCartItemId(): string {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function calculateItemSubtotal(item: CartItem): number {
  const price = item.selectedSize?.price ?? item.unitPrice;
  return price * item.quantity;
}

function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.subtotal, 0);
}

// Initialize cart from storage or create empty cart
const initialCart: Cart = getCartFromStorage() || {
  items: [],
  total: 0,
  itemCount: 0,
  lastUpdated: Date.now(),
};

export const cart = atom<Cart>(initialCart);

// Computed values
export const cartItemCount = computed(cart, (cart) => cart.itemCount);
export const cartTotal = computed(cart, (cart) => cart.total);
export const cartItems = computed(cart, (cart) => cart.items);
export const isEmpty = computed(cart, (cart) => cart.items.length === 0);

// Actions
export function addToCart(
  product: Product,
  quantity: number = 1,
  selectedSize?: ProductSize,
  selectedFlavor?: string,
  notes?: string
): void {
  const currentCart = cart.get();
  const unitPrice = selectedSize?.price ?? product.price;
  
  const newItem: CartItem = {
    id: generateCartItemId(),
    productId: product.id,
    product,
    quantity,
    selectedSize,
    selectedFlavor,
    notes,
    unitPrice,
    subtotal: calculateItemSubtotal({
      id: '',
      productId: product.id,
      product,
      quantity,
      selectedSize,
      selectedFlavor,
      notes,
      unitPrice,
      subtotal: 0,
    }),
  };
  
  const updatedItems = [...currentCart.items, newItem];
  const total = calculateCartTotal(updatedItems);
  
  const updatedCart: Cart = {
    items: updatedItems,
    total,
    itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
    lastUpdated: Date.now(),
  };
  
  cart.set(updatedCart);
  saveCartToStorage(updatedCart);
}

export function updateCartItemQuantity(itemId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(itemId);
    return;
  }
  
  const currentCart = cart.get();
  const updatedItems = currentCart.items.map((item) => {
    if (item.id === itemId) {
      const updatedItem = { ...item, quantity };
      return {
        ...updatedItem,
        subtotal: calculateItemSubtotal(updatedItem),
      };
    }
    return item;
  });
  
  const total = calculateCartTotal(updatedItems);
  const updatedCart: Cart = {
    items: updatedItems,
    total,
    itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
    lastUpdated: Date.now(),
  };
  
  cart.set(updatedCart);
  saveCartToStorage(updatedCart);
}

export function removeFromCart(itemId: string): void {
  const currentCart = cart.get();
  const updatedItems = currentCart.items.filter((item) => item.id !== itemId);
  const total = calculateCartTotal(updatedItems);
  
  const updatedCart: Cart = {
    items: updatedItems,
    total,
    itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
    lastUpdated: Date.now(),
  };
  
  cart.set(updatedCart);
  saveCartToStorage(updatedCart);
}

export function clearCart(): void {
  const emptyCart: Cart = {
    items: [],
    total: 0,
    itemCount: 0,
    lastUpdated: Date.now(),
  };
  cart.set(emptyCart);
  clearCartFromStorage();
}

// Initialize cart from storage on load
if (typeof window !== 'undefined') {
  const storedCart = getCartFromStorage();
  if (storedCart) {
    cart.set(storedCart);
  }
}


