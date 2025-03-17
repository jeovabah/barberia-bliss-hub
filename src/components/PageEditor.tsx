
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SaveIcon, Eye, RotateCcw } from "lucide-react";
import { Puck, type Data } from "@measured/puck";
import { config } from "@/lib/puck-config";
import { toast } from "@/components/ui/use-toast";
import "@measured/puck/puck.css";

interface EditorProps {
  onSave: (data: any) => void;
  onPreview: () => void;
  onReset?: () => void;
  initialData?: any;
  initialSections?: ('hero' | 'services' | 'barbers' | 'booking')[];
}

const PageEditor: React.FC<EditorProps> = ({ 
  onSave, 
  onPreview, 
  onReset,
  initialData = null,
  initialSections = ['hero', 'services', 'barbers', 'booking']
}) => {
  const [puckData, setPuckData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);
  
  console.log("PageEditor rendering with initialSections:", initialSections);
  console.log("PageEditor initialData:", initialData);
  
  // Load Puck data when initialized - only runs once
  useEffect(() => {
    // Skip if we've already initialized to prevent infinite loops
    if (hasInitialized.current) return;
    
    const loadPuckData = async () => {
      setIsLoading(true);
      
      try {
        // Priority 1: If we have initialData from props (database), use it
        if (initialData) {
          console.log("Using provided initial data from database", initialData);
          
          // Handle data from Supabase direct table query which has nested content
          if (initialData.content && typeof initialData.content === 'object') {
            // Look for table structure where content is a field with nested structure
            console.log("Found content field in initialData", initialData.content);
            
            // If content field itself contains root and content fields, use it directly
            if (initialData.content.root && initialData.content.content && Array.isArray(initialData.content.content)) {
              console.log("Found properly structured Puck data inside content field");
              
              const puckContent: Data = {
                root: initialData.content.root,
                content: initialData.content.content
              };
              
              setPuckData(puckContent);
              hasInitialized.current = true;
              setIsLoading(false);
              return;
            }
          }
          
          // Check if initialData is already in the correct Puck format
          if (typeof initialData === 'object' && 
              'content' in initialData && 
              'root' in initialData &&
              Array.isArray(initialData.content)) {
            console.log("Direct Puck data structure found");
            setPuckData(initialData as Data);
            hasInitialized.current = true;
            setIsLoading(false);
            return;
          }
          
          // If we have a direct array of content items without the root structure
          if (Array.isArray(initialData)) {
            console.log("Found array of content items, constructing proper Puck structure");
            setPuckData({
              root: { props: {} },
              content: initialData
            });
            hasInitialized.current = true;
            setIsLoading(false);
            return;
          }
          
          // Handle case where initialData is from the Supabase direct table query array
          if (Array.isArray(initialData) && initialData.length > 0 && initialData[0]?.content) {
            console.log("Found array from direct table query with content field", initialData[0].content);
            
            const firstItem = initialData[0];
            if (firstItem.content && 
                typeof firstItem.content === 'object' &&
                'content' in firstItem.content && 
                'root' in firstItem.content) {
              console.log("Using content from first item in array");
              setPuckData(firstItem.content as Data);
              hasInitialized.current = true;
              setIsLoading(false);
              return;
            }
          }
          
          console.log("Provided data doesn't match expected Puck structure, creating default");
        }
        
        // Priority 2: Create default data
        console.log("No valid database data found, creating default data");
        await createDefaultPuckData();
      } catch (e) {
        console.error("Error loading editor:", e);
        await createDefaultPuckData();
      } finally {
        setIsLoading(false);
        hasInitialized.current = true;
      }
    };
    
    loadPuckData();
  }, [initialData, initialSections]);

  // Function to create default Puck data based on initial sections
  const createDefaultPuckData = async () => {
    console.log("Creating default Puck data with sections:", initialSections);
    
    // Map section types to Puck components
    const contentItems = initialSections.map((sectionType, index) => {
      switch(sectionType) {
        case 'hero':
          return {
            type: "HeroSection",
            props: {
              ...config.components.HeroSection.defaultProps
            }
          };
        case 'services':
          return {
            type: "ServicesGrid",
            props: {
              ...config.components.ServicesGrid.defaultProps,
              services: (config.components.ServicesGrid.defaultProps.services || []).map(service => ({
                ...service,
                id: service.id || `service-${index}-${Math.random().toString(36).substr(2, 9)}`
              }))
            }
          };
        case 'barbers':
          return {
            type: "BarbersTeam",
            props: {
              ...config.components.BarbersTeam.defaultProps
            }
          };
        case 'booking':
          return {
            type: "BookingSection",
            props: {
              ...config.components.BookingSection.defaultProps
            }
          };
        default:
          return null;
      }
    }).filter(Boolean);
    
    // Creating a proper Data structure for Puck according to its API
    const defaultData: Data = {
      root: {
        props: {}
      },
      content: contentItems
    };
    
    console.log("Default Puck data created:", defaultData);
    setPuckData(defaultData);
  };

  // When the user makes changes in the editor
  const handlePuckChange = (data: Data) => {
    console.log("Editor data changed:", data);
    setPuckData(data);
  };

  // Save changes
  const handleSave = () => {
    console.log("Saving changes, current data:", puckData);
    
    if (!puckData || !puckData.content || !Array.isArray(puckData.content)) {
      toast({
        title: "Erro ao salvar",
        description: "Estrutura de dados inválida. Tente recarregar a página.",
        variant: "destructive",
      });
      return;
    }
    
    // Call the onSave callback to save to the database
    onSave(puckData);
  };

  // Reset to default
  const handleReset = () => {
    console.log("Resetting to default");
    if (onReset) {
      onReset();
    } else {
      createDefaultPuckData();
    }
    
    toast({
      title: "Página redefinida",
      description: "A página foi redefinida para o padrão.",
    });
  };

  // Loading component
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Carregando editor...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Editor da Página</CardTitle>
          <CardDescription>
            Use o editor abaixo para personalizar a sua página
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Ver Site
          </Button>
          <Button variant="destructive" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Redefinir
          </Button>
          <Button onClick={handleSave}>
            <SaveIcon className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="p-4 bg-amber-50 border rounded-md mb-4">
          <p className="text-amber-800">
            Arraste componentes da barra lateral para a área de edição. Clique em um componente para editar suas propriedades.
          </p>
        </div>

        <div className="border rounded-md overflow-hidden" style={{ height: "800px" }}>
          {puckData && (
            <Puck
              config={config}
              data={puckData}
              onPublish={handleSave}
              onChange={handlePuckChange}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PageEditor;
