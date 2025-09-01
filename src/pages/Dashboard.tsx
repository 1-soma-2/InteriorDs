
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoodboards } from '../hooks/useMoodboards';
import { Box, Palette, BookOpen, Trash2, Edit3, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { moodboards, isLoading, error, deleteMoodboard, isAdmin } = useMoodboards();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMoodboard(id);
      toast.success('Moodboard deleted successfully!');
    } catch (err) {
      console.error('Failed to delete moodboard', err);
      toast.error('Failed to delete moodboard. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Your Moodboards</h1>
        <Button onClick={() => navigate('/editor/new')}>
          <Palette className="mr-2 h-4 w-4" />
          Create Moodboard
        </Button>
      </div>

      {isAdmin && (
        <div className="mb-4 p-3 rounded-md bg-blue-50 border border-blue-200 text-sm text-blue-700">
          You are viewing as an Admin.
        </div>
      )}

      {moodboards.length === 0 ? (
        <div className="text-neutral-500">No moodboards created yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moodboards.map((moodboard) => (
            <div key={moodboard.id} className="rounded-lg shadow-md overflow-hidden bg-white">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-neutral-800 mb-2">{moodboard.title}</h2>
                <p className="text-sm text-neutral-600">{moodboard.description}</p>
                <div className="flex items-center space-x-2 mt-3 text-xs text-neutral-500">
                  <Calendar className="h-4 w-4" />
                  <span>{moodboard.created_at ? new Date(moodboard.created_at).toLocaleDateString() : 'N/A'}</span>
                  <User className="h-4 w-4" />
                  <span>{moodboard.user_id}</span>
                </div>
              </div>
              <div className="bg-neutral-50 p-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/editor/${moodboard.id}`)}
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === moodboard.id}
                  onClick={() => handleDelete(moodboard.id)}
                >
                  {deletingId === moodboard.id ? (
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4 12H2M22 12H20M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-bold text-neutral-800 mb-4">Explore Design Ideas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg shadow-md overflow-hidden bg-white">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">3D Room Planner</h3>
              <p className="text-sm text-neutral-600">Design your dream room in 3D with realistic furniture and automatic floor plan conversion.</p>
            </div>
            <div className="bg-neutral-50 p-4">
              <Button onClick={() => navigate('/3d-editor/new')}>
                <Box className="mr-2 h-4 w-4" />
                Start Designing
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg shadow-md overflow-hidden bg-white">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Inspiration Gallery</h3>
              <p className="text-sm text-neutral-600">Browse curated moodboards and design ideas for inspiration.</p>
            </div>
            <div className="bg-neutral-50 p-4">
              <Button onClick={() => navigate('/inspiration')}>
                <BookOpen className="mr-2 h-4 w-4" />
                Explore
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
