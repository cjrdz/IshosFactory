// Menu data fetching helpers

import type { Product, Category, CategoryData } from '../../types/menu';
import type { StoreConfig } from '../../types/config';

// Import menu data from content collections
import gelatosData from '../../content/menu/gelatos.json';
import sorbetesData from '../../content/menu/sorbetes.json';
import especialesData from '../../content/menu/especiales.json';
import extrasData from '../../content/menu/extras.json';
import configData from '../../content/config.json';

// Combine all products
const allProducts: Product[] = [
  ...(gelatosData as Product[]),
  ...(sorbetesData as Product[]),
  ...(especialesData as Product[]),
  ...(extrasData as Product[]),
];

export async function getAllProducts(): Promise<Product[]> {
  return allProducts.filter((p) => p.available);
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  return allProducts.filter((p) => p.available && p.category === category);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return allProducts.filter((p) => p.available && p.featured);
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = allProducts.find((p) => p.id === id);
  return product && product.available ? product : null;
}

export async function getMenuConfig(): Promise<StoreConfig> {
  return configData as StoreConfig;
}

export async function getCategories(): Promise<CategoryData[]> {
  const categories: Record<Category, { name: string; description: string }> = {
    gelatos: {
      name: 'Gelatos',
      description: 'Nuestros gelatos artesanales cremosos y deliciosos',
    },
    sorbetes: {
      name: 'Sorbetes',
      description: 'Sorbetes refrescantes y naturales',
    },
    especiales: {
      name: 'Especiales',
      description: 'Productos especiales y de temporada',
    },
    extras: {
      name: 'Extras',
      description: 'Complementos y accesorios para tu helado',
    },
  };

  return Object.entries(categories).map(([id, info]) => ({
    id: id as Category,
    name: info.name,
    description: info.description,
    products: allProducts.filter((p) => p.category === id && p.available),
  }));
}
