import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Scissors, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: 1,
    title: "Classic Haircut",
    description: "Precision cut tailored to your face shape and style preferences.",
    price: "$35",
    duration: "45 min",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070"
  },
  {
    id: 2,
    title: "Beard Trim & Shaping",
    description: "Expert sculpting and detailing to perfect your facial hair.",
    price: "$25",
    duration: "30 min",
    image: "https://images.unsplash.com/photo-1622296089780-290d715192af?q=80&w=1974"
  },
  {
    id: 3,
    title: "Premium Shave",
    description: "Traditional hot towel treatment with straight razor precision.",
    price: "$45",
    duration: "45 min",
    image: "https://images.unsplash.com/photo-1493256338651-d82f7272f427?q=80&w=2070"
  },
  {
    id: 4,
    title: "Complete Grooming",
    description: "Full-service package including haircut, beard styling, and facial.",
    price: "$85",
    duration: "90 min",
    image: "https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=1974"
  }
];

const ServiceCard = ({ service, index }: { service: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden h-[400px] shadow-sm"
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
        </div>
        
        <Button 
          size="sm" 
          className={cn(
            "w-full bg-white text-black hover:bg-white/90 transition-all duration-300 transform",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          Book Service
        </Button>
      </div>
    </motion.div>
  );
};

const Services = () => {
  return (
    <section className="py-24 px-4" id="services">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest mb-2 inline-block">
            Our Specialities
          </span>
          <h2 className="heading-lg mb-4">Expert Grooming Services</h2>
          <p className="text-muted-foreground">
            Premium services tailored to enhance your personal style with precision and care.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
