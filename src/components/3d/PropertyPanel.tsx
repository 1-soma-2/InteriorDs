
import { useState } from 'react';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { FurnitureObject } from './Room3D';

interface PropertyPanelProps {
  furniture: FurnitureObject;
  onUpdate: (updates: Partial<FurnitureObject>) => void;
  onDelete: () => void;
}

const PropertyPanel = ({ furniture, onUpdate, onDelete }: PropertyPanelProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const materials = [
    { value: 'wood', label: 'Wood' },
    { value: 'metal', label: 'Metal' },
    { value: 'fabric', label: 'Fabric' },
    { value: 'leather', label: 'Leather' },
    { value: 'glass', label: 'Glass' },
  ];

  const colors = [
    '#8B4513', '#654321', '#D2691E', '#CD853F', '#A0522D', // Browns
    '#4A5568', '#2D3748', '#1A202C', '#171923', '#000000', // Grays/Blacks
    '#FFFFFF', '#F7FAFC', '#EDF2F7', '#E2E8F0', '#CBD5E0', // Whites/Light grays
    '#3182CE', '#2B6CB0', '#2C5282', '#2A4365', '#1A365D', // Blues
    '#38A169', '#2F855A', '#276749', '#22543D', '#1C4532', // Greens
    '#E53E3E', '#C53030', '#9C1C1C', '#742A2A', '#553C2C', // Reds
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Properties</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="p-1 rounded hover:bg-neutral-100"
              title={isVisible ? 'Hide' : 'Show'}
            >
              {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded hover:bg-error-100 text-error-600"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={furniture.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Position
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">X</label>
              <input
                type="number"
                step="0.1"
                value={furniture.position[0].toFixed(1)}
                onChange={(e) => onUpdate({
                  position: [parseFloat(e.target.value), furniture.position[1], furniture.position[2]]
                })}
                className="w-full p-1 border border-neutral-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Y</label>
              <input
                type="number"
                step="0.1"
                value={furniture.position[1].toFixed(1)}
                onChange={(e) => onUpdate({
                  position: [furniture.position[0], parseFloat(e.target.value), furniture.position[2]]
                })}
                className="w-full p-1 border border-neutral-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Z</label>
              <input
                type="number"
                step="0.1"
                value={furniture.position[2].toFixed(1)}
                onChange={(e) => onUpdate({
                  position: [furniture.position[0], furniture.position[1], parseFloat(e.target.value)]
                })}
                className="w-full p-1 border border-neutral-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Rotation (degrees)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">X</label>
              <input
                type="number"
                value={Math.round((furniture.rotation[0] * 180) / Math.PI)}
                onChange={(e) => onUpdate({
                  rotation: [(parseFloat(e.target.value) * Math.PI) / 180, furniture.rotation[1], furniture.rotation[2]]
                })}
                className="w-full p-1 border border-neutral-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Y</label>
              <input
                type="number"
                value={Math.round((furniture.rotation[1] * 180) / Math.PI)}
                onChange={(e) => onUpdate({
                  rotation: [furniture.rotation[0], (parseFloat(e.target.value) * Math.PI) / 180, furniture.rotation[2]]
                })}
                className="w-full p-1 border border-neutral-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Z</label>
              <input
                type="number"
                value={Math.round((furniture.rotation[2] * 180) / Math.PI)}
                onChange={(e) => onUpdate({
                  rotation: [furniture.rotation[0], furniture.rotation[1], (parseFloat(e.target.value) * Math.PI) / 180]
                })}
                className="w-full p-1 border border-neutral-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Dimensions (meters)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Width</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={furniture.dimensions.width.toFixed(1)}
                onChange={(e) => onUpdate({
                  dimensions: {
                    ...furniture.dimensions,
                    width: parseFloat(e.target.value)
                  }
                })}
                className="w-full p-1 border border-neutral-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Height</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={furniture.dimensions.height.toFixed(1)}
                onChange={(e) => onUpdate({
                  dimensions: {
                    ...furniture.dimensions,
                    height: parseFloat(e.target.value)
                  }
                })}
                className="w-full p-1 border border-neutral-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Depth</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={furniture.dimensions.depth.toFixed(1)}
                onChange={(e) => onUpdate({
                  dimensions: {
                    ...furniture.dimensions,
                    depth: parseFloat(e.target.value)
                  }
                })}
                className="w-full p-1 border border-neutral-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Material */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Material
          </label>
          <select
            value={furniture.material}
            onChange={(e) => onUpdate({ material: e.target.value })}
            className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {materials.map(material => (
              <option key={material.value} value={material.value}>
                {material.label}
              </option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Color
          </label>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => onUpdate({ color })}
                className={`w-8 h-8 rounded border-2 ${
                  furniture.color === color ? 'border-primary-500' : 'border-neutral-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={furniture.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-full h-10 border border-neutral-300 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
