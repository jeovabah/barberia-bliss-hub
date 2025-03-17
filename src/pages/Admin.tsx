
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import { Puck, PuckPreview } from "@measured/puck";
import "@measured/puck/puck.css";
import { config } from "@/lib/puck-config";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("adminAuthenticated") === "true"
  );
  const [puckData, setPuckData] = useState(() => {
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

  const handlePuckChange = (data: any) => {
    setPuckData(data);
    localStorage.setItem("puckContent", JSON.stringify(data));
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
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="barbeiros">Barbeiros</TabsTrigger>
          <TabsTrigger value="editor">Editor Visual</TabsTrigger>
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
        
        <TabsContent value="editor" className="min-h-[600px]">
          <Card>
            <CardHeader>
              <CardTitle>Editor Visual</CardTitle>
              <CardDescription>Modifique o conteúdo da página principal.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px]">
                <Puck
                  config={config}
                  data={puckData}
                  onPublish={handlePuckChange}
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
