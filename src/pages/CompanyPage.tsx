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

// Define the PuckContent interface to ensure consistent data structure
interface PuckContent {
  content: any[];
  root: {
    props: any;
  };
}

// Define the Specialist interface based on the database schema
interface Specialist {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  experience: string | null;
  image: string | null;
  specialties: string[] | any; // Updated to handle JSON from Supabase
}

const CompanyPage = () => {
  const navigate = useNavigate();
  const { company, isLoading: isCompanyLoading, error: companyError } = useCompanyFromRoute();
  const [puckData, setPuckData] = useState<PuckContent | null>(null);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
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
      fetchSpecialists();
    }
  }, [company, companyError, isCompanyLoading, navigate]);
  
  // Helper function to process specialties from database
  const processSpecialties = (specialtiesData: any): string[] => {
    if (!specialtiesData) return [];
    if (Array.isArray(specialtiesData)) return specialtiesData;
    // If it's a JSON string, parse it
    if (typeof specialtiesData === 'string') {
      try {
        const parsed = JSON.parse(specialtiesData);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    // If it's already a JSON object from Supabase
    return [];
  };
  
  const fetchSpecialists = async () => {
    if (!company) return;
    
    try {
      const { data, error } = await supabase
        .from('specialists')
        .select('*')
        .eq('company_id', company.id);
        
      if (error) {
        console.error("Error fetching specialists:", error);
      } else {
        // Process the data to ensure specialties is properly formatted
        const processedData = data?.map(specialist => ({
          ...specialist,
          specialties: processSpecialties(specialist.specialties)
        })) || [];
        
        setSpecialists(processedData);
      }
    } catch (error) {
      console.error("Unexpected error fetching specialists:", error);
    }
  };
  
  const fetchPuckContent = async () => {
    if (!company) return;
    
    try {
      // Clear any localStorage cache
      localStorage.removeItem('puckData');
      
      console.log("Fetching Puck content for company ID:", company.id);
      
      // Direct query to puck_content table to get the content
      const { data: directData, error: directError } = await supabase
        .from('puck_content')
        .select('*')
        .eq('company_id', company.id)
        .maybeSingle();
        
      console.log("Direct query result:", directData, directError);
      
      if (directData && directData.content) {
        // Extract the content field from directData
        const contentData = directData.content as any;
        
        // Validate that it has the expected structure
        if (contentData && 
            typeof contentData === 'object' && 
            'content' in contentData && 
            'root' in contentData && 
            Array.isArray(contentData.content)) {
          console.log("Found valid Puck content directly:", contentData);
          
          // It has the right shape
          const validPuckData: PuckContent = {
            content: contentData.content,
            root: {
              props: contentData.root && typeof contentData.root === 'object' && 
                     contentData.root.props ? contentData.root.props : {}
            }
          };
          
          setPuckData(validPuckData);
          setUsePuck(true);
          setIsLoading(false);
          return;
        }
      }
      
      // If direct query didn't work or had invalid data, try the function
      const { data: puckContent, error: puckError } = await supabase
        .rpc('get_puck_content_by_company', { company_id_param: company.id });
      
      console.log("Function result for Puck content:", puckContent, puckError);
      
      if (puckError) {
        console.error("Error fetching puck content:", puckError);
        console.log("Detailed error:", puckError.message, puckError.details);
        setUsePuck(false);
      } else if (puckContent) {
        console.log("Found Puck content:", puckContent);
        
        try {
          // Default empty structure to use if data is malformed
          const defaultContent: PuckContent = {
            content: [],
            root: { props: {} }
          };
          
          // Process the content based on its structure
          let validPuckData: PuckContent;
          
          // Check if puckContent is an object with both content and root properties
          if (typeof puckContent === 'object' && puckContent !== null && 
              'content' in puckContent && 'root' in puckContent && 
              Array.isArray((puckContent as any).content)) {
            // It has the right shape, validate deeper structure
            const contentData = puckContent as any;
            validPuckData = {
              content: Array.isArray(contentData.content) ? contentData.content : [],
              root: {
                props: contentData.root && typeof contentData.root === 'object' && 
                       contentData.root.props ? contentData.root.props : {}
              }
            };
          } else if (typeof puckContent === 'string') {
            // Try to parse string content
            try {
              const parsedContent = JSON.parse(puckContent);
              if (parsedContent && 
                  'content' in parsedContent && Array.isArray(parsedContent.content) && 
                  'root' in parsedContent && typeof parsedContent.root === 'object') {
                validPuckData = {
                  content: parsedContent.content,
                  root: {
                    props: parsedContent.root.props || {}
                  }
                };
              } else {
                console.log("Parsed content missing required structure");
                validPuckData = defaultContent;
              }
            } catch (parseError) {
              console.error("Error parsing string content:", parseError);
              validPuckData = defaultContent;
            }
          } else {
            // Fallback to default content
            console.log("Content has invalid structure:", puckContent);
            validPuckData = defaultContent;
          }
          
          setPuckData(validPuckData);
          setUsePuck(true);
        } catch (e) {
          console.error("Error processing Puck data:", e);
          setPuckData({
            content: [],
            root: { props: {} }
          });
          setUsePuck(false);
        }
      } else {
        console.log("No Puck content found for company:", company.id);
        setUsePuck(false);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setUsePuck(false);
    } finally {
      setIsLoading(false);
    }
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
      {usePuck && puckData ? (
        <div className="puck-renderer-container">
          <PuckRenderer data={puckData} config={config} />
        </div>
      ) : (
        <>
          <Hero />
          <Services />
          <BarberProfile 
            specialists={specialists} 
            backgroundColor="bg-amber-50/50"
            textColor="text-amber-950"
            accentColor="text-amber-600"
          />
          <BookingForm 
            specialists={specialists}
            companyId={company?.id}
            companyName={company?.name}
          />
        </>
      )}
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default CompanyPage;
