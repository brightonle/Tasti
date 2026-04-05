import { useState } from 'react';
import { useAuth } from './useAuth';

export function useFavorites() {
  const { userDoc } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(userDoc?.favorites ?? []);

  function isFavorite(vendorId: string): boolean {
    return favorites.includes(vendorId);
  }

  async function toggleFavorite(_uid: string, vendorId: string): Promise<void> {
    setFavorites((prev) =>
      prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]
    );
  }

  return { favorites, isFavorite, toggleFavorite };
}
