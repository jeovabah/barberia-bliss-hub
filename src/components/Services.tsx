
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Scissors, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultServices = [
  {
    id: 1,
    title: "Corte Clássico",
    description: "Corte preciso adaptado ao formato do seu rosto e preferências de estilo.",
    price: "R$70",
    duration: "45 min",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070"
  },
  {
    id: 2,
    title: "Aparar & Modelar Barba",
    description: "Esculpir e detalhar com expertise para aperfeiçoar seus pelos faciais.",
    price: "R$50",
    duration: "30 min",
    image: "https://images.unsplash.com/photo-1622296089780-290d715192af?q=80&w=1974"
  },
  {
    id: 3,
    title: "Barbear Premium",
    description: "Tratamento tradicional com toalha quente e precisão de navalha.",
    price: "R$90",
    duration: "45 min",
    image: "https://images.unsplash.com/photo-1493256338651-d82f7272f427?q=80&w=2070"
  },
  {
    id: 4,
    title: "Tratamento Completo",
    description: "Pacote completo incluindo corte de cabelo, modelagem de barba e tratamento facial.",
    price: "R$170",
    duration: "90 min",
    image: "https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=1974"
  }
];

interface Specialist {
  id: string;
  name: string;
  role?: string | null;
  experience?: string | null;
  specialties?: string[];
  image?: string | null;
}

interface ServicesProps {
  specialists?: Specialist[];
}

const ServiceCard = ({ service, index, specialists }: { service: any, index: number, specialists: Specialist[] }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get a random specialist for this service
  const randomSpecialist = specialists && specialists.length > 0 
    ? specialists[Math.floor(Math.random() * specialists.length)]
    : null;
  
  return (
    <motion.div
      className="group relative bg-amber-50 rounded-2xl overflow-hidden h-[400px] shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ 
          backgroundImage: `url(${service.image})`,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
        }}
      ></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transition-all duration-300">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{service.title}</h3>
          <span className="text-white font-medium">{service.price}</span>
        </div>
        
        <p className="text-white/80 mb-4 text-sm">{service.description}</p>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm">{service.duration}</span>
          </div>
          
          {randomSpecialist && (
            <div className="text-white/70 text-sm">
              Especialista: {randomSpecialist.name}
            </div>
          )}
        </div>
        
        <Button 
          size="sm" 
          className={cn(
            "w-full bg-amber-500 text-white hover:bg-amber-600 transition-all duration-300 transform",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          Agendar Serviço
        </Button>
      </div>
    </motion.div>
  );
};

const Services = ({ specialists = [] }: ServicesProps) => {
  return (
    <section className="py-24 px-4" id="services">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest mb-2 inline-block text-amber-600">
            Nossas Especialidades
          </span>
          <h2 className="heading-lg mb-4 text-amber-950">Serviços de Barbearia Especializados</h2>
          <p className="text-muted-foreground">
            Serviços premium personalizados para realçar seu estilo pessoal com precisão e cuidado.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultServices.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
              specialists={specialists} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
