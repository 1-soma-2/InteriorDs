
import { X } from 'lucide-react';
import { FurnitureObject } from './Room3D';

interface MaterialEditorProps {
  furniture: FurnitureObject;
  onUpdate: (updates: Partial<FurnitureObject>) => void;
  onClose: () => void;
}

const MaterialEditor = ({ furniture, onUpdate, onClose }: MaterialEditorProps) => {
  const materialPresets = [
    {
      name: 'Oak Wood',
      material: 'wood',
      color: '#8B4513',
      roughness: 0.8,
      metalness: 0.1,
    },
    {
      name: 'Dark Walnut',
      material: 'wood',
      color: '#654321',
      roughness: 0.9,
      metalness: 0.0,
    },
    {
      name: 'Chrome Metal',
      material: 'metal',
      color: '#C0C0C0',
      roughness: 0.2,
      metalness: 0.9,
    },
    {
      name: 'Black Metal',
      material: 'metal',
      color: '#2D3748',
      roughness: 0.4,
      metalness: 0.8,
    },
    {
      name: 'Blue Fabric',
      material: 'fabric',
      color: '#3182CE',
      roughness: 0.9,
      metalness: 0.0,
    },
    {
      name: 'Gray Fabric',
      material: 'fabric',
      color: '#4A5568',
      roughness: 0.9,
      metalness: 0.0,
    },
    {
      name: 'Brown Leather',
      material: 'leather',
      color: '#8B4513',
      roughness: 0.6,
      metalness: 0.1,
    },
    {
      name: 'Black Leather',
      material: 'leather',
      color: '#1A202C',
      roughness: 0.5,
      metalness: 0.1,
    },
    {
      name: 'Clear Glass',
      material: 'glass',
      color: '#F7FAFC',
      roughness: 0.1,
      metalness: 0.0,
    },
    {
      name: 'Tinted Glass',
      material: 'glass',
      color: '#4A5568',
      roughness: 0.1,
      metalness: 0.0,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold">Material Editor</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Current: {furniture.name}
              </label>
              <div className="text-sm text-neutral-500">
                Material: {furniture.material} | Color: {furniture.color}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-700 mb-3">
                Material Presets
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {materialPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => onUpdate({
                      material: preset.material,
                      color: preset.color,
                    })}
                    className="p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded border border-neutral-300"
                        style={{ backgroundColor: preset.color }}
                      />
                      <div>
                        <div className="text-sm font-medium">{preset.name}</div>
                        <div className="text-xs text-neutral-500 capitalize">
                          {preset.material}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-neutral-700 mb-3">
                Custom Material
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">
                    Material Type
                  </label>
                  <select
                    value={furniture.material}
                    onChange={(e) => onUpdate({ material: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="wood">Wood</option>
                    <option value="metal">Metal</option>
                    <option value="fabric">Fabric</option>
                    <option value="leather">Leather</option>
                    <option value="glass">Glass</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-neutral-500 mb-1">
                    Color
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={furniture.color}
                      onChange={(e) => onUpdate({ color: e.target.value })}
                      className="w-12 h-10 border border-neutral-300 rounded"
                    />
                    <input
                      type="text"
                      value={furniture.color}
                      onChange={(e) => onUpdate({ color: e.target.value })}
                      className="flex-1 p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="w-full bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialEditor;
