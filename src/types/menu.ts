// Menu and Product types

export type Category = 'gelatos' | 'sorbetes' | 'especiales' | 'extras';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  available: boolean;
  featured?: boolean;
  sizes?: ProductSize[];
  flavors?: string[];
  allergens?: string[];
}

export interface ProductSize {
  name: string;
  price: number;
  description?: string;
}

export interface MenuConfig {
  storeName: string;
  storeDescription: string;
  currency: string;
  currencySymbol: string;
  whatsappNumber: string;
  whatsappMessage?: string;
  taxRate?: number;
  minOrderAmount?: number;
  deliveryAvailable?: boolean;
  pickupAvailable?: boolean;
}

export interface CategoryData {
  id: Category;
  name: string;
  description: string;
  icon?: string;
  products: Product[];
}


