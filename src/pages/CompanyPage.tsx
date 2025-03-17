
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { PuckRenderer, config } from "@/lib/puck-config";
import Hero from "../components/Hero";
import Services from "../components/Services";
import BarberProfile from "../components/BarberProfile";
import BookingForm from "../components/BookingForm";
import { useCompanyFromRoute } from "@/hooks/useCompanyFromRoute";
import "@measured/puck/puck.css";

interface PuckContent {
  content: any[];
  root: {
    props: any;
  };
}

const CompanyPage = () => {
  const navigate = useNavigate();
  const { company, isLoading: isCompanyLoading, error: companyError } = useCompanyFromRoute();
  const [puckData, setPuckData] = useState<PuckContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usePuck, setUsePuck] = useState(false);
  
  // Default sections order
  const defaultSections = ["hero", "services", "barbers", "booking"];
  
  useEffect(() => {
    if (companyError) {
      console.error("Error loading company:", companyError);
      navigate("/not-found");
      return;
    }
    
    if (!isCompanyLoading && company) {
      document.title = `${company.name} | BarberBliss`;
      fetchPuckContent();
    }
  }, [company, companyError, isCompanyLoading, navigate]);
  
  const fetchPuckContent = async () => {
    if (!company) return;
    
    try {
      // Limpar qualquer cache do localStorage
      localStorage.removeItem('puckData');
      
      console.log("Fetching Puck content using function for company:", company.id);
      
      // Usar nossa função para buscar o conteúdo Puck evitando problemas de permissão
      const { data: puckContent, error: puckError } = await supabase
        .rpc('get_puck_content_by_company', { company_id_param: company.id });
      
      console.log("Puck content function result:", puckContent, puckError);
      
      if (puckError) {
        console.error("Error fetching puck content:", puckError);
        console.log("Detailed error:", puckError.message, puckError.details);
        // Sem conteúdo puck, usará seções padrão
        setUsePuck(false);
      } else if (puckContent) {
        console.log("Found Puck content using function:", puckContent);
        // Processar dados puck
        try {
          // Verificar se o conteúdo já é um objeto ou se precisa ser analisado
          const parsedContent = typeof puckContent === 'string' 
            ? JSON.parse(puckContent) 
            : puckContent;
          
          console.log("Parsed content:", parsedContent);
          
          // Garantir que o conteúdo tenha a estrutura esperada
          const normalizedData = {
            root: parsedContent.root || { props: {} },
            content: Array.isArray(parsedContent.content) 
              ? parsedContent.content 
              : []
          };
          
          console.log("Normalized data:", normalizedData);
          
          if (normalizedData.content && normalizedData.content.length > 0) {
            setPuckData(normalizedData);
            setUsePuck(true);
            console.log("Using Puck content:", normalizedData);
          } else {
            console.log("No valid Puck content found, using default sections");
            setUsePuck(false);
          }
        } catch (e) {
          console.error("Error parsing Puck data:", e);
          setUsePuck(false);
        }
      } else {
        console.log("No Puck content found for company:", company.id);
        setUsePuck(false);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mapping of section types to components
  const sectionComponents = {
    hero: <Hero />,
    services: <Services />,
    barbers: <BarberProfile />,
    booking: <BookingForm />
  };

  if (isCompanyLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/30">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50/30">
      <Navbar />
      
      {company && (
        <div className="py-20 bg-amber-600 text-white text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">{company.name}</h1>
            <p className="text-xl max-w-2xl mx-auto">Bem-vindo à nossa barbearia. Oferecemos serviços premium para o homem moderno.</p>
          </div>
        </div>
      )}
      
      {usePuck && puckData ? (
        <div className="puck-renderer-container">
          <PuckRenderer data={puckData} />
        </div>
      ) : (
        // Fallback to classic component rendering
        defaultSections.map((section) => (
          <div key={section}>
            {sectionComponents[section as keyof typeof sectionComponents]}
          </div>
        ))
      )}
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default CompanyPage;
