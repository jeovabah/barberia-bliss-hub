
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { PuckRenderer, config } from "@/lib/puck-config";
import { supabase } from "@/integrations/supabase/client";
import Hero from "../components/Hero";
import Services from "../components/Services";
import BarberProfile from "../components/BarberProfile";
import BookingForm from "../components/BookingForm";

const CompanyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<any>(null);
  const [puckData, setPuckData] = useState<any>(null);
  const [usePuck, setUsePuck] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Default sections order
  const defaultSections = ["hero", "services", "barbers", "booking"];
  
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!slug) {
        setError("URL da empresa não encontrada.");
        setIsLoading(false);
        return;
      }

      try {
        // First, find the company by slug
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('slug', slug)
          .single();

        if (companyError) {
          console.error("Error fetching company:", companyError);
          setError("Empresa não encontrada.");
          setIsLoading(false);
          return;
        }

        setCompany(companyData);
        document.title = `${companyData.name} | BarberBliss`;

        // Then, fetch the Puck content for this company
        const { data: puckData, error: puckError } = await supabase
          .from('puck_content')
          .select('*')
          .eq('company_id', companyData.id)
          .single();

        if (puckError) {
          if (puckError.code !== 'PGRST116') { // Not found
            console.error("Error fetching puck content:", puckError);
          }
          // Fallback to classic rendering
          setUsePuck(false);
        } else if (puckData && puckData.content) {
          // Normalize the data structure
          const normalizedData = {
            root: { props: {} },
            content: Array.isArray(puckData.content.content) 
              ? puckData.content.content 
              : []
          };
          
          if (normalizedData.content.length > 0) {
            setPuckData(normalizedData);
            setUsePuck(true);
          } else {
            setUsePuck(false);
          }
        } else {
          setUsePuck(false);
        }

        setIsLoading(false);
      } catch (e) {
        console.error("Unexpected error:", e);
        setError("Erro ao carregar dados da empresa.");
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [slug]);
  
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
      // If nothing saved or invalid data, use default order
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/30">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/30">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erro</h2>
          <p className="mb-6">{error}</p>
          <a 
            href="/" 
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium inline-block transition-colors"
          >
            Voltar para a Página Inicial
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50/30">
      <Navbar />
      
      {company && (
        <div className="text-center py-4 bg-amber-100">
          <h1 className="text-xl font-bold">{company.name}</h1>
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
