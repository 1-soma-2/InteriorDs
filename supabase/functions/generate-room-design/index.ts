
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting generate-room-design function...');
    
    const { roomRequirements, moodboardId } = await req.json();
    console.log('📋 Request data:', { roomRequirements, moodboardId });
    
    // Check OpenAI API key first
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('🔑 OpenAI API key status:', openAIApiKey ? 'Found' : 'Missing');
    
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found in environment');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured',
        details: 'Please add OPENAI_API_KEY to your Supabase Edge Function secrets'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header and extract the token
    const authHeader = req.headers.get('Authorization');
    console.log('🔐 Auth header status:', authHeader ? 'Present' : 'Missing');
    
    let userId = null;
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        console.log('🎫 Token extracted, length:', token.length);
        
        // Set the session using the token
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        
        if (userError) {
          console.error('🔒 Auth error:', userError);
          return new Response(JSON.stringify({ error: 'Authentication failed', details: userError.message }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        if (user) {
          userId = user.id;
          console.log('✅ User authenticated:', userId);
        }
      } catch (authError) {
        console.error('🔒 Token processing error:', authError);
        return new Response(JSON.stringify({ error: 'Invalid token', details: authError.message }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (!userId) {
      console.error('❌ No valid user found');
      return new Response(JSON.stringify({ error: 'User authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create detailed prompt for interior design
    const designPrompt = `Create a detailed interior design description for a ${roomRequirements.roomType || 'living room'} with the following requirements:
    
    Room Details:
    - Room Type: ${roomRequirements.roomType || 'Living Room'}
    - Dimensions: ${roomRequirements.width || 4}m × ${roomRequirements.length || 5}m × ${roomRequirements.height || 3}m
    - Style Preference: ${roomRequirements.style || 'Modern'}
    - Color Scheme: ${roomRequirements.colors || 'Neutral tones'}
    - Budget Range: ${roomRequirements.budget || 'Medium'}
    - Special Features: ${roomRequirements.features || 'None specified'}
    - Furniture Needs: ${roomRequirements.furniture || 'Standard furniture'}
    - Lighting Preferences: ${roomRequirements.lighting || 'Natural and ambient'}
    
    Please provide a comprehensive interior design plan including:
    1. Overall design concept and theme
    2. Color palette and materials
    3. Furniture layout and recommendations
    4. Lighting design
    5. Decorative elements and accessories
    6. Storage solutions
    7. Budget breakdown by category
    
    Make it detailed, practical, and inspiring for the homeowner.`;

    // Generate design using OpenAI
    console.log('🎨 Calling OpenAI API for design description...');
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional interior designer with expertise in creating beautiful, functional living spaces. Provide detailed, practical design recommendations.'
          },
          {
            role: 'user',
            content: designPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('❌ OpenAI API error:', errorData);
      return new Response(JSON.stringify({ 
        error: 'Failed to generate design description', 
        details: errorData,
        status: openAIResponse.status 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const designData = await openAIResponse.json();
    const designDescription = designData.choices[0].message.content;
    console.log('✅ Design description generated successfully');

    // Generate a 3D architectural render using OpenAI's DALL-E
    const imagePrompt = `A high-quality 3D architectural visualization of a ${roomRequirements.roomType || 'living room'} interior design. 
    Style: ${roomRequirements.style || 'modern'} architecture with ${roomRequirements.colors || 'neutral'} color palette.
    Room dimensions: ${roomRequirements.width || 4}m × ${roomRequirements.length || 5}m × ${roomRequirements.height || 3}m.
    Features: ${roomRequirements.features || 'elegant furniture arrangement'}.
    Lighting: ${roomRequirements.lighting || 'natural and ambient lighting'}.
    
    Create a photorealistic 3D render showing:
    - Clean architectural lines and modern design
    - Proper furniture placement and scale
    - Professional lighting setup
    - High-end materials and finishes
    - Spacious and well-organized layout
    
    Render style: Clean, minimalist, architectural visualization, 3D interior design, professional photography style, high contrast, sharp details, modern aesthetic.`;

    console.log('🖼️ Calling OpenAI DALL-E for main image...');
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'natural',
      }),
    });

    let imageUrl = null;
    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      if (imageData.data && imageData.data[0] && imageData.data[0].url) {
        imageUrl = imageData.data[0].url;
        console.log('✅ Main image generated successfully');
      }
    } else {
      const imageError = await imageResponse.json();
      console.error('❌ Main image generation failed:', imageError);
    }

    // Generate a second angle/view of the same room
    const alternateImagePrompt = `A second 3D architectural view of the same ${roomRequirements.roomType || 'living room'} from a different angle. 
    Same style: ${roomRequirements.style || 'modern'} with ${roomRequirements.colors || 'neutral'} colors.
    Show different perspective: corner view or opposite angle of the same interior design.
    Maintain consistency with the first render but show more details of furniture arrangement and spatial layout.
    Professional 3D architectural visualization, clean modern aesthetic, high-quality render.`;

    console.log('🖼️ Calling OpenAI DALL-E for alternate image...');
    const alternateImageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: alternateImagePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'natural',
      }),
    });

    let alternateImageUrl = null;
    if (alternateImageResponse.ok) {
      const alternateImageData = await alternateImageResponse.json();
      if (alternateImageData.data && alternateImageData.data[0] && alternateImageData.data[0].url) {
        alternateImageUrl = alternateImageData.data[0].url;
        console.log('✅ Alternate image generated successfully');
      }
    } else {
      const altImageError = await alternateImageResponse.json();
      console.error('❌ Alternate image generation failed:', altImageError);
    }

    // Prepare the generated design data
    const generatedDesign = {
      description: designDescription,
      imageUrl: imageUrl,
      alternateImageUrl: alternateImageUrl,
      roomRequirements: roomRequirements,
      generatedAt: new Date().toISOString(),
      prompt: designPrompt,
      imagePrompt: imagePrompt,
      renderStyle: '3D Architectural Visualization',
    };

    console.log('💾 Updating moodboard...');
    // Update the moodboard with generated design using service role
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error: updateError } = await supabaseService
      .from('moodboards')
      .update({
        generated_design: generatedDesign,
        image_url: imageUrl,
        is_generated: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', moodboardId)
      .eq('user_id', userId);

    if (updateError) {
      console.error('❌ Error updating moodboard:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update moodboard', details: updateError }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('🎉 Design generation completed successfully');
    return new Response(JSON.stringify({ 
      success: true, 
      generatedDesign,
      message: '3D room design generated successfully!'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 Error in generate-room-design function:', error);
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred', 
      details: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
