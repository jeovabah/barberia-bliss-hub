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
  }, []);

  const loadHomepageSections = () => {
    setIsLoading(true);
    
    try {
      // Default values
      const defaultSections: SectionType[] = ['hero', 'services', 'barbers', 'booking'];
      
      // First check if we have Puck data in localStorage
      const puckDataString = localStorage.getItem('puckData');
      
      if (puckDataString) {
        console.log("Puck data found, extracting sections");
        
        try {
          const puckData = JSON.parse(puckDataString);
          
          if (puckData && puckData.content && puckData.content.children) {
            const sectionsFromPuck: SectionType[] = puckData.content.children
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
              console.log("Using sections from Puck data:", sectionsFromPuck);
              setHomepageSections(sectionsFromPuck);
              // Save the sections for future reference
              localStorage.setItem('homepageSections', JSON.stringify(sectionsFromPuck));
            } else {
              console.log("Puck data doesn't contain valid sections, loading from homepageSections");
              loadFromHomepageSections(defaultSections);
            }
          } else {
            console.log("Invalid Puck data structure, loading from homepageSections");
            loadFromHomepageSections(defaultSections);
          }
        } catch (e) {
          console.error("Error parsing Puck data:", e);
          loadFromHomepageSections(defaultSections);
        }
      } else {
        console.log("No Puck data found, loading from homepageSections");
        loadFromHomepageSections(defaultSections);
      }
    } catch (e) {
      console.error("Error loading homepage data:", e);
      // Use default values in case of error
      setHomepageSections(['hero', 'services', 'barbers', 'booking']);
    } finally {
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
    } catch (e) {
      console.error("Error in loadFromHomepageSections:", e);
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
    console.log("Saving homepage changes with sections:", sections);
    setHomepageSections(sections);
    localStorage.setItem('homepageSections', JSON.stringify(sections));
    
    toast({
      title: "Changes saved",
      description: "The homepage has been updated successfully.",
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
      title: "Homepage reset",
      description: "The homepage has been restored to default.",
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
          <p>Loading admin panel...</p>
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
