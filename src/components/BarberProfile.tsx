
import { motion } from 'framer-motion';
import { Scissors } from "lucide-react";

type Barber = {
  id: number;
  name: string;
  role: string;
  bio: string;
  experience: string;
  specialties: string[];
  image: string;
};

const barbers: Barber[] = [
  {
    id: 1,
    name: "Alexandre Silva",
    role: "Barbeiro Master",
    bio: "Com mais de 15 anos de experiência, Alexandre traz precisão e arte para cada corte de cabelo.",
    experience: "15+ anos",
    specialties: ["Cortes Clássicos", "Estilização de Barba", "Barbear com Toalha Quente"],
    image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974"
  },
  {
    id: 2,
    name: "Miguel Rodriguez",
    role: "Especialista em Estilo",
    bio: "Miguel é especializado em estilos contemporâneos e degradês de precisão que destacam suas características.",
    experience: "8 anos",
    specialties: ["Degradês", "Estilos Modernos", "Cortes Texturizados"],
    image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974"
  },
  {
    id: 3,
    name: "Daniel Costa",
    role: "Experiente em Cuidados",
    bio: "Daniel combina técnicas tradicionais com estética moderna para um visual atemporal.",
    experience: "12 anos",
    specialties: ["Trabalho com Tesoura", "Design de Cabelo", "Barbear de Luxo"],
    image: "https://images.unsplash.com/photo-1557053815-9e5f9c2a0e46?q=80&w=1974"
  }
];

const BarberProfile = () => {
  return (
    <section className="py-24 px-4 bg-amber-50" id="barbers">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest mb-2 inline-block text-amber-600">
            Nossa Equipe
          </span>
          <h2 className="heading-lg mb-4 text-amber-950">Barbeiros Especialistas</h2>
          <p className="text-muted-foreground">
            Conheça nossa equipe de barbeiros especializados dedicados a aperfeiçoar seu estilo com habilidade e precisão.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {barbers.map((barber, index) => (
            <motion.div 
              key={barber.id}
              className="bg-white rounded-2xl p-6 shadow-md flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="aspect-square overflow-hidden rounded-xl mb-6 relative">
                <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-all duration-300 z-10"></div>
                <img 
                  src={barber.image} 
                  alt={barber.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>
              
              <h3 className="text-xl font-bold mb-1 text-amber-950">{barber.name}</h3>
              <p className="text-sm text-amber-600 mb-4">{barber.role}</p>
              
              <p className="text-sm mb-4 text-amber-950/80">{barber.bio}</p>
              
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-amber-950">Experiência:</span>
                  <span className="text-xs text-muted-foreground">{barber.experience}</span>
                </div>
                
                <div>
                  <span className="text-xs font-medium block mb-2 text-amber-950">Especialidades:</span>
                  <div className="flex flex-wrap gap-2">
                    {barber.specialties.map((specialty) => (
                      <span 
                        key={specialty} 
                        className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <Scissors className="w-3 h-3" />
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BarberProfile;
