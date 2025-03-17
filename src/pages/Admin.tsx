
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { config } from "@/lib/puck-config";
import { toast } from "@/components/ui/use-toast";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("adminAuthenticated") === "true"
  );
  
  // Store separate content for homepage and about page
  const [homepageContent, setHomepageContent] = useState(() => {
    const savedData = localStorage.getItem("homepageContent");
    return savedData ? JSON.parse(savedData) : { root: { children: [] } };
  });
  
  const [componentContent, setComponentContent] = useState(() => {
    const savedData = localStorage.getItem("puckContent");
    return savedData ? JSON.parse(savedData) : { root: { children: [] } };
  });

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
    setHomepageContent(data);
    localStorage.setItem("homepageContent", JSON.stringify(data));
    toast({
      title: "Página inicial atualizada",
      description: "As alterações na página inicial foram salvas com sucesso.",
      variant: "default",
    });
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
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
      
      <Tabs defaultValue="agendamentos" className="w-full">
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
            <CardHeader>
              <CardTitle>Editor da Página Inicial</CardTitle>
              <CardDescription>Modifique completamente a página inicial do site.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px]">
                <Puck
                  config={config}
                  data={homepageContent}
                  onPublish={handleHomepageContentChange}
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
