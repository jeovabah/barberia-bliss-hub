
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
    setIsLoading(true);
    // Load saved sections order
    const defaultSections: SectionType[] = ['hero', 'services', 'barbers', 'booking'];
    
    try {
      // First check if there's Puck data, and extract sections from it
      const puckData = localStorage.getItem('puckData');
      if (puckData) {
        const parsedPuck = JSON.parse(puckData);
        if (parsedPuck && parsedPuck.content && parsedPuck.content.root && parsedPuck.content.root.children) {
          // If we have valid Puck data, extract sections from it
          const sectionsFromPuck: SectionType[] = parsedPuck.content.root.children.map((child: any) => {
            switch(child.type) {
              case 'HeroSection': return 'hero';
              case 'ServicesGrid': return 'services';
              case 'BarbersTeam': return 'barbers';
              case 'BookingSection': return 'booking';
              default: return null;
            }
          }).filter(Boolean);
          
          if (sectionsFromPuck.length > 0) {
            console.log("Extracted sections from Puck data:", sectionsFromPuck);
            setHomepageSections(sectionsFromPuck);
            localStorage.setItem('homepageSections', JSON.stringify(sectionsFromPuck));
          } else {
            // Fallback to homepageSections if Puck data doesn't have valid sections
            fallbackToSavedSections();
          }
        } else {
          fallbackToSavedSections();
        }
      } else {
        fallbackToSavedSections();
      }
    } catch (e) {
      console.error("Error loading homepage data:", e);
      // Set default sections if parsing fails
      localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
      setHomepageSections(defaultSections);
      console.log("Error parsing, set default sections");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fallbackToSavedSections = () => {
    const defaultSections: SectionType[] = ['hero', 'services', 'barbers', 'booking'];
    
    try {
      const savedSections = localStorage.getItem('homepageSections');
      console.log("Loading sections from localStorage:", savedSections);
      
      if (savedSections) {
        const parsed = JSON.parse(savedSections);
        // Validate that we have a non-empty array
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHomepageSections(parsed);
          console.log("Set homepage sections to:", parsed);
        } else {
          // Set default if saved data is invalid
          localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
          setHomepageSections(defaultSections);
          console.log("Invalid data, set default sections");
        }
      } else {
        // Initialize with default sections if none exist
        localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
        setHomepageSections(defaultSections);
        console.log("No saved data, set default sections");
      }
    } catch (e) {
      console.error("Error in fallback loading:", e);
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
    setHomepageSections(sections);
    localStorage.setItem('homepageSections', JSON.stringify(sections));
    
    toast({
      title: "Alterações salvas",
      description: "A página inicial foi atualizada com sucesso.",
      variant: "default",
    });
  };
  
  const resetHomepageContent = () => {
    const defaultSections: SectionType[] = ['hero', 'services', 'barbers', 'booking'];
    setHomepageSections(defaultSections);
    localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
    
    // Clear any Puck data to reset to defaults
    localStorage.removeItem('puckData');
    
    toast({
      title: "Página inicial redefinida",
      description: "A página inicial foi restaurada para o padrão.",
      variant: "default",
    });
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

  console.log("Rendering Admin with sections:", homepageSections);

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
