
import { supabase } from "@/integrations/supabase/client";

export async function uploadImageToBucket(
  file: File, 
  directory: string = "puck-uploads"
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${directory}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('barbershop-images')
      .upload(fileName, file);
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('barbershop-images')
      .getPublicUrl(fileName);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
