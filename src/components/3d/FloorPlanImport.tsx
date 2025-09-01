
import { useState, useRef } from 'react';
import { Upload, FileImage, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloorPlanImportProps {
  onImport: (file: File, dimensions?: { width: number; length: number }) => void;
  onClose: () => void;
}

const FloorPlanImport = ({ onImport, onClose }: FloorPlanImportProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 6, length: 8 });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile, dimensions);
    }
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
        className="bg-white rounded-xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Import Floor Plan</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File upload area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
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
            <div className="space-y-3">
              {preview && (
                <img 
                  src={preview} 
                  alt="Floor plan preview" 
                  className="max-h-32 mx-auto rounded"
                />
              )}
              <div className="flex items-center justify-center space-x-2">
                <FileImage className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
              <div>
                <p className="text-sm font-medium">Upload floor plan</p>
                <p className="text-xs text-neutral-500">JPG, PNG, or PDF up to 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Dimensions input */}
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-medium">Room Dimensions (meters)</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-600 mb-1">Width</label>
              <input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="1"
                max="50"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-600 mb-1">Length</label>
              <input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="1"
                max="50"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedFile}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Import
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FloorPlanImport;
