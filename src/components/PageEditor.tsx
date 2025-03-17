
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SaveIcon, Eye, RotateCcw } from "lucide-react";
import { Puck, type Data } from "@measured/puck";
import { config, PuckRenderer } from "@/lib/puck-config";
import { toast } from "@/components/ui/use-toast";

type SectionType = 'hero' | 'services' | 'barbers' | 'booking';

interface EditorProps {
  onSave: (sections: SectionType[]) => void;
  onPreview: () => void;
  onReset: () => void;
  initialSections?: SectionType[];
}

const PageEditor: React.FC<EditorProps> = ({ 
  onSave, 
  onPreview, 
  onReset,
  initialSections = ['hero', 'services', 'barbers', 'booking']
}) => {
  const [puckData, setPuckData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  console.log("PageEditor rendering with initialSections:", initialSections);
  
  // Load Puck data when initialized
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Check if there's saved Puck data
      const savedPuckData = localStorage.getItem('puckData');
      console.log("Fetching Puck data:", savedPuckData ? "Data found" : "No data");
      
      if (savedPuckData) {
        try {
          const parsedData = JSON.parse(savedPuckData);
          console.log("Puck data parsed successfully:", parsedData);
          
          // Check if the parsed data has the correct structure
          if (parsedData && typeof parsedData === 'object') {
            if (parsedData.root && Array.isArray(parsedData.content)) {
              // Data structure is already correct
              setPuckData(parsedData);
            } else {
              // Create a properly structured Puck data object
              const transformedData: Data = {
                root: {
                  props: {}
                },
                content: []
              };
              
              // Try to extract components from different possible structures
              if (Array.isArray(parsedData.content)) {
                transformedData.content = parsedData.content;
              } else if (parsedData.content && parsedData.content.root && 
                          Array.isArray(parsedData.content.root.children)) {
                transformedData.content = parsedData.content.root.children;
              } else if (parsedData.content && Array.isArray(parsedData.content.children)) {
                transformedData.content = parsedData.content.children;
              } else {
                // If we can't extract components, create default data
                console.log("Cannot extract components from saved data, creating default");
                createDefaultPuckData();
                return;
              }
              
              setPuckData(transformedData);
              localStorage.setItem('puckData', JSON.stringify(transformedData));
            }
          } else {
            console.log("Parsed data is not a valid object, creating default");
            createDefaultPuckData();
          }
        } catch (e) {
          console.error("Error parsing Puck data:", e);
          createDefaultPuckData();
        }
      } else {
        console.log("No Puck data found, creating default data");
        createDefaultPuckData();
      }
    } catch (e) {
      console.error("Error loading editor:", e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [initialSections]);

  // Function to create default Puck data based on initial sections
  const createDefaultPuckData = () => {
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
    
    console.log("Default Puck data created:", defaultData);
    setPuckData(defaultData);
    localStorage.setItem('puckData', JSON.stringify(defaultData));
  };

  // When the user makes changes in the editor
  const handlePuckChange = (data: Data) => {
    console.log("Puck data changed:", data);
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
    
    // Save Puck data to localStorage
    localStorage.setItem('puckData', JSON.stringify(puckData));
    
    // Extract section types from Puck data
    const sections: SectionType[] = puckData.content
      .map((child: any) => {
        switch(child.type) {
          case 'HeroSection': return 'hero';
          case 'ServicesGrid': return 'services';
          case 'BarbersTeam': return 'barbers';
          case 'BookingSection': return 'booking';
          default: return null;
        }
      })
      .filter(Boolean) as SectionType[];
    
    console.log("Extracted sections to save:", sections);
    onSave(sections);
    
    toast({
      title: "Alterações salvas",
      description: "As alterações na página inicial foram salvas com sucesso.",
    });
  };

  // Reset to default
  const handleReset = () => {
    console.log("Resetting to default");
    createDefaultPuckData();
    onReset();
    
    toast({
      title: "Página redefinida",
      description: "A página inicial foi redefinida para o padrão.",
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

  // Error component
  if (hasError || !puckData) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-[600px]">
            <p className="text-red-500 mb-4">Erro ao carregar o editor. Por favor, tente novamente.</p>
            <Button onClick={createDefaultPuckData}>
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Editor da Página Inicial</CardTitle>
          <CardDescription>
            Use o editor abaixo para personalizar a página inicial do seu site
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
          <Puck
            config={config}
            data={puckData}
            onPublish={handleSave}
            onChange={handlePuckChange}
          />
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Visualização:</h3>
          <div className="border rounded-md p-4 bg-gray-50 max-h-[400px] overflow-auto">
            {puckData && (
              <PuckRenderer data={puckData} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageEditor;
