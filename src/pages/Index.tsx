
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { PuckRenderer, config } from "@/lib/puck-config";
import Hero from "../components/Hero";
import Services from "../components/Services";
import BarberProfile from "../components/BarberProfile";
import BookingForm from "../components/BookingForm";
import "@measured/puck/puck.css";

const Index = () => {
  const [puckData, setPuckData] = useState<any>(null);
  const [usePuck, setUsePuck] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Default sections order
  const defaultSections = ["hero", "services", "barbers", "booking"];
  
  useEffect(() => {
    document.title = "BarberBliss | Experiência Premium de Barbearia";
    
    // Check if we have Puck data
    const savedPuckData = localStorage.getItem('puckData');
    if (savedPuckData) {
      try {
        const parsedData = JSON.parse(savedPuckData);
        if (parsedData) {
          // Normalize the data structure
          const normalizedData = {
            root: { props: {} },
            content: Array.isArray(parsedData.content) 
              ? parsedData.content 
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
      } catch (e) {
        console.error("Error parsing Puck data:", e);
        setUsePuck(false);
      }
    } else {
      // Fallback to classic rendering with sections
      setUsePuck(false);
    }
    
    setIsLoading(false);
  }, []);
  
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50/30">
      <Navbar />
      
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

export default Index;
