
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ChevronLeft, PanelLeft, PanelRight, Expand, Minimize, Ruler } from 'lucide-react';

// Components
import MoodboardCanvas from '../components/moodboard/MoodboardCanvas';
import MoodboardTools from '../components/moodboard/MoodboardTools';
import ElementLibrary from '../components/moodboard/ElementLibrary';
import RoomMeasurements, { RoomMeasurements as RoomMeasurementsType } from '../components/moodboard/RoomMeasurements';

// Types
import { MoodboardElement, ImageElement, TextElement, ColorSwatchElement } from '../types/moodboard';

const MoodboardEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [elements, setElements] = useState<MoodboardElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<MoodboardElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasSize] = useState({ width: 800, height: 600 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [moodboardName, setMoodboardName] = useState('Untitled Moodboard');
  const [showMeasurements, setShowMeasurements] = useState(id === 'new');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Set up the canvas when component mounts
  useEffect(() => {
    // Load moodboard data if editing an existing one
    if (id && id !== 'new') {
      // In a real app, this would fetch data from an API
      // For now, let's simulate loading with sample data
      const sampleData: MoodboardElement[] = [
        {
          id: '1',
          type: 'image',
          src: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=300',
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          rotation: 0,
          isDragging: false,
          zIndex: 1
        } as ImageElement,
        {
          id: '2',
          type: 'color',
          x: 400,
          y: 200,
          width: 100,
          height: 100,
          fill: '#94A684',
          rotation: 0,
          isDragging: false,
          zIndex: 2
        } as ColorSwatchElement,
        {
          id: '3',
          type: 'text',
          text: 'Modern Living Room',
          x: 150,
          y: 300,
          fontSize: 24,
          fontFamily: 'Inter',
          fill: '#333333',
          width: 200,
          height: 30,
          rotation: 0,
          isDragging: false,
          zIndex: 3
        } as TextElement
      ];
      
      setElements(sampleData);
      setMoodboardName('Modern Living Room');
      
      // Initialize history
      setHistory([sampleData]);
      setHistoryIndex(0);
    } else {
      // For a new moodboard, initialize with empty elements
      setHistory([[]]);
      setHistoryIndex(0);
    }
  }, [id]);

  // Update history when elements change
  const updateHistory = useCallback((newElements: MoodboardElement[]) => {
    // Remove all history entries after current index
    const newHistory = history.slice(0, historyIndex + 1);
    
    // Add new state to history
    newHistory.push([...newElements]);
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  }, [history, historyIndex]);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  }, [history, historyIndex]);

  // Generate design based on room measurements
  const handleGenerateDesign = async (measurements: RoomMeasurementsType) => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a layout based on measurements
    const newElements: MoodboardElement[] = [];
    
    // Add room dimensions text
    newElements.push({
      id: Date.now().toString(),
      type: 'text',
      text: `${measurements.width}' × ${measurements.length}' ${measurements.primaryUse}`,
      x: 50,
      y: 30,
      fontSize: 24,
      fontFamily: 'Inter',
      fill: '#333333',
      width: 300,
      height: 30,
      rotation: 0,
      isDragging: false,
      zIndex: 1
    } as TextElement);
    
    // Add style text
    newElements.push({
      id: (Date.now() + 1).toString(),
      type: 'text',
      text: `Style: ${measurements.style}`,
      x: 50,
      y: 70,
      fontSize: 18,
      fontFamily: 'Inter',
      fill: '#666666',
      width: 200,
      height: 24,
      rotation: 0,
      isDragging: false,
      zIndex: 2
    } as TextElement);
    
    // Add some furniture based on room type
    const furnitureImages = {
      'Living Room': [
        'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=300'
      ],
      'Bedroom': [
        'https://images.pexels.com/photos/775219/pexels-photo-775219.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/2249051/pexels-photo-2249051.jpeg?auto=compress&cs=tinysrgb&w=300'
      ],
      'Home Office': [
        'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=300',
        'https://images.pexels.com/photos/2528118/pexels-photo-2528118.jpeg?auto=compress&cs=tinysrgb&w=300'
      ]
    };
    
    const images = furnitureImages[measurements.primaryUse as keyof typeof furnitureImages] || furnitureImages['Living Room'];
    
    images.forEach((src, index) => {
      newElements.push({
        id: (Date.now() + index + 2).toString(),
        type: 'image',
        src,
        x: 100 + index * 250,
        y: 150,
        width: 200,
        height: 150,
        rotation: 0,
        isDragging: false,
        zIndex: index + 3
      } as ImageElement);
    });
    
    // Add color scheme based on style
    const styleColors = {
      'Modern': ['#2C3E50', '#E74C3C', '#ECF0F1'],
      'Scandinavian': ['#FFFFFF', '#808080', '#000000'],
      'Industrial': ['#34495E', '#95A5A6', '#7F8C8D'],
      'Minimalist': ['#FFFFFF', '#BFBFBF', '#4A4A4A']
    };
    
    const colors = styleColors[measurements.style as keyof typeof styleColors] || styleColors['Modern'];
    
    colors.forEach((color, index) => {
      newElements.push({
        id: (Date.now() + index + 5).toString(),
        type: 'color',
        x: 50 + index * 120,
        y: 350,
        width: 100,
        height: 100,
        fill: color,
        rotation: 0,
        isDragging: false,
        zIndex: index + 6
      } as ColorSwatchElement);
    });
    
    setElements(newElements);
    updateHistory(newElements);
    setMoodboardName(`${measurements.style} ${measurements.primaryUse}`);
    setIsGenerating(false);
    setShowMeasurements(false);
  };

  // Add an element from the library
  const handleAddElement = (type: string, item: any) => {
    let newElement: MoodboardElement;
    
    if (type === 'furniture' || type === 'texture') {
      newElement = {
        id: Date.now().toString(),
        type: 'image',
        src: item.image,
        x: Math.random() * (canvasSize.width / 2) + 100,
        y: Math.random() * (canvasSize.height / 2) + 100,
        width: 200,
        height: 150,
        rotation: 0,
        isDragging: false,
        zIndex: elements.length + 1,
      } as ImageElement;
    } else if (type === 'color') {
      newElement = {
        id: Date.now().toString(),
        type: 'color',
        x: Math.random() * (canvasSize.width / 2) + 100,
        y: Math.random() * (canvasSize.height / 2) + 100,
        width: 100,
        height: 100,
        fill: item.fill || '#94A684',
        rotation: 0,
        isDragging: false,
        zIndex: elements.length + 1,
      } as ColorSwatchElement;
    } else {
      newElement = {
        id: Date.now().toString(),
        type: 'text',
        text: 'Double click to edit',
        x: Math.random() * (canvasSize.width / 2) + 100,
        y: Math.random() * (canvasSize.height / 2) + 100,
        fontSize: 24,
        fontFamily: 'Inter',
        fill: '#333333',
        width: 200,
        height: 30,
        rotation: 0,
        isDragging: false,
        zIndex: elements.length + 1,
      } as TextElement;
    }
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    updateHistory(newElements);
  };

  // Add text element
  const handleAddText = () => {
    const newElement: TextElement = {
      id: Date.now().toString(),
      type: 'text',
      text: 'Double click to edit',
      x: canvasSize.width / 2 - 100,
      y: canvasSize.height / 2 - 15,
      fontSize: 24,
      fontFamily: 'Inter',
      fill: '#333333',
      width: 200,
      height: 30,
      rotation: 0,
      isDragging: false,
      zIndex: elements.length + 1,
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    updateHistory(newElements);
    setSelectedId(newElement.id);
  };

  // Add color swatch
  const handleAddColor = () => {
    const colors = ['#94A684', '#E4DEBE', '#B09E82', '#7D9D9C', '#E4C988', '#F97B8B'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newElement: ColorSwatchElement = {
      id: Date.now().toString(),
      type: 'color',
      x: canvasSize.width / 2 - 50,
      y: canvasSize.height / 2 - 50,
      width: 100,
      height: 100,
      fill: randomColor,
      rotation: 0,
      isDragging: false,
      zIndex: elements.length + 1,
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    updateHistory(newElements);
    setSelectedId(newElement.id);
  };

  // Delete selected element
  const handleDeleteSelected = () => {
    if (selectedId) {
      const newElements = elements.filter(el => el.id !== selectedId);
      setElements(newElements);
      updateHistory(newElements);
      setSelectedId(null);
    }
  };

  // Duplicate selected element
  const handleDuplicateSelected = () => {
    if (selectedId) {
      const selectedElement = elements.find(el => el.id === selectedId);
      if (selectedElement) {
        const newElement = {
          ...selectedElement,
          id: Date.now().toString(),
          x: selectedElement.x + 20,
          y: selectedElement.y + 20,
          zIndex: elements.length + 1,
        };
        
        const newElements = [...elements, newElement];
        setElements(newElements);
        updateHistory(newElements);
        setSelectedId(newElement.id);
      }
    }
  };

  // Move selected element forward in z-index
  const handleMoveForward = () => {
    if (selectedId) {
      const newElements = [...elements];
      const selectedIndex = newElements.findIndex(el => el.id === selectedId);
      
      if (selectedIndex < newElements.length - 1) {
        const selectedElement = newElements[selectedIndex];
        const nextElement = newElements[selectedIndex + 1];
        
        // Swap z-indices
        const tempZIndex = selectedElement.zIndex;
        selectedElement.zIndex = nextElement.zIndex;
        nextElement.zIndex = tempZIndex;
        
        setElements(newElements);
        updateHistory(newElements);
      }
    }
  };

  // Move selected element backward in z-index
  const handleMoveBackward = () => {
    if (selectedId) {
      const newElements = [...elements];
      const selectedIndex = newElements.findIndex(el => el.id === selectedId);
      
      if (selectedIndex > 0) {
        const selectedElement = newElements[selectedIndex];
        const prevElement = newElements[selectedIndex - 1];
        
        // Swap z-indices
        const tempZIndex = selectedElement.zIndex;
        selectedElement.zIndex = prevElement.zIndex;
        prevElement.zIndex = tempZIndex;
        
        setElements(newElements);
        updateHistory(newElements);
      }
    }
  };

  // Handle save
  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving moodboard:', elements);
    // Show success message
    alert('Moodboard saved successfully!');
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setIsLeftPanelOpen(false);
      setIsRightPanelOpen(false);
    } else {
      setIsLeftPanelOpen(true);
      setIsRightPanelOpen(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-100">
      {/* Top bar */}
      <div className="bg-white border-b border-neutral-200 py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-4 text-neutral-500 hover:text-neutral-700">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <input
              type="text"
              value={moodboardName}
              onChange={(e) => setMoodboardName(e.target.value)}
              className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary-500 px-2 py-1 rounded"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMeasurements(true)}
              className="btn btn-outline flex items-center"
            >
              <Ruler className="w-4 h-4 mr-2" />
              Room Measurements
            </button>
            
            <button 
              onClick={toggleFullscreen}
              className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Expand className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isLeftPanelOpen 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <PanelLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isRightPanelOpen 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <PanelRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleSave}
              className="btn btn-primary flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
      
      {/* Main editor area */}
      <div className="flex-grow flex overflow-hidden">
        {/* Left panel - Element library */}
        <motion.div
          initial={{ width: 300 }}
          animate={{ 
            width: isLeftPanelOpen ? 300 : 0,
            opacity: isLeftPanelOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="bg-white border-r border-neutral-200 overflow-hidden"
        >
          {isLeftPanelOpen && (
            <ElementLibrary onAddElement={handleAddElement} />
          )}
        </motion.div>
        
        {/* Center - Canvas */}
        <div className="flex-grow p-6 overflow-auto bg-neutral-100 flex items-center justify-center relative">
          <div 
            style={{ 
              transform: `scale(${zoom})`,
              transition: 'transform 0.2s ease-out',
            }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <MoodboardCanvas
              elements={elements}
              setElements={setElements}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              stageWidth={canvasSize.width}
              stageHeight={canvasSize.height}
            />
          </div>

          {/* Room measurements modal */}
          <AnimatePresence>
            {showMeasurements && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center p-6"
              >
                {isGenerating ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl p-8 text-center"
                  >
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold mb-2">Generating Your Design</h3>
                    <p className="text-neutral-600">Please wait while we create your perfect room layout...</p>
                  </motion.div>
                ) : (
                  <RoomMeasurements
                    onGenerate={handleGenerateDesign}
                    onClose={() => setShowMeasurements(false)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Right panel - Tools */}
        <motion.div
          initial={{ width: 250 }}
          animate={{ 
            width: isRightPanelOpen ? 250 : 0,
            opacity: isRightPanelOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="bg-white border-l border-neutral-200 overflow-hidden"
        >
          {isRightPanelOpen && (
            <MoodboardTools
              selectedId={selectedId}
              onAddText={handleAddText}
              onAddColor={handleAddColor}
              onDeleteSelected={handleDeleteSelected}
              onDuplicateSelected={handleDuplicateSelected}
              onMoveForward={handleMoveForward}
              onMoveBackward={handleMoveBackward}
              onSave={handleSave}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              zoom={zoom}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MoodboardEditor;
