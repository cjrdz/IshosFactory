// Menu filter store

import { atom } from 'nanostores';
import type { Category } from '../../types/menu';

export interface MenuFilters {
  category: Category | 'all';
  searchQuery: string;
  sortBy: 'name' | 'price-asc' | 'price-desc';
  showAvailableOnly: boolean;
}

const initialFilters: MenuFilters = {
  category: 'all',
  searchQuery: '',
  sortBy: 'name',
  showAvailableOnly: false,
};

export const filters = atom<MenuFilters>(initialFilters);

export function setCategory(category: Category | 'all'): void {
  const current = filters.get();
  filters.set({ ...current, category });
}

export function setSearchQuery(query: string): void {
  const current = filters.get();
  filters.set({ ...current, searchQuery: query });
}

export function setSortBy(sortBy: MenuFilters['sortBy']): void {
  const current = filters.get();
  filters.set({ ...current, sortBy });
}

export function setShowAvailableOnly(show: boolean): void {
  const current = filters.get();
  filters.set({ ...current, showAvailableOnly: show });
}

export function resetFilters(): void {
  filters.set(initialFilters);
}


