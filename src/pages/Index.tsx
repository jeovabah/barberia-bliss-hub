
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Hero from "../components/Hero";
import Services from "../components/Services";
import BarberProfile from "../components/BarberProfile";
import BookingForm from "../components/BookingForm";

const Index = () => {
  // Default sections order
  const defaultSections = ["hero", "services", "barbers", "booking"];
  
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
  
  useEffect(() => {
    document.title = "BarberBliss | Experiência Premium de Barbearia";
  }, []);

  // Mapping of section types to components
  const sectionComponents = {
    hero: <Hero />,
    services: <Services />,
    barbers: <BarberProfile />,
    booking: <BookingForm />
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50/30">
      <Navbar />
      
      {/* Render sections in the order specified in localStorage */}
      {sectionsOrder.map((section) => (
        <div key={section}>
          {sectionComponents[section]}
        </div>
      ))}
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
