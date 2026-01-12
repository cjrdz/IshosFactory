// Helper to use nanostores with Svelte 5
// This file exports utilities that work with Svelte components

import type { ReadableAtom } from 'nanostores';

// This function should be called inside Svelte components
// It returns a getter function that can be used with $derived or reactive statements
export function createStoreGetter<T>(store: ReadableAtom<T>) {
  return () => store.get();
}
