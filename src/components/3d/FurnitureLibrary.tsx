
import { useState } from 'react';
import { Search } from 'lucide-react';

interface FurnitureCategory {
  name: string;
  items: FurnitureTemplate[];
}

interface FurnitureTemplate {
  id: string;
  name: string;
  type: string;
  category: string;
  thumbnail: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  defaultMaterial: string;
  defaultColor: string;
}

interface FurnitureLibraryProps {
  onAddFurniture: (furniture: {
    type: string;
    name: string;
    dimensions: { width: number; height: number; depth: number };
    material: string;
    color: string;
  }) => void;
}

const furnitureCategories: FurnitureCategory[] = [
  {
    name: 'Seating',
    items: [
      {
        id: 'chair-1',
        name: 'Modern Chair',
        type: 'chair',
        category: 'seating',
        thumbnail: '🪑',
        dimensions: { width: 0.6, height: 0.9, depth: 0.6 },
        defaultMaterial: 'fabric',
        defaultColor: '#4A5568',
      },
      {
        id: 'sofa-1',
        name: '3-Seat Sofa',
        type: 'sofa',
        category: 'seating',
        thumbnail: '🛋️',
        dimensions: { width: 2.2, height: 0.8, depth: 0.9 },
        defaultMaterial: 'fabric',
        defaultColor: '#2D3748',
      },
      {
        id: 'armchair-1',
        name: 'Armchair',
        type: 'armchair',
        category: 'seating',
        thumbnail: '🛋️',
        dimensions: { width: 0.8, height: 0.9, depth: 0.8 },
        defaultMaterial: 'leather',
        defaultColor: '#8B4513',
      },
    ],
  },
  {
    name: 'Tables',
    items: [
      {
        id: 'coffee-table-1',
        name: 'Coffee Table',
        type: 'coffee-table',
        category: 'tables',
        thumbnail: '🪑',
        dimensions: { width: 1.2, height: 0.4, depth: 0.6 },
        defaultMaterial: 'wood',
        defaultColor: '#8B4513',
      },
      {
        id: 'dining-table-1',
        name: 'Dining Table',
        type: 'dining-table',
        category: 'tables',
        thumbnail: '🍽️',
        dimensions: { width: 1.8, height: 0.75, depth: 0.9 },
        defaultMaterial: 'wood',
        defaultColor: '#654321',
      },
      {
        id: 'side-table-1',
        name: 'Side Table',
        type: 'side-table',
        category: 'tables',
        thumbnail: '🏠',
        dimensions: { width: 0.5, height: 0.6, depth: 0.5 },
        defaultMaterial: 'wood',
        defaultColor: '#D2691E',
      },
    ],
  },
  {
    name: 'Storage',
    items: [
      {
        id: 'bookshelf-1',
        name: 'Bookshelf',
        type: 'bookshelf',
        category: 'storage',
        thumbnail: '📚',
        dimensions: { width: 0.8, height: 2.0, depth: 0.3 },
        defaultMaterial: 'wood',
        defaultColor: '#8B4513',
      },
      {
        id: 'wardrobe-1',
        name: 'Wardrobe',
        type: 'wardrobe',
        category: 'storage',
        thumbnail: '👗',
        dimensions: { width: 1.2, height: 2.2, depth: 0.6 },
        defaultMaterial: 'wood',
        defaultColor: '#A0522D',
      },
      {
        id: 'dresser-1',
        name: 'Dresser',
        type: 'dresser',
        category: 'storage',
        thumbnail: '🗃️',
        dimensions: { width: 1.0, height: 0.8, depth: 0.5 },
        defaultMaterial: 'wood',
        defaultColor: '#CD853F',
      },
    ],
  },
  {
    name: 'Bedroom',
    items: [
      {
        id: 'bed-single',
        name: 'Single Bed',
        type: 'bed',
        category: 'bedroom',
        thumbnail: '🛏️',
        dimensions: { width: 1.0, height: 0.6, depth: 2.0 },
        defaultMaterial: 'fabric',
        defaultColor: '#F5F5DC',
      },
      {
        id: 'bed-double',
        name: 'Double Bed',
        type: 'bed',
        category: 'bedroom',
        thumbnail: '🛏️',
        dimensions: { width: 1.4, height: 0.6, depth: 2.0 },
        defaultMaterial: 'fabric',
        defaultColor: '#F5F5DC',
      },
      {
        id: 'nightstand-1',
        name: 'Nightstand',
        type: 'nightstand',
        category: 'bedroom',
        thumbnail: '🏠',
        dimensions: { width: 0.4, height: 0.6, depth: 0.4 },
        defaultMaterial: 'wood',
        defaultColor: '#8B4513',
      },
    ],
  },
];

const FurnitureLibrary = ({ onAddFurniture }: FurnitureLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredCategories = furnitureCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === '' || category.name === selectedCategory)
    ),
  })).filter(category => category.items.length > 0);

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-neutral-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search furniture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-neutral-200">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          {furnitureCategories.map(category => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Furniture Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredCategories.map(category => (
          <div key={category.name} className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              {category.name}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {category.items.map(item => (
                <div
                  key={item.id}
                  onClick={() => onAddFurniture({
                    type: item.type,
                    name: item.name,
                    dimensions: item.dimensions,
                    material: item.defaultMaterial,
                    color: item.defaultColor,
                  })}
                  className="bg-white border border-neutral-200 rounded-lg p-3 cursor-pointer hover:bg-neutral-50 hover:border-primary-300 transition-colors"
                >
                  <div className="text-2xl text-center mb-2">
                    {item.thumbnail}
                  </div>
                  <div className="text-xs font-medium text-center text-neutral-700">
                    {item.name}
                  </div>
                  <div className="text-xs text-center text-neutral-500 mt-1">
                    {item.dimensions.width}×{item.dimensions.depth}×{item.dimensions.height}m
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FurnitureLibrary;
