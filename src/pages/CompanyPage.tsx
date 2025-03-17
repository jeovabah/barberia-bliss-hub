
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
      // Fetch puck content for this company
      const { data: puckData, error: puckError } = await supabase
        .from('puck_content')
        .select('content')
        .eq('company_id', company.id)
        .single();
      
      if (puckError) {
        console.error("Error fetching puck content:", puckError);
        // No puck content, will use default sections
        setUsePuck(false);
      } else if (puckData && puckData.content) {
        // Process puck data
        try {
          // Check if content is already an object or if it needs parsing
          const parsedContent = typeof puckData.content === 'string' 
            ? JSON.parse(puckData.content) 
            : puckData.content;
          
          // Ensure the content has the expected structure
          const normalizedData = {
            root: parsedContent.root || { props: {} },
            content: Array.isArray(parsedContent.content) 
              ? parsedContent.content 
              : []
          };
          
          if (normalizedData.content.length > 0) {
            setPuckData(normalizedData);
            setUsePuck(true);
          } else {
            setUsePuck(false);
          }
        } catch (e) {
          console.error("Error parsing Puck data:", e);
          setUsePuck(false);
        }
      } else {
        setUsePuck(false);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get sections order from localStorage, or use default if not available
  const getSectionsOrder = () => {
    try {
      const saved = localStorage.getItem('homepageSections');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate that we have a non-empty array
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // If nothing saved or invalid data, initialize with default order
      localStorage.setItem('homepageSections', JSON.stringify(defaultSections));
      return defaultSections;
    } catch (e) {
      console.error("Error loading sections order:", e);
      return defaultSections;
    }
  };
  
  const sectionsOrder = getSectionsOrder();
  
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
        sectionsOrder.map((section) => (
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
