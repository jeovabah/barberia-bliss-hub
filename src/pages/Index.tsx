
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
        // Verifica se o conteúdo salvo tem componentes reais
        if (parsedContent && 
            parsedContent.root && 
            parsedContent.root.children && 
            parsedContent.root.children.length > 0) {
          console.log("Conteúdo Puck válido encontrado, usando layout personalizado");
          setPuckContent(parsedContent);
        } else {
          console.log("Conteúdo Puck encontrado, mas está vazio. Usando layout padrão.");
          setPuckContent(null);
        }
      } catch (e) {
        console.error("Error parsing stored content:", e);
        setPuckContent(null);
      }
    } else {
      console.log("Nenhum conteúdo Puck encontrado. Usando layout padrão.");
    }
    
    setIsLoading(false);
  }, []);

  // Show loading state
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  // If we have valid Puck content with actual components, render it. Otherwise, render the default components
  if (puckContent && 
      puckContent.root && 
      puckContent.root.children && 
      puckContent.root.children.length > 0) {
    console.log("Renderizando conteúdo personalizado do Puck");
    return (
      <div className="min-h-screen overflow-x-hidden bg-amber-50/30">
        <Navbar />
        <PuckRenderer data={puckContent} />
        <Footer />
        <Toaster />
      </div>
    );
  }

  // Default UI when no custom content is available or when Puck content is empty
  console.log("Renderizando layout padrão");
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
