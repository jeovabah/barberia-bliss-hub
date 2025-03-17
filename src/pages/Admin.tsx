
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { config } from "@/lib/puck-config";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("adminAuthenticated") === "true"
  );
  
  // Store separate content for homepage and about page
  const [homepageContent, setHomepageContent] = useState<any>({ root: { children: [] } });
  const [componentContent, setComponentContent] = useState<any>({ root: { children: [] } });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved data
    const savedHomepage = localStorage.getItem("homepageContent");
    if (savedHomepage) {
      try {
        const parsedContent = JSON.parse(savedHomepage);
        setHomepageContent(parsedContent);
      } catch (e) {
        console.error("Error parsing homepage content:", e);
        // Se houver erro, inicializa com objeto vazio
        setHomepageContent({ root: { children: [] } });
      }
    } else {
      // Se não houver conteúdo salvo, inicializa com objeto vazio
      setHomepageContent({ root: { children: [] } });
    }
    
    const savedComponents = localStorage.getItem("puckContent");
    if (savedComponents) {
      try {
        setComponentContent(JSON.parse(savedComponents));
      } catch (e) {
        console.error("Error parsing component content:", e);
        setComponentContent({ root: { children: [] } });
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      localStorage.setItem("adminAuthenticated", "true");
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
  };

  const handleComponentContentChange = (data: any) => {
    setComponentContent(data);
    localStorage.setItem("puckContent", JSON.stringify(data));
    toast({
      title: "Conteúdo atualizado",
      description: "As alterações foram salvas com sucesso.",
      variant: "default",
    });
  };
  
  const handleHomepageContentChange = (data: any) => {
    // Verifica se o conteúdo tem componentes reais antes de salvar
    if (data && data.root && data.root.children && data.root.children.length > 0) {
      setHomepageContent(data);
      localStorage.setItem("homepageContent", JSON.stringify(data));
      toast({
        title: "Página inicial atualizada",
        description: "As alterações na página inicial foram salvas com sucesso.",
        variant: "default",
      });
    } else {
      // Se o conteúdo estiver vazio, remove do localStorage para mostrar o layout padrão
      resetHomepageContent();
    }
    
    // Redirect to homepage to see changes
    navigate("/");
  };
  
  const resetHomepageContent = () => {
    localStorage.removeItem("homepageContent");
    setHomepageContent({ root: { children: [] } });
    toast({
      title: "Página inicial redefinida",
      description: "O conteúdo personalizado foi removido e a página padrão foi restaurada.",
      variant: "default",
    });
    
    // Redirect to homepage to see the default layout
    navigate("/");
  };

  const previewHomepage = () => {
    navigate("/");
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }
  
  if (isLoading) {
    return <div className="container mx-auto py-10 px-4 flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Sair
        </button>
      </div>
      
      <Tabs defaultValue="homepage" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="barbeiros">Barbeiros</TabsTrigger>
          <TabsTrigger value="homepage">Editar Homepage</TabsTrigger>
          <TabsTrigger value="editor">Editor de Componentes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agendamentos">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="servicos">
          <Card>
            <CardHeader>
              <CardTitle>Serviços</CardTitle>
              <CardDescription>Gerencie os serviços oferecidos pela barbearia.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade a ser implementada.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="barbeiros">
          <Card>
            <CardHeader>
              <CardTitle>Barbeiros</CardTitle>
              <CardDescription>Gerencie os barbeiros e seus horários.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade a ser implementada.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="homepage" className="min-h-[600px]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Editor da Página Inicial</CardTitle>
                <CardDescription>Modifique completamente a página inicial do site.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={previewHomepage}
                >
                  Visualizar Página
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={resetHomepageContent}
                >
                  Restaurar Padrão
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px]">
                <Puck
                  config={config}
                  data={homepageContent}
                  onPublish={handleHomepageContentChange}
                  renderHeader={() => (
                    <div className="p-4 bg-white border-b">
                      <h3 className="text-lg font-medium">Editor da Página Inicial</h3>
                      <p className="text-sm text-muted-foreground">Arraste e solte blocos para criar sua página personalizada.</p>
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="editor" className="min-h-[600px]">
          <Card>
            <CardHeader>
              <CardTitle>Editor de Componentes</CardTitle>
              <CardDescription>Crie componentes reutilizáveis para o site.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px]">
                <Puck
                  config={config}
                  data={componentContent}
                  onPublish={handleComponentContentChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
