
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ExpandedFurnitureLibrary from './ExpandedFurnitureLibrary';
import RoomWalls from './RoomWalls';
import FurnitureItem from './FurnitureItem';
import PropertyPanel from './PropertyPanel';
import MaterialEditor from './MaterialEditor';
import CameraControls from './CameraControls';
import EnhancedGrid from './EnhancedGrid';
import FloorPlanConverter from './FloorPlanConverter';
import { Grid3X3, Eye, EyeOff, RotateCw, Move, Scale, Home, FileImage } from 'lucide-react';

export interface FurnitureObject {
  id: string;
  type: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  material: string;
  shape: 'box' | 'cylinder' | 'sphere' | 'complex';
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

interface Room3DProps {
  roomDimensions: {
    width: number;
    length: number;
    height: number;
  };
  onSave: (furniture: FurnitureObject[]) => void;
}

const Room3D = ({ roomDimensions, onSave }: Room3DProps) => {
  const [furnitureItems, setFurnitureItems] = useState<FurnitureObject[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [showMaterialEditor, setShowMaterialEditor] = useState(false);
  const [showFloorPlanConverter, setShowFloorPlanConverter] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [currentFloorPlan, setCurrentFloorPlan] = useState<any>(null);
  const [convertedRoomDimensions, setConvertedRoomDimensions] = useState(roomDimensions);

  const addFurniture = (furnitureData: Partial<FurnitureObject>) => {
    const newItem: FurnitureObject = {
      id: Date.now().toString(),
      type: furnitureData.type || 'generic',
      name: furnitureData.name || 'Furniture Item',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: furnitureData.color || '#8B4513',
      material: furnitureData.material || 'wood',
      shape: furnitureData.shape || 'box',
      dimensions: furnitureData.dimensions || {
        width: 1,
        height: 1,
        depth: 1,
      },
      ...furnitureData,
    };

    setFurnitureItems(prev => [...prev, newItem]);
    setSelectedItem(newItem.id);
  };

  const updateFurniture = (id: string, updates: Partial<FurnitureObject>) => {
    setFurnitureItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteFurniture = (id: string) => {
    setFurnitureItems(prev => prev.filter(item => item.id !== id));
    if (selectedItem === id) {
      setSelectedItem(null);
    }
  };

  const handleFloorPlanImport = (floorPlanData: any) => {
    console.log('Importing floor plan:', floorPlanData);
    setCurrentFloorPlan(floorPlanData);
    
    // Update room dimensions based on the floor plan
    setConvertedRoomDimensions({
      width: floorPlanData.dimensions.width,
      length: floorPlanData.dimensions.length,
      height: floorPlanData.dimensions.height,
    });
    
    // Auto-place furniture based on room types (if rooms are detected)
    if (floorPlanData.rooms && floorPlanData.rooms.length > 0) {
      const autoFurniture: FurnitureObject[] = [];
      
      floorPlanData.rooms.forEach((room: any, index: number) => {
        const roomCenter = {
          x: room.bounds.x + room.bounds.width / 2,
          y: room.bounds.y + room.bounds.height / 2,
        };
        
        // Add basic furniture based on room type
        switch (room.type) {
          case 'living':
            autoFurniture.push({
              id: `auto-sofa-${index}`,
              type: 'sofa',
              name: 'Auto-placed Sofa',
              position: [roomCenter.x - 1, 0, roomCenter.y],
              rotation: [0, 0, 0],
              scale: [1, 1, 1],
              color: '#2D3748',
              material: 'fabric',
              shape: 'complex',
              dimensions: { width: 2.2, height: 0.8, depth: 0.9 },
            });
            break;
          case 'bedroom':
            autoFurniture.push({
              id: `auto-bed-${index}`,
              type: 'bed',
              name: 'Auto-placed Bed',
              position: [roomCenter.x, 0, roomCenter.y],
              rotation: [0, 0, 0],
              scale: [1, 1, 1],
              color: '#F5F5DC',
              material: 'fabric',
              shape: 'complex',
              dimensions: { width: 1.6, height: 0.6, depth: 2.0 },
            });
            break;
          case 'kitchen':
            autoFurniture.push({
              id: `auto-table-${index}`,
              type: 'dining-table',
              name: 'Auto-placed Dining Table',
              position: [roomCenter.x, 0, roomCenter.y],
              rotation: [0, 0, 0],
              scale: [1, 1, 1],
              color: '#654321',
              material: 'wood',
              shape: 'box',
              dimensions: { width: 1.8, height: 0.75, depth: 0.9 },
            });
            break;
        }
      });
      
      setFurnitureItems(autoFurniture);
    }
    
    setShowFloorPlanConverter(false);
  };

  const selectedFurniture = furnitureItems.find(item => item.id === selectedItem);
  const currentDimensions = currentFloorPlan ? convertedRoomDimensions : roomDimensions;

  return (
    <div className="h-screen flex bg-neutral-50 overflow-hidden">
      {/* Enhanced Furniture Library Sidebar */}
      <div className="w-80 bg-white border-r border-neutral-200 flex flex-col shadow-sm flex-shrink-0">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center space-x-2 mb-3">
            <Home className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-neutral-800">Furniture Library</h2>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setShowFloorPlanConverter(true)}
              className="flex items-center justify-center p-3 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm"
            >
              <FileImage className="w-4 h-4 mr-1" />
              2D to 3D
            </button>
            
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`flex items-center justify-center p-3 text-xs rounded-lg transition-colors shadow-sm ${
                showGrid 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              Grid
            </button>
          </div>

          {currentFloorPlan && (
            <div className="p-3 bg-blue-50 rounded-lg mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Home className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Floor Plan Active</span>
              </div>
              <div className="text-xs text-blue-600">
                {currentFloorPlan.rooms?.length || 0} rooms imported
              </div>
              <div className="text-xs text-blue-600">
                {currentDimensions.width}×{currentDimensions.length}×{currentDimensions.height}m
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ExpandedFurnitureLibrary onAddFurniture={addFurniture} />
        </div>
      </div>

      {/* Enhanced 3D Canvas */}
      <div className="flex-1 relative min-w-0 overflow-hidden">
        <div className="w-full h-full">
          <Canvas
            camera={{ 
              position: [12, 10, 12], 
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            shadows
            className="bg-neutral-50"
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'block'
            }}
            gl={{ 
              antialias: true, 
              alpha: false,
              powerPreference: "high-performance",
              preserveDrawingBuffer: true
            }}
            dpr={[1, 2]}
            frameloop="demand"
          >
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={0.8}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-far={50}
              shadow-camera-left={-15}
              shadow-camera-right={15}
              shadow-camera-top={15}
              shadow-camera-bottom={-15}
            />
            
            <Environment preset="apartment" />
            
            {/* Room with updated dimensions */}
            <RoomWalls dimensions={currentDimensions} />
            
            {/* Enhanced Grid */}
            {showGrid && (
              <EnhancedGrid
                size={Math.max(currentDimensions.width, currentDimensions.length) * 1.5}
                divisions={Math.max(currentDimensions.width, currentDimensions.length)}
                showMeasurements={showMeasurements}
                roomDimensions={currentDimensions}
              />
            )}

            {/* Furniture Items with enhanced shapes */}
            {furnitureItems.map((item) => (
              <FurnitureItem
                key={item.id}
                furniture={item}
                isSelected={selectedItem === item.id}
                onClick={() => setSelectedItem(item.id)}
                onUpdate={(updates) => updateFurniture(item.id, updates)}
              />
            ))}

            <CameraControls
              autoRotate={autoRotate}
              minDistance={5}
              maxDistance={30}
              target={[0, 0, 0]}
            />
          </Canvas>
        </div>

        {/* Enhanced Controls Toolbar */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setTransformMode('translate')}
              className={`p-2 rounded transition-colors ${
                transformMode === 'translate' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-neutral-100 hover:bg-neutral-200'
              }`}
              title="Move"
            >
              <Move className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTransformMode('rotate')}
              className={`p-2 rounded transition-colors ${
                transformMode === 'rotate' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-neutral-100 hover:bg-neutral-200'
              }`}
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTransformMode('scale')}
              className={`p-2 rounded transition-colors ${
                transformMode === 'scale' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-neutral-100 hover:bg-neutral-200'
              }`}
              title="Scale"
            >
              <Scale className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowMeasurements(!showMeasurements)}
              className={`p-2 rounded transition-colors ${
                showMeasurements 
                  ? 'bg-green-500 text-white' 
                  : 'bg-neutral-100 hover:bg-neutral-200'
              }`}
              title="Toggle Measurements"
            >
              {showMeasurements ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded transition-colors ${
                autoRotate 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-neutral-100 hover:bg-neutral-200'
              }`}
              title="Auto Rotate"
            >
              <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => onSave(furnitureItems)}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Save Design
          </button>
        </div>

        {/* Room Info */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <div className="text-sm">
            <div className="font-medium text-neutral-700">Room Dimensions</div>
            <div className="text-neutral-500">
              {currentDimensions.width}m × {currentDimensions.length}m × {currentDimensions.height}m
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              {furnitureItems.length} furniture item{furnitureItems.length !== 1 ? 's' : ''}
            </div>
            {currentFloorPlan && (
              <div className="text-xs text-blue-600 mt-1">
                Floor plan: {currentFloorPlan.rooms?.length || 0} rooms detected
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Panel */}
      {selectedFurniture && (
        <div className="w-80 bg-white border-l border-neutral-200 shadow-sm flex-shrink-0">
          <PropertyPanel
            furniture={selectedFurniture}
            onUpdate={(updates) => updateFurniture(selectedFurniture.id, updates)}
            onDelete={() => deleteFurniture(selectedFurniture.id)}
          />
        </div>
      )}

      {/* Enhanced Floor Plan Converter Modal */}
      <AnimatePresence>
        {showFloorPlanConverter && (
          <FloorPlanConverter
            onImport={handleFloorPlanImport}
            onClose={() => setShowFloorPlanConverter(false)}
          />
        )}
      </AnimatePresence>

      {/* Material Editor Modal */}
      {showMaterialEditor && selectedFurniture && (
        <MaterialEditor
          furniture={selectedFurniture}
          onUpdate={(updates) => updateFurniture(selectedFurniture.id, updates)}
          onClose={() => setShowMaterialEditor(false)}
        />
      )}
    </div>
  );
};

export default Room3D;
