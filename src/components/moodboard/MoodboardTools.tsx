import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Copy, 
  Type, 
  PaintBucket, 
  Download, 
  Share2, 
  Undo, 
  Redo,
  Save,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Lock,
  Unlock
} from 'lucide-react';

interface MoodboardToolsProps {
  selectedId: string | null;
  onAddText: () => void;
  onAddColor: () => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onMoveForward: () => void;
  onMoveBackward: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoom: number;
}

const MoodboardTools = ({
  selectedId,
  onAddText,
  onAddColor,
  onDeleteSelected,
  onDuplicateSelected,
  onMoveForward,
  onMoveBackward,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  zoom
}: MoodboardToolsProps) => {
  const [isRotateLocked, setIsRotateLocked] = useState(false);
  
  return (
    <div className="flex flex-col h-full">
      {/* Top tools */}
      <div className="p-3 border-b border-neutral-200">
        <div className="flex justify-between">
          <div className="flex space-x-1">
            <button 
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-lg border ${!canUndo ? 'border-neutral-200 text-neutral-300 cursor-not-allowed' : 'border-neutral-200 text-neutral-500 hover:bg-neutral-100'}`}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button 
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2 rounded-lg border ${!canRedo ? 'border-neutral-200 text-neutral-300 cursor-not-allowed' : 'border-neutral-200 text-neutral-500 hover:bg-neutral-100'}`}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex space-x-1">
            <button 
              onClick={onSave}
              className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100"
              title="Save moodboard"
            >
              <Save className="w-4 h-4" />
            </button>
            <button 
              className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100"
              title="Download as image"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              className="p-2 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-100"
              title="Share moodboard"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main tools */}
      <div className="flex-grow overflow-y-auto p-3 space-y-5">
        {/* Element controls */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-neutral-700">Add Elements</h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={onAddText}
              className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <Type className="w-5 h-5 text-neutral-600" />
              <span className="mt-1 text-xs text-neutral-600">Text</span>
            </button>
            <button 
              onClick={onAddColor}
              className="flex flex-col items-center justify-center p-3 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <PaintBucket className="w-5 h-5 text-neutral-600" />
              <span className="mt-1 text-xs text-neutral-600">Color</span>
            </button>
          </div>
        </div>
        
        {/* Selected element controls */}
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-2"
          >
            <h3 className="text-sm font-medium text-neutral-700">Element Controls</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={onDuplicateSelected}
                  className="flex items-center justify-center p-2 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <Copy className="w-4 h-4 mr-1.5 text-neutral-600" />
                  <span className="text-xs text-neutral-600">Duplicate</span>
                </button>
                <button 
                  onClick={onDeleteSelected}
                  className="flex items-center justify-center p-2 bg-white rounded-lg border border-neutral-200 hover:border-error-300 hover:bg-error-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1.5 text-neutral-600" />
                  <span className="text-xs text-neutral-600">Delete</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={onMoveForward}
                  className="flex items-center justify-center p-2 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <Layers className="w-4 h-4 mr-1.5 text-neutral-600" />
                  <ChevronUp className="w-3 h-3 text-neutral-600" />
                </button>
                <button 
                  onClick={onMoveBackward}
                  className="flex items-center justify-center p-2 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <Layers className="w-4 h-4 mr-1.5 text-neutral-600" />
                  <ChevronDown className="w-3 h-3 text-neutral-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setIsRotateLocked(!isRotateLocked)}
                  className={`flex items-center justify-center p-2 rounded-lg border transition-colors ${
                    isRotateLocked 
                      ? 'bg-primary-50 border-primary-300 text-primary-600' 
                      : 'bg-white border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  {isRotateLocked ? (
                    <>
                      <Lock className="w-4 h-4 mr-1.5" />
                      <span className="text-xs">Locked</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-1.5 text-neutral-600" />
                      <span className="text-xs text-neutral-600">Unlock</span>
                    </>
                  )}
                </button>
                <button 
                  className="flex items-center justify-center p-2 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5 text-neutral-600" />
                  <span className="text-xs text-neutral-600">Reset</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Zoom controls */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-neutral-700">Zoom</h3>
          <div className="flex items-center justify-between bg-white rounded-lg border border-neutral-200 p-1">
            <button 
              onClick={onZoomOut}
              className="p-1.5 rounded hover:bg-neutral-100 text-neutral-600"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <div className="text-xs font-medium text-neutral-600">
              {Math.round(zoom * 100)}%
            </div>
            
            <button 
              onClick={onZoomIn}
              className="p-1.5 rounded hover:bg-neutral-100 text-neutral-600"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodboardTools;