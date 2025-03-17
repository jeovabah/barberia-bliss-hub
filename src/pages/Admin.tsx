
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
    console.log("Admin component initializing, loading homepage sections");
    loadHomepageSections();
    
    // Force isLoading to false after 2 seconds to prevent infinite loading
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Forcing loading state to complete after timeout");
        setIsLoading(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const loadHomepageSections = () => {
    try {
      // Default values
      const defaultSections: SectionType[] = ['hero', 'services', 'barbers', 'booking'];
      
      // First check if we have Puck data in localStorage
      const puckDataString = localStorage.getItem('puckData');
      
      if (puckDataString) {
        console.log("Puck data found, extracting sections");
        
        try {
          const puckData = JSON.parse(puckDataString);
          
          if (puckData && puckData.content) {
            // Extract sections from Puck data
            let sectionsFromPuck: SectionType[] = [];
            
            if (Array.isArray(puckData.content)) {
              // Direct array of components
              sectionsFromPuck = puckData.content
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
            }
            
            if (sectionsFromPuck.length > 0) {
              console.log("Using sections from Puck data:", sectionsFromPuck);
              setHomepageSections(sectionsFromPuck);
              localStorage.setItem('homepageSections', JSON.stringify(sectionsFromPuck));
              setIsLoading(false);
              return;
            }
          }
          
          console.log("No valid sections found in Puck data, loading from homepageSections");
        } catch (e) {
          console.error("Error parsing Puck data:", e);
        }
      } else {
        console.log("No Puck data found, loading from homepageSections");
      }
      
      // If Puck data not available or invalid, load from homepageSections
      loadFromHomepageSections(defaultSections);
    } catch (e) {
      console.error("Error loading homepage data:", e);
      // Use default values in case of error
      setHomepageSections(['hero', 'services', 'barbers', 'booking']);
      setIsLoading(false);
    }
  };

  const loadFromHomepageSections = (defaultSections: SectionType[]) => {
    try {
      const savedSections = localStorage.getItem('homepageSections');
      console.log("Loading from homepageSections:", savedSections);
      
      if (savedSections) {
        try {
          const parsed = JSON.parse(savedSections);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log("Sections loaded successfully from homepageSections:", parsed);
            setHomepageSections(parsed);
          } else {
            console.log("Invalid data in homepageSections, using default");
            localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
            setHomepageSections(defaultSections);
          }
        } catch (e) {
          console.error("Error parsing homepageSections:", e);
          localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
          setHomepageSections(defaultSections);
        }
      } else {
        console.log("No homepageSections found, using default");
        localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
        setHomepageSections(defaultSections);
      }
      
      // Always ensure loading state is completed
      setIsLoading(false);
    } catch (e) {
      console.error("Error in loadFromHomepageSections:", e);
      localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
      setHomepageSections(defaultSections);
      setIsLoading(false);
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
    console.log("Saving homepage changes with sections:", sections);
    setHomepageSections(sections);
    localStorage.setItem('homepageSections', JSON.stringify(sections));
    
    toast({
      title: "Alterações salvas",
      description: "A página inicial foi atualizada com sucesso.",
    });
  };
  
  const resetHomepageContent = () => {
    console.log("Resetting homepage content");
    const defaultSections: SectionType[] = ['hero', 'services', 'barbers', 'booking'];
    setHomepageSections(defaultSections);
    localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
    
    // Clear Puck data
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
