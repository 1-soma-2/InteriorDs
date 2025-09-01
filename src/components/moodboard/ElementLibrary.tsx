import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Armchair, Table, Lamp, Bed, Sofa, ChevronRight, DoorOpen, Grid3X3, Bath, LayoutGrid } from 'lucide-react';

// Mock furniture items data
const FURNITURE_ITEMS = [
  {
    id: 'f1',
    name: 'Modern Sofa',
    category: 'sofas',
    image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'f2',
    name: 'Accent Chair',
    category: 'chairs',
    image: 'https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'f3',
    name: 'Coffee Table',
    category: 'tables',
    image: 'https://images.pexels.com/photos/2098913/pexels-photo-2098913.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'f4',
    name: 'Table Lamp',
    category: 'lighting',
    image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'f5',
    name: 'Bed Frame',
    category: 'bedroom',
    image: 'https://images.pexels.com/photos/775219/pexels-photo-775219.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'f6',
    name: 'Side Table',
    category: 'tables',
    image: 'https://images.pexels.com/photos/2249051/pexels-photo-2249051.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
];

// Mock textures data
const TEXTURES = [
  {
    id: 't1',
    name: 'Wood Flooring',
    category: 'wood',
    image: 'https://images.pexels.com/photos/172292/pexels-photo-172292.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 't2',
    name: 'Marble',
    category: 'stone',
    image: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 't3',
    name: 'Linen Fabric',
    category: 'fabric',
    image: 'https://images.pexels.com/photos/4946975/pexels-photo-4946975.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 't4',
    name: 'Concrete',
    category: 'stone',
    image: 'https://images.pexels.com/photos/5022847/pexels-photo-5022847.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
];

// Mock color palettes
const COLOR_PALETTES = [
  {
    id: 'p1',
    name: 'Neutral Tones',
    colors: ['#E8E4D9', '#D2C8B0', '#A69A88', '#817567', '#5A524A']
  },
  {
    id: 'p2',
    name: 'Green Sanctuary',
    colors: ['#EFF7EF', '#C9E4CA', '#87B38D', '#5E8C61', '#324B34']
  },
  {
    id: 'p3',
    name: 'Coastal Blues',
    colors: ['#F7FBFC', '#D6E6F2', '#B9D7EA', '#769FCD', '#2E5984']
  },
  {
    id: 'p4',
    name: 'Warm Terracotta',
    colors: ['#FFEEE8', '#FFDBCC', '#F2BEA0', '#E8956A', '#C2703D']
  },
];

interface ElementLibraryProps {
  onAddElement: (type: string, item: any) => void;
  onClose?: () => void;
}

const ElementLibrary = ({ onAddElement, onClose }: ElementLibraryProps) => {
  const [activeTab, setActiveTab] = useState('furniture');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Get furniture categories
  const furnitureCategories = ['all', ...new Set(FURNITURE_ITEMS.map(item => item.category))];
  
  // Get texture categories
  const textureCategories = ['all', ...new Set(TEXTURES.map(item => item.category))];

  // Filter items based on search and category
  const getFilteredItems = () => {
    if (activeTab === 'furniture') {
      return FURNITURE_ITEMS.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
      });
    } else if (activeTab === 'textures') {
      return TEXTURES.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
      });
    } else if (activeTab === 'colors') {
      return COLOR_PALETTES.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return [];
  };
  
  const filteredItems = getFilteredItems();

  // Get tab icon
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'furniture':
        return <Sofa className="w-5 h-5" />;
      case 'textures':
        return <Grid3X3 className="w-5 h-5" />;
      case 'colors':
        return <LayoutGrid className="w-5 h-5" />;
      default:
        return <Sofa className="w-5 h-5" />;
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sofas':
        return <Sofa className="w-4 h-4" />;
      case 'chairs':
        return <Armchair className="w-4 h-4" />;
      case 'tables':
        return <Table className="w-4 h-4" />;
      case 'lighting':
        return <Lamp className="w-4 h-4" />;
      case 'bedroom':
        return <Bed className="w-4 h-4" />;
      case 'bathroom':
        return <Bath className="w-4 h-4" />;
      case 'doors':
        return <DoorOpen className="w-4 h-4" />;
      default:
        return <ChevronRight className="w-4 h-4" />;
    }
  };

  // Handle item click for adding to canvas
  const handleItemClick = (type: string, item: any) => {
    onAddElement(type, item);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <h3 className="text-lg font-semibold">Element Library</h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Search */}
      <div className="p-3 border-b border-neutral-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        {['furniture', 'textures', 'colors'].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setActiveCategory('all');
            }}
            className={`flex-1 py-3 text-sm font-medium relative ${
              activeTab === tab 
                ? 'text-primary-600' 
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <div className="flex items-center justify-center">
              {getTabIcon(tab)}
              <span className="ml-2 capitalize">{tab}</span>
            </div>
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
              />
            )}
          </button>
        ))}
      </div>
      
      <div className="flex-grow flex overflow-hidden">
        {/* Categories sidebar */}
        <div className="w-1/3 border-r border-neutral-200 bg-neutral-50 overflow-y-auto">
          <ul className="py-2">
            {(activeTab === 'furniture' ? furnitureCategories : 
              activeTab === 'textures' ? textureCategories : 
              []).map(category => (
              <li key={category}>
                <button
                  onClick={() => setActiveCategory(category)}
                  className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                    activeCategory === category 
                      ? 'bg-primary-50 text-primary-600 font-medium' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {activeTab === 'furniture' && getCategoryIcon(category)}
                  <span className="ml-2 capitalize">{category === 'all' ? 'All Categories' : category}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Items grid */}
        <div className="w-2/3 overflow-y-auto p-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'colors' ? (
                // Color palettes
                <div className="space-y-4">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-6 text-neutral-500">
                      No results found
                    </div>
                  ) : (
                    (filteredItems as typeof COLOR_PALETTES).map(palette => (
                      <div 
                        key={palette.id}
                        className="bg-white rounded-lg p-3 border border-neutral-200 hover:shadow-sm transition-shadow"
                      >
                        <p className="text-sm font-medium mb-2">{palette.name}</p>
                        <div className="flex space-x-1">
                          {palette.colors.map((color, i) => (
                            <button
                              key={i}
                              onClick={() => handleItemClick('color', { fill: color })}
                              className="w-full h-10 rounded-md transition-transform hover:scale-105 active:scale-95"
                              style={{ backgroundColor: color }}
                              title={`Add ${color} to canvas`}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                // Furniture and texture items
                <div className="grid grid-cols-2 gap-3">
                  {filteredItems.length === 0 ? (
                    <div className="col-span-2 text-center py-6 text-neutral-500">
                      No results found
                    </div>
                  ) : (
                    (filteredItems as (typeof FURNITURE_ITEMS | typeof TEXTURES)).map(item => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-lg overflow-hidden border border-neutral-200 cursor-pointer"
                        onClick={() => handleItemClick(activeTab === 'furniture' ? 'furniture' : 'texture', item)}
                      >
                        <div className="aspect-square overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium truncate">{item.name}</p>
                          <p className="text-xs text-neutral-500 capitalize">{item.category}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ElementLibrary;
