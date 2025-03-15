
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CalendarDays, Scissors, MessageCircle } from "lucide-react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('book-now');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="h-screen relative overflow-hidden flex items-center" id="home">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070')] bg-cover bg-center"
        style={{ 
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 1s ease-in-out",
          filter: "sepia(20%)"
        }}
      ></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-2xl ml-0 md:ml-8 lg:ml-16">
          <span className={`inline-block uppercase text-xs tracking-widest mb-3 p-2 bg-amber-500/10 backdrop-blur-md border border-amber-500/20 rounded-full transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
            Experiência Premium de Barbearia
          </span>
          
          <h1 className={`heading-xl mb-6 text-white text-shadow-sm transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
            Eleve Seu <br />
            <span className="italic text-amber-300">Estilo Pessoal</span>
          </h1>
          
          <p className={`text-lg md:text-xl text-white/90 mb-8 max-w-lg transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
            Cortes precisos e técnicas tradicionais para o homem moderno. Experimente o trabalho artesanal que define seu visual assinatura.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
            <Button 
              size="lg" 
              onClick={scrollToBooking}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 rounded-full group"
            >
              <CalendarDays className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Agendar Horário
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToServices}
              className="border-amber-400 bg-amber-400/10 text-amber-100 hover:bg-amber-500/30 hover:border-amber-300 hover:text-white font-medium rounded-full transition-all duration-300 group backdrop-blur-sm"
            >
              <Scissors className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Explorar Serviços
            </Button>
          </div>
        </div>
      </div>
      
      {/* Chat Bubble Scheduling Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={scrollToBooking}
          className="w-16 h-16 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          <span className="sr-only">Agendar</span>
        </Button>
      </div>
      
      {/* Scroll Indicator */}
      <div className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center">
          <span className="text-white/70 text-xs uppercase tracking-widest mb-2">Rolar</span>
          <div className="w-px h-8 bg-white/30 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
