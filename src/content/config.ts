import { defineCollection, z } from 'astro:content';

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['gelatos', 'sorbetes', 'especiales', 'extras']),
  image: z.string(),
  price: z.number().positive(),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  sizes: z.array(z.object({
    name: z.string(),
    price: z.number().positive(),
    description: z.string().optional(),
  })).optional(),
  allergens: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  flavors: z.array(z.string()).optional(),
});

const menuCollection = defineCollection({
  type: 'content', // Changed from 'data' to 'content' for markdown files
  schema: productSchema,
});

export const collections = {
  'menu': menuCollection,
};
