import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, Bookmark, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for inspiration items
const INSPIRATION_ITEMS = [
  {
    id: '1',
    title: 'Scandinavian Living Room',
    image: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=800',
    designer: 'Emma Jensen',
    likes: 245,
    saved: 128,
    tags: ['Scandinavian', 'Minimalist', 'Living Room'],
    isSaved: false,
    isLiked: false,
  },
  {
    id: '2',
    title: 'Boho Bedroom Retreat',
    image: 'https://images.pexels.com/photos/1374125/pexels-photo-1374125.jpeg?auto=compress&cs=tinysrgb&w=800',
    designer: 'Maya Rodriguez',
    likes: 187,
    saved: 94,
    tags: ['Bohemian', 'Bedroom', 'Eclectic'],
    isSaved: false,
    isLiked: false,
  },
  {
    id: '3',
    title: 'Modern Minimalist Kitchen',
    image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800',
    designer: 'Alex Chen',
    likes: 320,
    saved: 156,
    tags: ['Modern', 'Kitchen', 'Minimalist'],
    isSaved: false,
    isLiked: false,
  },
  {
    id: '4',
    title: 'Industrial Home Office',
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800',
    designer: 'Jake Wilson',
    likes: 145,
    saved: 76,
    tags: ['Industrial', 'Office', 'Modern'],
    isSaved: false,
    isLiked: false,
  },
  {
    id: '5',
    title: 'Mid-Century Dining Room',
    image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
    designer: 'Sarah Thompson',
    likes: 210,
    saved: 112,
    tags: ['Mid-Century', 'Dining Room', 'Retro'],
    isSaved: false,
    isLiked: false,
  },
  {
    id: '6',
    title: 'Coastal Bathroom Design',
    image: 'https://images.pexels.com/photos/6585598/pexels-photo-6585598.jpeg?auto=compress&cs=tinysrgb&w=800',
    designer: 'Michael Stevens',
    likes: 178,
    saved: 87,
    tags: ['Coastal', 'Bathroom', 'Beach'],
    isSaved: false,
    isLiked: false,
  },
  {
    id: '7',
    title: 'Rustic Mountain Cabin',
    image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
    designer: 'Daniel Clark',
    likes: 289,
    saved: 143,
    tags: ['Rustic', 'Cabin', 'Mountain'],
    isSaved: false,
    isLiked: false,
  },
  {
    id: '8',
    title: 'Urban Loft Apartment',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
    designer: 'Rebecca Foster',
    likes: 256,
    saved: 134,
    tags: ['Urban', 'Loft', 'Contemporary'],
    isSaved: false,
    isLiked: false,
  },
];

// All unique tags
const ALL_TAGS = Array.from(
  new Set(INSPIRATION_ITEMS.flatMap(item => item.tags))
).sort();

const InspirationWall = () => {
  const [items, setItems] = useState(INSPIRATION_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter items based on search and tags
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => item.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Toggle like
  const toggleLike = (id: string) => {
    setItems(items.map(item => 
      item.id === id 
        ? { 
            ...item, 
            isLiked: !item.isLiked, 
            likes: item.isLiked ? item.likes - 1 : item.likes + 1 
          } 
        : item
    ));
  };

  // Toggle save
  const toggleSave = (id: string) => {
    setItems(items.map(item => 
      item.id === id 
        ? { 
            ...item, 
            isSaved: !item.isSaved, 
            saved: item.isSaved ? item.saved - 1 : item.saved + 1 
          } 
        : item
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inspiration Gallery</h1>
          <p className="text-neutral-600">Browse curated designs to inspire your next project</p>
        </div>
        <Link 
          to="/dashboard" 
          className="btn btn-primary mt-4 md:mt-0"
        >
          Create Your Own
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
      
      {/* Search and filter controls */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search designs, styles, designers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 input"
            />
          </div>
          
          <div className="flex md:w-auto">
            <button 
              className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTags.includes(tag) 
                  ? 'bg-primary-100 text-primary-700 font-medium' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-neutral-600 mb-6">
              We couldn't find any designs matching your search criteria. Try adjusting your filters or search query.
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card group overflow-hidden"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleLike(item.id)}
                      className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                        item.isLiked 
                          ? 'bg-primary-500/80 text-white' 
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-white' : ''}`} />
                    </button>
                    <button 
                      onClick={() => toggleSave(item.id)}
                      className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                        item.isSaved 
                          ? 'bg-primary-500/80 text-white' 
                          : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${item.isSaved ? 'fill-white' : ''}`} />
                    </button>
                    <button className="p-2 backdrop-blur-sm rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white">
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-neutral-600 text-sm mb-3">By {item.designer}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <Bookmark className="w-4 h-4 mr-1" />
                    <span>{item.saved}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InspirationWall;