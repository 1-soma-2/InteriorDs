
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Moodboard = Database['public']['Tables']['moodboards']['Row'];
type MoodboardInsert = Database['public']['Tables']['moodboards']['Insert'];
type MoodboardUpdate = Database['public']['Tables']['moodboards']['Update'];

export interface RoomRequirements {
  roomType: string;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  style: string;
  colorPreference: string;
  budget: string;
  specialRequirements?: string;
}

class MoodboardService {
  async getAllMoodboards(): Promise<Moodboard[]> {
    const { data, error } = await supabase
      .from('moodboards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all moodboards:', error);
      throw error;
    }

    return data || [];
  }

  async getUserMoodboards(): Promise<Moodboard[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('moodboards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user moodboards:', error);
      throw error;
    }

    return data || [];
  }

  async getMoodboard(id: string): Promise<Moodboard> {
    const { data, error } = await supabase
      .from('moodboards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching moodboard:', error);
      throw error;
    }

    return data;
  }

  async createMoodboard(moodboard: Omit<MoodboardInsert, 'user_id'>): Promise<Moodboard> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('moodboards')
      .insert({
        ...moodboard,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating moodboard:', error);
      throw error;
    }

    return data;
  }

  async updateMoodboard(id: string, updates: MoodboardUpdate): Promise<Moodboard> {
    const { data, error } = await supabase
      .from('moodboards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating moodboard:', error);
      throw error;
    }

    return data;
  }

  async deleteMoodboard(id: string): Promise<void> {
    const { error } = await supabase
      .from('moodboards')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting moodboard:', error);
      throw error;
    }
  }

  async generateRoomDesign(moodboardId: string, roomRequirements: RoomRequirements): Promise<Moodboard> {
    try {
      console.log('Generating room design for moodboard:', moodboardId);
      console.log('Room requirements:', roomRequirements);

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-room-design', {
        body: {
          moodboardId,
          roomRequirements
        }
      });

      if (error) {
        console.error('Error calling generate-room-design function:', error);
        throw error;
      }

      // Update the moodboard with the generated design
      const updatedMoodboard = await this.updateMoodboard(moodboardId, {
        generated_interior_plan: data.design,
        room_equipments: roomRequirements as any
      });

      return updatedMoodboard;
    } catch (error) {
      console.error('Error generating room design:', error);
      throw error;
    }
  }

  async uploadImage(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('moodboard-images')
      .upload(path, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('moodboard-images')
      .getPublicUrl(data.path);

    return publicUrl;
  }
}

export const moodboardService = new MoodboardService();
