// Menu data fetching helpers

import { getCollection } from 'astro:content';
import type { Product, Category, CategoryData } from '../../types/menu';
import type { StoreConfig } from '../../types/config';
import configData from '../../content/config.json';
import { entryToProduct } from '../utils/content-helpers';

export async function getAllProducts(): Promise<Product[]> {
  const entries = await getCollection('menu');
  return entries.map(entryToProduct).filter((p) => p.available);
}

export async function getProductsByCategory(category: Category): Promise<Product[]> {
  const entries = await getCollection('menu', ({ data }) => {
    return data.category === category;
  });
  return entries.map(entryToProduct).filter((p) => p.available);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const entries = await getCollection('menu', ({ data }) => {
    return data.featured === true;
  });
  return entries.map(entryToProduct).filter((p) => p.available);
}

export async function getProductById(id: string): Promise<Product | null> {
  const entries = await getCollection('menu', ({ data }) => {
    return data.id === id;
  });
  if (entries.length === 0) return null;
  const product = entryToProduct(entries[0]);
  return product.available ? product : null;
}

export async function getMenuConfig(): Promise<StoreConfig> {
  return configData as StoreConfig;
}

export async function getCategories(): Promise<CategoryData[]> {
  const allProducts = await getAllProducts();
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
    products: allProducts.filter((p) => p.category === id),
  }));
}
