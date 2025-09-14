import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteItem } from '../types/navigation';

type Ctx = {
  favorites: FavoriteItem[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (item: FavoriteItem) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  reload: () => Promise<void>;
};

const FavoritesContext = createContext<Ctx | null>(null);
const KEY = '@favorites';

export const FavoritesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      setFavorites(raw ? JSON.parse(raw) : []);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const persist = async (next: FavoriteItem[]) => {
    setFavorites(next);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  };

  const isFavorite = (id: number) => favorites.some(f => f.id === id);

  const toggleFavorite = async (item: FavoriteItem) => {
    const exists = isFavorite(item.id);
    const next = exists ? favorites.filter(f => f.id !== item.id) : [item, ...favorites];
    await persist(next);
  };

  const removeFavorite = async (id: number) => {
    const next = favorites.filter(f => f.id !== id);
    await persist(next);
  };

  const reload = load;

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite, reload }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};
