// Helper functions for content collections

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Product } from '../../types/menu';

/**
 * Converts a content collection entry to a Product type
 */
export function entryToProduct(entry: CollectionEntry<'menu'>): Product {
  return {
    id: entry.data.id,
    name: entry.data.name,
    description: entry.data.description,
    price: entry.data.price,
    image: entry.data.image,
    category: entry.data.category,
    available: entry.data.available ?? true,
    featured: entry.data.featured ?? false,
    sizes: entry.data.sizes,
    flavors: entry.data.flavors,
    allergens: entry.data.allergens,
    ingredients: entry.data.ingredients,
  };
}

/**
 * Gets all products from the menu collection
 */
export async function getAllProductsFromCollection(): Promise<Product[]> {
  const entries = await getCollection('menu');
  return entries.map(entryToProduct).filter((p) => p.available);
}

/**
 * Gets products by category
 */
export async function getProductsByCategoryFromCollection(
  category: Product['category']
): Promise<Product[]> {
  const entries = await getCollection('menu', ({ data }) => {
    return data.category === category;
  });
  return entries.map(entryToProduct).filter((p) => p.available);
}

/**
 * Gets featured products
 */
export async function getFeaturedProductsFromCollection(): Promise<Product[]> {
  const entries = await getCollection('menu', ({ data }) => {
    return data.featured === true;
  });
  return entries.map(entryToProduct).filter((p) => p.available && p.featured);
}
