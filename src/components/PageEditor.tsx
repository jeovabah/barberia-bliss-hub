
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
          console.log("Using provided initial data from database");
          
          // Ensure the data has the correct structure
          if (typeof initialData === 'object') {
            // Create a properly structured data object for Puck
            const normalizedData: Data = {
              root: {
                props: {}
              },
              content: []
            };
            
            // Extract content based on the structure we find
            if (Array.isArray(initialData.content)) {
              normalizedData.content = initialData.content;
            } else if (initialData.root && Array.isArray(initialData.root.children)) {
              normalizedData.content = initialData.root.children;
            }
            
            setPuckData(normalizedData);
            hasInitialized.current = true;
            setIsLoading(false);
            return;
          }
        }
        
        // Priority, 2: Create default data (we no longer check localStorage)
        console.log("No database data found, creating default data");
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
    const contentItems = initialSections.map(sectionType => {
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
              ...config.components.ServicesGrid.defaultProps
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
    
    console.log("Default Puck data created");
    setPuckData(defaultData);
    // We no longer save to localStorage here
  };

  // When the user makes changes in the editor
  const handlePuckChange = (data: Data) => {
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
