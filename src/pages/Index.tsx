
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Hero from "../components/Hero";
import Services from "../components/Services";
import BarberProfile from "../components/BarberProfile";
import BookingForm from "../components/BookingForm";

const Index = () => {
  // Get sections order from localStorage, or use default if not available
  const sectionsOrder = JSON.parse(localStorage.getItem('homepageSections') || '["hero", "services", "barbers", "booking"]');
  
  useEffect(() => {
    document.title = "BarberBliss | Experiência Premium de Barbearia";
  }, []);

  // Mapping of section types to components
  const sectionComponents: Record<string, JSX.Element> = {
    hero: <Hero />,
    services: <Services />,
    barbers: <BarberProfile />,
    booking: <BookingForm />
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50/30">
      <Navbar />
      
      {/* Render sections in the order specified in localStorage */}
      {sectionsOrder.map((section: string) => (
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
