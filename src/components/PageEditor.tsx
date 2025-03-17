
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
  
  console.log("PageEditor renderizando com initialSections:", initialSections);
  
  // Carregar dados do Puck ao inicializar
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Verificar se há dados salvos do Puck
      const savedPuckData = localStorage.getItem('puckData');
      console.log("Buscando dados do Puck:", savedPuckData ? "Dados encontrados" : "Nenhum dado");
      
      if (savedPuckData) {
        try {
          const parsedData = JSON.parse(savedPuckData);
          console.log("Dados do Puck analisados com sucesso:", parsedData);
          setPuckData(parsedData);
        } catch (e) {
          console.error("Erro ao analisar dados do Puck:", e);
          createDefaultPuckData();
        }
      } else {
        console.log("Nenhum dado do Puck encontrado, criando dados padrão");
        createDefaultPuckData();
      }
    } catch (e) {
      console.error("Erro ao carregar o editor:", e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [initialSections]);

  // Função para criar dados padrão do Puck com base nas seções iniciais
  const createDefaultPuckData = () => {
    console.log("Criando dados padrão do Puck com seções:", initialSections);
    
    // Mapear tipos de seção para componentes do Puck
    const children = initialSections.map(sectionType => {
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
    
    // Estrutura de dados para o Puck
    const defaultData = {
      content: {
        root: {
          children: children
        }
      }
    };
    
    console.log("Dados padrão do Puck criados:", defaultData);
    setPuckData(defaultData);
    localStorage.setItem('puckData', JSON.stringify(defaultData));
  };

  // Quando o usuário faz alterações no editor
  const handlePuckChange = (data: Data) => {
    console.log("Dados do Puck alterados:", data);
    setPuckData(data);
  };

  // Salvar alterações
  const handleSave = () => {
    console.log("Salvando alterações, dados atuais:", puckData);
    
    if (!puckData || !puckData.content || !puckData.content.root || !puckData.content.root.children) {
      toast({
        title: "Erro ao salvar",
        description: "Dados inválidos. Tente recarregar a página.",
        variant: "destructive",
      });
      return;
    }
    
    // Salvar dados do Puck no localStorage
    localStorage.setItem('puckData', JSON.stringify(puckData));
    
    // Extrair tipos de seção dos dados do Puck
    const sections: SectionType[] = puckData.content.root.children
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
    
    console.log("Seções extraídas para salvar:", sections);
    onSave(sections);
    
    toast({
      title: "Alterações salvas",
      description: "As alterações na página inicial foram salvas com sucesso.",
    });
  };

  // Restaurar para o padrão
  const handleReset = () => {
    console.log("Restaurando para o padrão");
    createDefaultPuckData();
    onReset();
    
    toast({
      title: "Página restaurada",
      description: "A página inicial foi restaurada para o padrão.",
    });
  };

  // Componente de carregamento
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

  // Componente de erro
  if (hasError || !puckData) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-[600px]">
            <p className="text-red-500 mb-4">Erro ao carregar editor. Por favor, tente novamente.</p>
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
            Restaurar
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
          <h3 className="font-medium mb-2">Prévia:</h3>
          <div className="border rounded-md p-4 bg-gray-50 max-h-[400px] overflow-auto">
            {puckData && puckData.content ? (
              <PuckRenderer data={puckData.content} />
            ) : (
              <p className="text-muted-foreground text-center py-10">Nenhum conteúdo para visualizar.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageEditor;
