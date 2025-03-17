
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PencilIcon, EyeIcon, RotateCcwIcon, SaveIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Puck, Config } from "@measured/puck";
import { config, PuckRenderer } from "@/lib/puck-config";

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
  
  // Get initial Puck data from localStorage or create default
  useEffect(() => {
    try {
      const savedPuckData = localStorage.getItem('puckData');
      if (savedPuckData) {
        const parsedData = JSON.parse(savedPuckData);
        setPuckData(parsedData);
        console.log("Loaded Puck data from localStorage:", parsedData);
      } else {
        // Create default Puck data based on initialSections
        createDefaultPuckData();
      }
    } catch (e) {
      console.error("Error loading Puck data:", e);
      createDefaultPuckData();
    }
  }, []);

  const createDefaultPuckData = () => {
    // Create a default Puck data structure based on initialSections
    const defaultData = {
      content: {
        root: {
          children: initialSections.map(sectionType => {
            switch(sectionType) {
              case 'hero':
                return {
                  type: "HeroSection",
                  props: config.components.HeroSection.defaultProps
                };
              case 'services':
                return {
                  type: "ServicesGrid",
                  props: config.components.ServicesGrid.defaultProps
                };
              case 'barbers':
                return {
                  type: "BarbersTeam",
                  props: config.components.BarbersTeam.defaultProps
                };
              case 'booking':
                return {
                  type: "BookingSection",
                  props: config.components.BookingSection.defaultProps
                };
              default:
                return null;
            }
          }).filter(Boolean)
        }
      }
    };
    
    setPuckData(defaultData);
    localStorage.setItem('puckData', JSON.stringify(defaultData));
    console.log("Created default Puck data:", defaultData);
  };

  const handlePuckChange = (data: any) => {
    setPuckData(data);
    console.log("Puck data changed:", data);
  };

  const handleSave = () => {
    // Save Puck data to localStorage
    localStorage.setItem('puckData', JSON.stringify(puckData));
    
    // Extract section types from Puck data for the section order
    const sections: SectionType[] = puckData?.content?.root?.children?.map((child: any) => {
      switch(child.type) {
        case 'HeroSection': return 'hero';
        case 'ServicesGrid': return 'services';
        case 'BarbersTeam': return 'barbers';
        case 'BookingSection': return 'booking';
        default: return null;
      }
    }).filter(Boolean) || initialSections;
    
    onSave(sections);
  };

  const handleReset = () => {
    createDefaultPuckData();
    onReset();
  };

  // Show loading state if Puck data is not ready
  if (!puckData) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-[600px]">
            <p className="text-muted-foreground">Carregando editor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl md:text-2xl">Editor da Página Inicial</CardTitle>
          <CardDescription>
            Use o editor Puck para personalizar sua página inicial
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="editor" className="flex items-center gap-1">
                <PencilIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Editor</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            onClick={onPreview} 
            className="flex items-center gap-1"
          >
            <EyeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Ver Site</span>
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReset}
            className="flex items-center gap-1"
          >
            <RotateCcwIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Restaurar Padrão</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <TabsContent value="editor" className="mt-0">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Personalize sua página inicial usando o editor Puck. Arraste e solte elementos para criar seu layout. Clique em Salvar quando terminar.
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
