import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Wand2, X } from 'lucide-react';

interface RoomMeasurementsProps {
  onGenerate: (measurements: RoomMeasurements) => void;
  onClose: () => void;
}

export interface RoomMeasurements {
  width: number;
  length: number;
  height: number;
  windows: number;
  doors: number;
  style: string;
  budget: string;
  primaryUse: string;
}

const ROOM_STYLES = [
  'Modern',
  'Contemporary',
  'Minimalist',
  'Scandinavian',
  'Industrial',
  'Traditional',
  'Bohemian',
  'Mid-century Modern'
];

const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $20,000',
  '$20,000+'
];

const PRIMARY_USES = [
  'Living Room',
  'Bedroom',
  'Home Office',
  'Dining Room',
  'Kitchen',
  'Bathroom'
];

const RoomMeasurements = ({ onGenerate, onClose }: RoomMeasurementsProps) => {
  const [measurements, setMeasurements] = useState<RoomMeasurements>({
    width: 0,
    length: 0,
    height: 8,
    windows: 1,
    doors: 1,
    style: 'Modern',
    budget: '$5,000 - $10,000',
    primaryUse: 'Living Room'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(measurements);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-xl shadow-lg border border-neutral-200 p-6 w-full max-w-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Ruler className="w-5 h-5 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold">Room Measurements</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-neutral-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Room Width (ft)
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              required
              value={measurements.width || ''}
              onChange={(e) => setMeasurements({ ...measurements, width: parseFloat(e.target.value) })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Room Length (ft)
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              required
              value={measurements.length || ''}
              onChange={(e) => setMeasurements({ ...measurements, length: parseFloat(e.target.value) })}
              className="input"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Ceiling Height (ft)
            </label>
            <input
              type="number"
              min="1"
              step="0.1"
              required
              value={measurements.height}
              onChange={(e) => setMeasurements({ ...measurements, height: parseFloat(e.target.value) })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Windows
            </label>
            <input
              type="number"
              min="0"
              required
              value={measurements.windows}
              onChange={(e) => setMeasurements({ ...measurements, windows: parseInt(e.target.value) })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Doors
            </label>
            <input
              type="number"
              min="1"
              required
              value={measurements.doors}
              onChange={(e) => setMeasurements({ ...measurements, doors: parseInt(e.target.value) })}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Primary Use
          </label>
          <select
            value={measurements.primaryUse}
            onChange={(e) => setMeasurements({ ...measurements, primaryUse: e.target.value })}
            className="input"
          >
            {PRIMARY_USES.map(use => (
              <option key={use} value={use}>{use}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Preferred Style
          </label>
          <select
            value={measurements.style}
            onChange={(e) => setMeasurements({ ...measurements, style: e.target.value })}
            className="input"
          >
            {ROOM_STYLES.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Budget Range
          </label>
          <select
            value={measurements.budget}
            onChange={(e) => setMeasurements({ ...measurements, budget: e.target.value })}
            className="input"
          >
            {BUDGET_RANGES.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary py-3 flex items-center justify-center"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Generate Design
        </button>
      </form>
    </motion.div>
  );
};

export default RoomMeasurements;