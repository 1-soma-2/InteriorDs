
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import Room3D from './Room3D';
import { FurnitureObject } from './Room3D';
import { useMoodboards } from '@/hooks/useMoodboards';
import { toast } from 'sonner';

interface RoomSettings {
  width: number;
  length: number;
  height: number;
  name: string;
}

const Room3DEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateMoodboard, createMoodboard } = useMoodboards();
  
  const [roomSettings, setRoomSettings] = useState<RoomSettings>({
    width: 6,
    length: 8,
    height: 3,
    name: 'New Room Design',
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load existing moodboard data if editing
    if (id && id !== 'new') {
      // Load from backend - this would use the moodboard service
      // For now, using default room settings
    }
  }, [id]);

  const handleSaveDesign = async (furniture: FurnitureObject[]) => {
    setIsSaving(true);
    try {
      const designData = {
        title: roomSettings.name,
        description: `3D Room Design - ${roomSettings.width}m × ${roomSettings.length}m`,
        room_requirements: JSON.parse(JSON.stringify({
          roomDimensions: roomSettings,
          furniture: furniture,
          designType: '3d_room',
        })),
        generated_design: JSON.parse(JSON.stringify({
          furniture: furniture,
          roomSettings: roomSettings,
        })),
        is_generated: true,
        tags: ['3d-design', 'room-planner', roomSettings.width >= 5 ? 'large-room' : 'small-room'],
      };

      if (id === 'new') {
        await createMoodboard(designData);
        toast.success('3D room design created successfully!');
      } else {
        await updateMoodboard({ id: id!, updates: designData });
        toast.success('3D room design updated successfully!');
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error('Failed to save design. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-100">
      {/* Top bar */}
      <div className="bg-white border-b border-neutral-200 py-3 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <input
              type="text"
              value={roomSettings.name}
              onChange={(e) => setRoomSettings({ ...roomSettings, name: e.target.value })}
              className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary-500 px-2 py-1 rounded"
            />
            <div className="text-sm text-neutral-500">
              {roomSettings.width}m × {roomSettings.length}m × {roomSettings.height}m
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings 
                ? 'bg-primary-500 text-white' 
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Room Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b border-neutral-200 p-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Room Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  value={roomSettings.name}
                  onChange={(e) => setRoomSettings({ ...roomSettings, name: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Width (meters)
                </label>
                <input
                  type="number"
                  min="2"
                  max="15"
                  step="0.5"
                  value={roomSettings.width}
                  onChange={(e) => setRoomSettings({ ...roomSettings, width: parseFloat(e.target.value) })}
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Length (meters)
                </label>
                <input
                  type="number"
                  min="2"
                  max="15"
                  step="0.5"
                  value={roomSettings.length}
                  onChange={(e) => setRoomSettings({ ...roomSettings, length: parseFloat(e.target.value) })}
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Height (meters)
                </label>
                <input
                  type="number"
                  min="2.2"
                  max="4"
                  step="0.1"
                  value={roomSettings.height}
                  onChange={(e) => setRoomSettings({ ...roomSettings, height: parseFloat(e.target.value) })}
                  className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Room Editor */}
      <div className="flex-1">
        <Room3D
          roomDimensions={{
            width: roomSettings.width,
            length: roomSettings.length,
            height: roomSettings.height,
          }}
          onSave={handleSaveDesign}
        />
      </div>

      {/* Loading overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium">Saving your 3D design...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room3DEditor;
