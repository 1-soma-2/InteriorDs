import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moodboardService, RoomRequirements } from '@/services/moodboardService';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type MoodboardInsert = Database['public']['Tables']['moodboards']['Insert'];
type MoodboardUpdate = Database['public']['Tables']['moodboards']['Update'];

export const useMoodboards = () => {
  const { isAuthenticated, profile } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = profile?.role === 'admin';

  // Query for user's moodboards
  const {
    data: moodboards = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['moodboards', isAdmin ? 'all' : 'user'],
    queryFn: isAdmin ? moodboardService.getAllMoodboards : moodboardService.getUserMoodboards,
    enabled: isAuthenticated,
  });

  // Create moodboard mutation
  const createMoodboard = useMutation({
    mutationFn: (data: Omit<MoodboardInsert, 'user_id'>) => 
      moodboardService.createMoodboard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodboards'] });
    },
  });

  // Update moodboard mutation
  const updateMoodboard = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: MoodboardUpdate }) =>
      moodboardService.updateMoodboard(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodboards'] });
    },
  });

  // Delete moodboard mutation
  const deleteMoodboard = useMutation({
    mutationFn: (id: string) => moodboardService.deleteMoodboard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodboards'] });
    },
  });

  // Generate room design mutation
  const generateRoomDesign = useMutation({
    mutationFn: ({ moodboardId, roomRequirements }: { 
      moodboardId: string; 
      roomRequirements: RoomRequirements;
    }) => moodboardService.generateRoomDesign(moodboardId, roomRequirements),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moodboards'] });
    },
  });

  // Upload image mutation
  const uploadImage = useMutation({
    mutationFn: ({ file, path }: { file: File; path: string }) =>
      moodboardService.uploadImage(file, path),
  });

  return {
    // Data
    moodboards,
    isLoading,
    error,
    isAdmin,
    
    // Actions
    refetch,
    createMoodboard: createMoodboard.mutateAsync,
    updateMoodboard: updateMoodboard.mutateAsync,
    deleteMoodboard: deleteMoodboard.mutateAsync,
    generateRoomDesign: generateRoomDesign.mutateAsync,
    uploadImage: uploadImage.mutateAsync,
    
    // Loading states
    isCreating: createMoodboard.isPending,
    isUpdating: updateMoodboard.isPending,
    isDeleting: deleteMoodboard.isPending,
    isGenerating: generateRoomDesign.isPending,
    isUploading: uploadImage.isPending,
  };
};

export const useMoodboard = (id: string) => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['moodboard', id],
    queryFn: () => moodboardService.getMoodboard(id),
    enabled: isAuthenticated && !!id,
  });
};
