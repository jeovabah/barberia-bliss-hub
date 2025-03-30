
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  directory?: string;
  className?: string;
}

const ImageUploader = ({ 
  value, 
  onChange, 
  label = "Imagem", 
  directory = "general",
  className = ""
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (value) {
      setImagePreview(value);
    }
  }, [value]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${directory}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    try {
      setIsUploading(true);
      
      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('barbershop-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('barbershop-images')
        .getPublicUrl(filePath);

      setImagePreview(publicUrl);
      onChange(publicUrl);
      
      toast({
        title: "Imagem enviada com sucesso",
        description: "A imagem foi carregada e será exibida em sua página.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro ao enviar imagem",
        description: "Ocorreu um erro ao enviar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
      <div className="grid gap-4">
        {imagePreview ? (
          <div className="relative aspect-video overflow-hidden rounded-md border border-gray-200">
            <img
              src={imagePreview}
              alt="Imagem carregada"
              className="h-full w-full object-cover"
            />
            
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 bg-black/50 text-white hover:bg-black/70"
              onClick={() => {
                setImagePreview(null);
                onChange('');
              }}
            >
              Remover
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-200 p-10 text-center">
            <ImageIcon className="mb-2 h-10 w-10 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              Arraste e solte ou clique para enviar
            </p>
            <p className="text-xs text-gray-400">
              JPG, PNG ou GIF (máx 5MB)
            </p>
          </div>
        )}
        
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className={`cursor-pointer opacity-0 absolute inset-0 ${!imagePreview ? 'h-full' : 'h-10'}`}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {imagePreview ? 'Alterar imagem' : 'Carregar imagem'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
