
import { useState, useEffect, useCallback } from 'react';
import { furnitureApiService, FurnitureItem } from '@/services/furnitureApiService';

interface UseFurnitureApiReturn {
  furniture: FurnitureItem[];
  loading: boolean;
  error: string | null;
  searchFurniture: (query: string, category?: string) => Promise<void>;
  getFurnitureByCategory: (category: string) => Promise<void>;
  refreshFurniture: () => Promise<void>;
}

export const useFurnitureApi = (initialCategory?: string): UseFurnitureApiReturn => {
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFurnitureByCategory = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await furnitureApiService.getFurnitureByCategory(category);
      setFurniture(data);
    } catch (err) {
      setError('Failed to fetch furniture data');
      console.error('Error fetching furniture:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchFurniture = useCallback(async (query: string, category?: string) => {
    if (!query.trim()) {
      if (category) {
        await getFurnitureByCategory(category);
      }
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await furnitureApiService.searchFurniture(query, category);
      setFurniture(data);
    } catch (err) {
      setError('Failed to search furniture');
      console.error('Error searching furniture:', err);
    } finally {
      setLoading(false);
    }
  }, [getFurnitureByCategory]);

  const refreshFurniture = useCallback(async () => {
    if (initialCategory) {
      await getFurnitureByCategory(initialCategory);
    }
  }, [initialCategory, getFurnitureByCategory]);

  useEffect(() => {
    if (initialCategory) {
      getFurnitureByCategory(initialCategory);
    }
  }, [initialCategory, getFurnitureByCategory]);

  return {
    furniture,
    loading,
    error,
    searchFurniture,
    getFurnitureByCategory,
    refreshFurniture
  };
};
