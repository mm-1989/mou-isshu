import type { Tanka } from '../tanka/types';

const KEY = 'mou-isshu:favorites:v1';

export function loadFavorites(): Tanka[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveFavorites(items: Tanka[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save favorites', err);
  }
}

export function isFavorited(items: Tanka[], tankaId: string): boolean {
  return items.some((t) => t.id === tankaId);
}

export function toggleFavorite(items: Tanka[], tanka: Tanka): Tanka[] {
  if (isFavorited(items, tanka.id)) {
    return items.filter((t) => t.id !== tanka.id);
  }
  return [tanka, ...items];
}
