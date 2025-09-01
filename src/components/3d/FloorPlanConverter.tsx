
import { useState, useRef } from 'react';
import { Upload, FileImage, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloorPlanConverterProps {
  onImport: (floorPlan: FloorPlanData) => void;
  onClose: () => void;
}

interface FloorPlanData {
  file: File;
  dimensions: { width: number; length: number; height: number };
  scale: number;
  rooms: Room[];
  walls: Wall[];
}

interface Room {
  id: string;
  name: string;
  type: 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'dining' | 'office' | 'guest' | 'utility';
  bounds: { x: number; y: number; width: number; height: number };
}

interface Wall {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  thickness: number;
  height: number;
}

const FloorPlanConverter = ({ onImport, onClose }: FloorPlanConverterProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'dimensions' | 'rooms' | 'preview'>('upload');
  const [dimensions, setDimensions] = useState({ width: 10, length: 12, height: 3 });
  const [scale, setScale] = useState(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string>('living');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const roomTypes = [
    { value: 'living', label: 'Living Room', color: '#3B82F6' },
    { value: 'kitchen', label: 'Kitchen', color: '#EF4444' },
    { value: 'bedroom', label: 'Bedroom', color: '#10B981' },
    { value: 'bathroom', label: 'Bathroom', color: '#8B5CF6' },
    { value: 'dining', label: 'Dining Room', color: '#F59E0B' },
    { value: 'office', label: 'Office', color: '#6B7280' },
    { value: 'guest', label: 'Guest Room', color: '#EC4899' },
    { value: 'utility', label: 'Utility', color: '#14B8A6' },
  ];

  const handleFileSelect = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or PDF file');
      return;
    }

    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const addRoom = (type: string, bounds: { x: number; y: number; width: number; height: number }) => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: `${roomTypes.find(r => r.value === type)?.label} ${rooms.filter(r => r.type === type).length + 1}`,
      type: type as Room['type'],
      bounds,
    };
    setRooms([...rooms, newRoom]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || step !== 'rooms') return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / canvas.offsetWidth) * dimensions.width;
    const y = ((e.clientY - rect.top) / canvas.offsetHeight) * dimensions.length;
    
    // Add a room at clicked position
    addRoom(currentRoom, {
      x: Math.max(0, x - 1.5),
      y: Math.max(0, y - 1.5),
      width: 3,
      height: 3,
    });
  };

  const generateWalls = () => {
    const newWalls: Wall[] = [];
    
    // Generate perimeter walls
    newWalls.push(
      {
        id: 'wall-north',
        start: { x: 0, y: 0 },
        end: { x: dimensions.width, y: 0 },
        thickness: 0.2,
        height: dimensions.height,
      },
      {
        id: 'wall-east',
        start: { x: dimensions.width, y: 0 },
        end: { x: dimensions.width, y: dimensions.length },
        thickness: 0.2,
        height: dimensions.height,
      },
      {
        id: 'wall-south',
        start: { x: dimensions.width, y: dimensions.length },
        end: { x: 0, y: dimensions.length },
        thickness: 0.2,
        height: dimensions.height,
      },
      {
        id: 'wall-west',
        start: { x: 0, y: dimensions.length },
        end: { x: 0, y: 0 },
        thickness: 0.2,
        height: dimensions.height,
      }
    );
    
    setWalls(newWalls);
  };

  const handleImport = () => {
    if (!selectedFile) return;
    
    const floorPlanData: FloorPlanData = {
      file: selectedFile,
      dimensions,
      scale,
      rooms,
      walls,
    };
    
    onImport(floorPlanData);
  };

  const nextStep = () => {
    if (step === 'upload' && selectedFile) {
      setStep('dimensions');
    } else if (step === 'dimensions') {
      generateWalls();
      setStep('rooms');
    } else if (step === 'rooms') {
      setStep('preview');
    }
  };

  const prevStep = () => {
    if (step === 'dimensions') setStep('upload');
    else if (step === 'rooms') setStep('dimensions');
    else if (step === 'preview') setStep('rooms');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">2D to 3D Floor Plan Converter</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mb-8">
          {['Upload', 'Dimensions', 'Room Layout', 'Preview'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                ['upload', 'dimensions', 'rooms', 'preview'].indexOf(step) >= index
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 text-neutral-500'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                ['upload', 'dimensions', 'rooms', 'preview'].indexOf(step) >= index
                  ? 'text-neutral-700'
                  : 'text-neutral-400'
              }`}>
                {stepName}
              </span>
              {index < 3 && <div className="w-8 h-0.5 bg-neutral-200 ml-4" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 'upload' && (
          <div>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-neutral-300 hover:border-neutral-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  {preview && (
                    <img 
                      src={preview} 
                      alt="Floor plan preview" 
                      className="max-h-64 mx-auto rounded border"
                    />
                  )}
                  <div className="flex items-center justify-center space-x-2">
                    <FileImage className="w-5 h-5 text-green-500" />
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    File ready for processing. Click Next to continue.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-neutral-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium">Upload your 2D floor plan</p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Support for JPG, PNG, PDF, and CAD files
                    </p>
                  </div>
                  <div className="text-xs text-neutral-400">
                    Drag and drop or click to browse
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'dimensions' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-4">Set Room Dimensions</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Width (meters)
                  </label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="3"
                    max="50"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Length (meters)
                  </label>
                  <input
                    type="number"
                    value={dimensions.length}
                    onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="3"
                    max="50"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Height (meters)
                  </label>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => setDimensions({ ...dimensions, height: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="2.2"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Scale Factor
              </label>
              <input
                type="number"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value) || 1)}
                className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="0.1"
                max="10"
                step="0.1"
              />
              <p className="text-sm text-neutral-500 mt-1">
                Adjust this value to match your floor plan's scale
              </p>
            </div>

            {preview && (
              <div className="border rounded-lg p-4">
                <img 
                  src={preview} 
                  alt="Floor plan" 
                  className="w-full max-h-64 object-contain rounded"
                />
              </div>
            )}
          </div>
        )}

        {step === 'rooms' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-4">Define Room Layout</h4>
              <p className="text-sm text-neutral-600 mb-4">
                Click on the canvas to place rooms. Select room type from the options below.
              </p>
              
              <div className="grid grid-cols-4 gap-2 mb-4">
                {roomTypes.map(room => (
                  <button
                    key={room.value}
                    onClick={() => setCurrentRoom(room.value)}
                    className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                      currentRoom === room.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: room.color }}
                    />
                    <span>{room.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                onClick={handleCanvasClick}
                className="w-full h-64 bg-neutral-50 cursor-crosshair"
                style={{
                  backgroundImage: preview ? `url(${preview})` : 'none',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            </div>

            {rooms.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Added Rooms ({rooms.length})</h5>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {rooms.map(room => (
                    <div key={room.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: roomTypes.find(r => r.value === room.type)?.color }}
                        />
                        <span className="text-sm">{room.name}</span>
                      </div>
                      <button
                        onClick={() => setRooms(rooms.filter(r => r.id !== room.id))}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-4">Preview & Convert</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-2">Floor Plan Summary</h5>
                  <div className="space-y-2 text-sm">
                    <div>Dimensions: {dimensions.width}m × {dimensions.length}m × {dimensions.height}m</div>
                    <div>Scale Factor: {scale}x</div>
                    <div>Total Rooms: {rooms.length}</div>
                    <div>Wall Segments: {walls.length}</div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-2">Room Breakdown</h5>
                  <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                    {roomTypes.map(type => {
                      const count = rooms.filter(r => r.type === type.value).length;
                      return count > 0 ? (
                        <div key={type.value} className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: type.color }}
                          />
                          <span>{type.label}: {count}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>

            {preview && (
              <div className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">Original Floor Plan</h5>
                <img 
                  src={preview} 
                  alt="Floor plan" 
                  className="w-full max-h-48 object-contain rounded"
                />
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={step === 'upload' ? onClose : prevStep}
            className="px-6 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            {step === 'upload' ? 'Cancel' : 'Back'}
          </button>
          
          <button
            onClick={step === 'preview' ? handleImport : nextStep}
            disabled={step === 'upload' && !selectedFile}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {step === 'preview' ? 'Convert to 3D' : 'Next'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FloorPlanConverter;
