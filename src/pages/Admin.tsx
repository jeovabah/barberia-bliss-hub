
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import PageEditor from "@/components/PageEditor";

type SectionType = 'hero' | 'services' | 'barbers' | 'booking';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("adminAuthenticated") === "true"
  );
  
  const [isLoading, setIsLoading] = useState(true);
  const [homepageSections, setHomepageSections] = useState<SectionType[]>(['hero', 'services', 'barbers', 'booking']);

  useEffect(() => {
    console.log("Admin component iniciando, carregando seções da página inicial");
    loadHomepageSections();
  }, []);

  const loadHomepageSections = () => {
    setIsLoading(true);
    
    try {
      // Valores padrão
      const defaultSections: SectionType[] = ['hero', 'services', 'barbers', 'booking'];
      
      // Primeiro verificar se temos dados do Puck no localStorage
      const puckDataString = localStorage.getItem('puckData');
      
      if (puckDataString) {
        console.log("Dados do Puck encontrados, extraindo seções");
        
        try {
          const puckData = JSON.parse(puckDataString);
          
          if (puckData && puckData.content && puckData.content.root && puckData.content.root.children) {
            const sectionsFromPuck: SectionType[] = puckData.content.root.children
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
            
            if (sectionsFromPuck.length > 0) {
              console.log("Usando seções dos dados do Puck:", sectionsFromPuck);
              setHomepageSections(sectionsFromPuck);
              // Salvar as seções para referência futura
              localStorage.setItem('homepageSections', JSON.stringify(sectionsFromPuck));
            } else {
              console.log("Dados do Puck não contêm seções válidas, carregando de homepageSections");
              loadFromHomepageSections(defaultSections);
            }
          } else {
            console.log("Estrutura de dados do Puck inválida, carregando de homepageSections");
            loadFromHomepageSections(defaultSections);
          }
        } catch (e) {
          console.error("Erro ao analisar dados do Puck:", e);
          loadFromHomepageSections(defaultSections);
        }
      } else {
        console.log("Nenhum dado do Puck encontrado, carregando de homepageSections");
        loadFromHomepageSections(defaultSections);
      }
    } catch (e) {
      console.error("Erro ao carregar dados da página inicial:", e);
      // Usar valores padrão em caso de erro
      setHomepageSections(['hero', 'services', 'barbers', 'booking']);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHomepageSections = (defaultSections: SectionType[]) => {
    try {
      const savedSections = localStorage.getItem('homepageSections');
      console.log("Carregando de homepageSections:", savedSections);
      
      if (savedSections) {
        try {
          const parsed = JSON.parse(savedSections);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log("Seções carregadas com sucesso de homepageSections:", parsed);
            setHomepageSections(parsed);
          } else {
            console.log("Dados inválidos em homepageSections, usando padrão");
            localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
            setHomepageSections(defaultSections);
          }
        } catch (e) {
          console.error("Erro ao analisar homepageSections:", e);
          localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
          setHomepageSections(defaultSections);
        }
      } else {
        console.log("Nenhum homepageSections encontrado, usando padrão");
        localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
        setHomepageSections(defaultSections);
      }
    } catch (e) {
      console.error("Erro em loadFromHomepageSections:", e);
      localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
      setHomepageSections(defaultSections);
    }
  };

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

  const saveHomepageChanges = (sections: SectionType[]) => {
    console.log("Salvando alterações da página inicial com seções:", sections);
    setHomepageSections(sections);
    localStorage.setItem('homepageSections', JSON.stringify(sections));
    
    toast({
      title: "Alterações salvas",
      description: "A página inicial foi atualizada com sucesso.",
    });
  };
  
  const resetHomepageContent = () => {
    console.log("Redefinindo conteúdo da página inicial");
    const defaultSections: SectionType[] = ['hero', 'services', 'barbers', 'booking'];
    setHomepageSections(defaultSections);
    localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
    
    // Limpar dados do Puck
    localStorage.removeItem('puckData');
    
    toast({
      title: "Página inicial redefinida",
      description: "A página inicial foi restaurada para o padrão.",
    });
  };

  const previewHomepage = () => {
    navigate("/");
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p>Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  console.log("Renderizando Admin com seções:", homepageSections);

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
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="barbeiros">Barbeiros</TabsTrigger>
          <TabsTrigger value="homepage">Editar Homepage</TabsTrigger>
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
        
        <TabsContent value="homepage">
          <PageEditor 
            initialSections={homepageSections}
            onSave={saveHomepageChanges}
            onPreview={previewHomepage}
            onReset={resetHomepageContent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
