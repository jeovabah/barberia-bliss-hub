import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import BarberProfile from "@/components/BarberProfile";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

// Definindo o conteúdo padrão da homepage
const defaultHomepageContent = {
  root: {
    children: [
      {
        type: "HeroSection",
        props: {
          title: "Eleve Seu Estilo Pessoal",
          subtitle: "Experiência Premium de Barbearia",
          description: "Cortes precisos e técnicas tradicionais para o homem moderno. Experimente o trabalho artesanal que define seu visual assinatura.",
          imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070",
          primaryButtonLabel: "Agendar Horário",
          primaryButtonLink: "#book-now",
          secondaryButtonLabel: "Explorar Serviços",
          secondaryButtonLink: "#services",
        }
      },
      {
        type: "ServicesGrid",
        props: {
          title: "Serviços de Barbearia Especializados",
          subtitle: "Nossas Especialidades",
          description: "Serviços premium personalizados para realçar seu estilo pessoal com precisão e cuidado.",
          services: [
            {
              id: "1",
              title: "Corte Clássico",
              description: "Corte preciso adaptado ao formato do seu rosto e preferências de estilo.",
              price: "R$70",
              duration: "45 min",
              image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070"
            },
            {
              id: "2",
              title: "Aparar & Modelar Barba",
              description: "Esculpir e detalhar com expertise para aperfeiçoar seus pelos faciais.",
              price: "R$50",
              duration: "30 min",
              image: "https://images.unsplash.com/photo-1622296089780-290d715192af?q=80&w=1974"
            },
            {
              id: "3",
              title: "Barbear Premium",
              description: "Tratamento tradicional com toalha quente e precisão de navalha.",
              price: "R$90",
              duration: "45 min",
              image: "https://images.unsplash.com/photo-1493256338651-d82f7272f427?q=80&w=2070"
            },
            {
              id: "4",
              title: "Tratamento Completo",
              description: "Pacote completo incluindo corte de cabelo, modelagem de barba e tratamento facial.",
              price: "R$170",
              duration: "90 min",
              image: "https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=1974"
            }
          ]
        }
      },
      {
        type: "BarbersTeam",
        props: {
          title: "Barbeiros Especialistas",
          subtitle: "Nossa Equipe",
          description: "Conheça nossa equipe de barbeiros especializados dedicados a aperfeiçoar seu estilo com habilidade e precisão.",
          barbers: [
            {
              id: "1",
              name: "Alexandre Silva",
              role: "Barbeiro Master",
              bio: "Com mais de 15 anos de experiência, Alexandre traz precisão e arte para cada corte de cabelo.",
              experience: "15+ anos",
              specialties: ["Cortes Clássicos", "Estilização de Barba"],
              image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974"
            },
            {
              id: "2",
              name: "Miguel Rodriguez",
              role: "Especialista em Estilo",
              bio: "Miguel é especializado em estilos contemporâneos e degradês de precisão que destacam suas características.",
              experience: "8 anos",
              specialties: ["Degradês", "Estilos Modernos"],
              image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974"
            },
            {
              id: "3",
              name: "Daniel Costa",
              role: "Experiente em Cuidados",
              bio: "Daniel combina técnicas tradicionais com estética moderna para um visual atemporal.",
              experience: "12 anos",
              specialties: ["Design de Cabelo", "Barbear de Luxo"],
              image: "https://images.unsplash.com/photo-1557053815-9e5f9c2a0e46?q=80&w=1974"
            }
          ]
        }
      },
      {
        type: "BookingSection",
        props: {
          title: "Agende Seu Horário",
          subtitle: "Marque Agora",
          description: "Reserve um horário com nossos barbeiros especializados e experimente um serviço de barbearia de alta qualidade.",
          buttonLabel: "Agendar",
          backgroundColor: "bg-amber-100"
        }
      }
    ]
  }
};

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("adminAuthenticated") === "true"
  );
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved data
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

  const saveHomepageChanges = () => {
    // Since we're removing Puck, we'll just save a simple flag that indicates
    // any custom changes would be applied
    localStorage.setItem("useDefaultLayout", "true");
    toast({
      title: "Alterações salvas",
      description: "As alterações na página inicial foram salvas com sucesso.",
      variant: "default",
    });
  };
  
  const resetHomepageContent = () => {
    localStorage.removeItem("homepageContent");
    localStorage.removeItem("useDefaultLayout");
    toast({
      title: "Página inicial redefinida",
      description: "O conteúdo personalizado foi removido e a página padrão foi restaurada.",
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Preview da Página Inicial</CardTitle>
                <CardDescription>Visualize como a homepage será exibida para seus clientes.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={previewHomepage}
                >
                  Visualizar em Tela Cheia
                </Button>
                <Button 
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Salvar Alterações" : "Editar Conteúdo"}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={resetHomepageContent}
                >
                  Restaurar Padrão
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden border-t">
              <div className="bg-amber-50/30 scale-[0.8] origin-top-left transform">
                <div className="w-[125%] h-[800px] overflow-auto">
                  <Hero />
                  <Services />
                  <BarberProfile />
                  <BookingForm />
                  <Footer />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
