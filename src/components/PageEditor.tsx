
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon, RotateCcwIcon, SaveIcon } from "lucide-react";
import { Puck } from "@measured/puck";
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
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [puckData, setPuckData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log("PageEditor component initialized with initialSections:", initialSections);
  
  useEffect(() => {
    setIsLoading(true);
    try {
      // First check if there's saved Puck data
      const savedPuckData = localStorage.getItem('puckData');
      console.log("Retrieved puckData from localStorage:", savedPuckData ? "Found data" : "No data found");
      
      if (savedPuckData) {
        try {
          const parsedData = JSON.parse(savedPuckData);
          console.log("Successfully parsed Puck data:", parsedData);
          setPuckData(parsedData);
        } catch (e) {
          console.error("Error parsing saved Puck data:", e);
          createDefaultPuckData();
        }
      } else {
        console.log("No saved Puck data found, creating default");
        createDefaultPuckData();
      }
    } catch (e) {
      console.error("Error in PageEditor useEffect:", e);
      createDefaultPuckData();
    } finally {
      setIsLoading(false);
    }
  }, [initialSections]);

  const createDefaultPuckData = () => {
    console.log("Creating default Puck data with sections:", initialSections);
    
    // Create the children array based on the initialSections
    const children = initialSections.map(sectionType => {
      switch(sectionType) {
        case 'hero':
          return {
            type: "HeroSection",
            props: {...config.components.HeroSection.defaultProps}
          };
        case 'services':
          return {
            type: "ServicesGrid",
            props: {...config.components.ServicesGrid.defaultProps}
          };
        case 'barbers':
          return {
            type: "BarbersTeam",
            props: {...config.components.BarbersTeam.defaultProps}
          };
        case 'booking':
          return {
            type: "BookingSection",
            props: {...config.components.BookingSection.defaultProps}
          };
        default:
          return null;
      }
    }).filter(Boolean);
    
    // Create the default Puck data structure
    const defaultData = {
      content: {
        root: {
          children: children
        }
      }
    };
    
    console.log("Created default Puck data:", defaultData);
    setPuckData(defaultData);
    localStorage.setItem('puckData', JSON.stringify(defaultData));
  };

  const handlePuckChange = (data: any) => {
    console.log("Puck data changed, new data:", data);
    setPuckData(data);
  };

  const handleSave = () => {
    console.log("Save button clicked, current puckData:", puckData);
    
    if (!puckData || !puckData.content || !puckData.content.root || !puckData.content.root.children) {
      toast({
        title: "Erro ao salvar",
        description: "Dados inválidos. Tente recarregar a página.",
        variant: "destructive",
      });
      return;
    }
    
    // Save Puck data to localStorage
    localStorage.setItem('puckData', JSON.stringify(puckData));
    
    // Extract section types from Puck data for the section order
    const sections: SectionType[] = puckData.content.root.children.map((child: any) => {
      switch(child.type) {
        case 'HeroSection': return 'hero';
        case 'ServicesGrid': return 'services';
        case 'BarbersTeam': return 'barbers';
        case 'BookingSection': return 'booking';
        default: return null;
      }
    }).filter(Boolean);
    
    console.log("Saving extracted sections:", sections);
    onSave(sections);
    
    toast({
      title: "Alterações salvas",
      description: "As alterações na página inicial foram salvas com sucesso.",
      variant: "default",
    });
  };

  const handleReset = () => {
    console.log("Reset button clicked");
    createDefaultPuckData();
    onReset();
  };

  const renderLoadingState = () => (
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

  const renderErrorState = () => (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center h-[600px]">
          <p className="text-red-500 mb-4">Erro ao carregar editor. Por favor, tente novamente.</p>
          <Button onClick={createDefaultPuckData} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return renderLoadingState();
  }

  if (!puckData) {
    return renderErrorState();
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl md:text-2xl">Editor da Página Inicial</CardTitle>
          <CardDescription>
            Use o editor para personalizar sua página inicial
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            onClick={onPreview}
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            Ver Site
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReset}
          >
            <RotateCcwIcon className="w-4 h-4 mr-2" />
            Restaurar
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <TabsContent value="editor" className="mt-0">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Personalize sua página inicial usando o editor. Arraste componentes e edite suas propriedades.
            </p>
          </div>

          <div className="border rounded-md overflow-hidden" style={{ height: "800px" }}>
            {puckData && (
              <Puck
                config={config}
                data={puckData}
                onPublish={handleSave}
                onChange={handlePuckChange}
                renderHeader={() => (
                  <div className="p-4 bg-amber-50 border-b">
                    <h2 className="font-bold text-amber-800">Editor de Página</h2>
                    <p className="text-sm text-amber-700">
                      Arraste componentes da barra lateral para a área de edição
                    </p>
                  </div>
                )}
              />
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <SaveIcon className="w-4 h-4" />
              Salvar Alterações
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="border rounded-md p-4 bg-gray-50 h-[800px] overflow-auto">
            {puckData && puckData.content ? (
              <PuckRenderer data={puckData.content} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Nenhum conteúdo para visualizar.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default PageEditor;
