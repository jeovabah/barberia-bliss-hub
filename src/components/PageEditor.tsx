
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  SaveIcon, 
  Eye, 
  RotateCcw, 
  Scissors, 
  PanelLeft, 
  PanelRight, 
  Palette,
  SlidersHorizontal 
} from "lucide-react";
import { Puck, type Data } from "@measured/puck";
import { config } from "@/lib/puck-config";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "@measured/puck/puck.css";

interface EditorProps {
  onSave: (data: any) => void;
  onPreview: () => void;
  onReset?: () => void;
  initialData?: any;
  initialSections?: ('hero' | 'services' | 'barbers' | 'booking')[];
  companyName?: string;
}

const PageEditor: React.FC<EditorProps> = ({ 
  onSave, 
  onPreview, 
  onReset,
  initialData = null,
  initialSections = ['hero', 'services', 'barbers', 'booking'], // 'booking' included by default
  companyName = "Barbearia"
}) => {
  const [puckData, setPuckData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
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
          
          // Direct format from Supabase query where we have puck_content[0].content
          if (Array.isArray(initialData) && initialData.length > 0) {
            console.log("Found array format from Supabase query");
            
            const firstItem = initialData[0];
            if (firstItem && firstItem.content) {
              console.log("Using content from first item in array:", firstItem.content);
              setPuckData(firstItem.content);
              hasInitialized.current = true;
              setIsLoading(false);
              return;
            }
          }
          
          // Handle case where we have a nested content field from Supabase
          if (initialData.content && typeof initialData.content === 'object') {
            console.log("Found content field in initialData", initialData.content);
            
            // If content field contains well-structured Puck data
            if (initialData.content.root && initialData.content.content && Array.isArray(initialData.content.content)) {
              console.log("Found well-structured Puck data inside content field");
              
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
          
          // Directly use initialData if it has the correct Puck format
          if (typeof initialData === 'object' && 
              'content' in initialData && 
              'root' in initialData &&
              Array.isArray(initialData.content)) {
            console.log("Using data in direct Puck format");
            setPuckData(initialData as Data);
            hasInitialized.current = true;
            setIsLoading(false);
            return;
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
      const uniqueId = `${sectionType}-${index}-${Date.now()}`;
      
      switch(sectionType) {
        case 'hero':
          return {
            type: "HeroSection",
            props: {
              ...config.components.HeroSection.defaultProps,
              id: uniqueId
            }
          };
        case 'services':
          return {
            type: "ServicesGrid",
            props: {
              ...config.components.ServicesGrid.defaultProps,
              id: uniqueId,
              services: (config.components.ServicesGrid.defaultProps.services || []).map((service, serviceIndex) => ({
                ...service,
                id: service.id || `service-${uniqueId}-${serviceIndex}`
              }))
            }
          };
        case 'barbers':
          return {
            type: "BarbersTeam",
            props: {
              ...config.components.BarbersTeam.defaultProps,
              id: uniqueId
            }
          };
        case 'booking':
          return {
            type: "BookingSection",
            props: {
              ...config.components.BookingSection.defaultProps,
              id: uniqueId
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

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'editor' ? 'preview' : 'editor');
  };

  // Get first letter of each word for the logo
  const getLogoInitials = () => {
    if (!companyName) return "BB";
    
    return companyName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('').substring(0, 2);
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
        <div className="flex items-center">
          <div className="bg-amber-500 text-white p-2 rounded-md mr-3 flex items-center justify-center w-10 h-10">
            <span className="font-bold">{getLogoInitials()}</span>
          </div>
          <div>
            <CardTitle>Editor da Página</CardTitle>
            <CardDescription>
              Personalize a aparência do seu site
            </CardDescription>
          </div>
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
            Organize as seções da sua página arrastando-as da barra lateral. Clique em uma seção para personalizar cores, textos e imagens.
          </p>
        </div>

        <Tabs defaultValue="editor" className="mb-4">
          <TabsList>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <PanelLeft className="w-4 h-4" />
              Editor de Seções
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
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
          </TabsContent>
          
          <TabsContent value="design">
            <div className="p-6 border rounded-md">
              <h3 className="text-lg font-medium mb-4">Configurações de Design</h3>
              <p className="text-muted-foreground mb-6">
                Para personalizar as cores, fontes e estilos, clique em uma seção no editor e utilize as opções no painel lateral direito.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Palette className="w-4 h-4 mr-2" /> 
                    Cores
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Selecione uma seção para alterar suas cores de fundo, texto e destaque.
                  </p>
                </div>
                
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2 flex items-center">
                    <SlidersHorizontal className="w-4 h-4 mr-2" /> 
                    Configurações
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Altere o conteúdo, fontes e espaçamentos em cada seção.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="p-6 border rounded-md">
              <h3 className="text-lg font-medium mb-4">Configurações da Página</h3>
              <p className="text-muted-foreground mb-6">
                Aqui você pode gerenciar as configurações gerais do seu site.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2">Ordem das Seções</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    No Editor, arraste as seções para reordenar a página como desejar.
                  </p>
                  <Button variant="outline" onClick={() => {
                    toast({
                      title: "Dica",
                      description: "Volte ao Editor de Seções para reorganizar seu site.",
                    });
                  }}>
                    <PanelLeft className="w-4 h-4 mr-2" />
                    Organizar Seções
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PageEditor;
