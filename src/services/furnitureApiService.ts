
interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  imageUrl: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  material: string;
  color: string;
  brand?: string;
  description?: string;
}

interface FurnitureApiResponse {
  items: FurnitureItem[];
  total: number;
  page: number;
  limit: number;
}

class FurnitureApiService {
  // Mock data for demonstration - in production, this would come from a real furniture API
  private mockFurnitureData: Record<string, FurnitureItem[]> = {
    'living-room': [
      {
        id: 'sofa-001',
        name: 'Modern 3-Seat Sofa',
        category: 'living-room',
        type: 'sofa',
        price: 1299,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        dimensions: { width: 2.2, height: 0.8, depth: 0.9 },
        material: 'fabric',
        color: '#2D3748',
        brand: 'ModernHome',
        description: 'Comfortable contemporary sofa with clean lines'
      },
      {
        id: 'chair-001',
        name: 'Accent Armchair',
        category: 'living-room',
        type: 'armchair',
        price: 599,
        imageUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
        dimensions: { width: 0.8, height: 0.9, depth: 0.8 },
        material: 'leather',
        color: '#8B4513',
        brand: 'ComfortPlus',
        description: 'Elegant leather armchair perfect for reading'
      },
      {
        id: 'table-001',
        name: 'Glass Coffee Table',
        category: 'living-room',
        type: 'coffee-table',
        price: 399,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        dimensions: { width: 1.2, height: 0.4, depth: 0.6 },
        material: 'glass',
        color: '#E2E8F0',
        brand: 'GlassCraft',
        description: 'Modern tempered glass coffee table with metal legs'
      }
    ],
    'bedroom': [
      {
        id: 'bed-001',
        name: 'Platform King Bed',
        category: 'bedroom',
        type: 'bed',
        price: 899,
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
        dimensions: { width: 1.93, height: 0.6, depth: 2.03 },
        material: 'wood',
        color: '#8B4513',
        brand: 'SleepWell',
        description: 'Minimalist king-size platform bed frame'
      },
      {
        id: 'nightstand-001',
        name: '2-Drawer Nightstand',
        category: 'bedroom',
        type: 'nightstand',
        price: 199,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        dimensions: { width: 0.5, height: 0.6, depth: 0.4 },
        material: 'wood',
        color: '#654321',
        brand: 'BedroomPlus',
        description: 'Compact nightstand with storage drawers'
      }
    ],
    'kitchen': [
      {
        id: 'island-001',
        name: 'Kitchen Island',
        category: 'kitchen',
        type: 'kitchen-island',
        price: 1599,
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        dimensions: { width: 2.0, height: 0.9, depth: 1.0 },
        material: 'wood',
        color: '#F7FAFC',
        brand: 'KitchenMaster',
        description: 'Multi-functional kitchen island with storage'
      }
    ],
    'dining': [
      {
        id: 'dining-table-001',
        name: '6-Seat Dining Table',
        category: 'dining',
        type: 'dining-table',
        price: 799,
        imageUrl: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400',
        dimensions: { width: 1.8, height: 0.75, depth: 0.9 },
        material: 'wood',
        color: '#654321',
        brand: 'DiningCraft',
        description: 'Solid wood dining table for family gatherings'
      }
    ]
  };

  async getFurnitureByCategory(category: string): Promise<FurnitureItem[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data for now - in production, this would be a real API call
      return this.mockFurnitureData[category] || [];
    } catch (error) {
      console.error('Error fetching furniture data:', error);
      return [];
    }
  }

  async searchFurniture(query: string, category?: string): Promise<FurnitureItem[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let allItems: FurnitureItem[] = [];
      
      if (category) {
        allItems = this.mockFurnitureData[category] || [];
      } else {
        allItems = Object.values(this.mockFurnitureData).flat();
      }
      
      return allItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching furniture:', error);
      return [];
    }
  }

  async getFurnitureById(id: string): Promise<FurnitureItem | null> {
    try {
      const allItems = Object.values(this.mockFurnitureData).flat();
      return allItems.find(item => item.id === id) || null;
    } catch (error) {
      console.error('Error fetching furniture by ID:', error);
      return null;
    }
  }
}

export const furnitureApiService = new FurnitureApiService();
export type { FurnitureItem, FurnitureApiResponse };
