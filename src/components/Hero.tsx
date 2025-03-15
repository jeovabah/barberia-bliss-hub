
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="h-screen relative overflow-hidden flex items-center" id="home">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-black/10 z-10"></div>
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070')] bg-cover bg-center"
        style={{ 
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 1s ease-in-out",
          filter: "grayscale(20%)"
        }}
      ></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-2xl ml-0 md:ml-8 lg:ml-16">
          <span className={`inline-block uppercase text-xs tracking-widest mb-3 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
            Premium Grooming Experience
          </span>
          
          <h1 className={`heading-xl mb-6 text-white transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
            Elevate Your <br />
            <span className="italic">Personal Style</span>
          </h1>
          
          <p className={`text-lg md:text-xl text-white/90 mb-8 max-w-lg transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
            Precision cuts and traditional techniques for the modern gentleman. Experience craftsmanship that defines your signature look.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-4'}`}>
            <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-8">
              Book Appointment
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10 rounded-full px-8">
              Explore Services
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center">
          <span className="text-white/70 text-xs uppercase tracking-widest mb-2">Scroll</span>
          <div className="w-px h-8 bg-white/30 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
