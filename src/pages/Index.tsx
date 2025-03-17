
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { PuckRenderer } from "@/lib/puck-config";
import Hero from "../components/Hero";
import Services from "../components/Services";
import BarberProfile from "../components/BarberProfile";
import BookingForm from "../components/BookingForm";

const Index = () => {
  const [puckContent, setPuckContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.title = "BarberBliss | Experiência Premium de Barbearia";
    
    // Load content from localStorage
    const savedContent = localStorage.getItem("homepageContent");
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent && parsedContent.root && parsedContent.root.children && parsedContent.root.children.length > 0) {
          setPuckContent(parsedContent);
        }
      } catch (e) {
        console.error("Error parsing stored content:", e);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Show loading state
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  // If we have Puck content, render it. Otherwise, render the default components
  if (puckContent && puckContent.root && puckContent.root.children && puckContent.root.children.length > 0) {
    return (
      <div className="min-h-screen overflow-x-hidden bg-amber-50/30">
        <Navbar />
        <PuckRenderer data={puckContent} />
        <Footer />
        <Toaster />
      </div>
    );
  }

  // Default UI when no custom content is available
  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50/30">
      <Navbar />
      <Hero />
      <Services />
      <BarberProfile />
      <BookingForm />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
