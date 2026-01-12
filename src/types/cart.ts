// Cart types

import type { Product, ProductSize } from "./menu";

export interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: ProductSize;
  selectedFlavor?: string;
  notes?: string;
  unitPrice: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  lastUpdated: number;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}
