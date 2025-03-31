
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter } from "lucide-react";

interface Specialist {
  id: string;
  name: string;
  role?: string | null;
  bio?: string | null;
  experience?: string | null;
  image?: string | null;
  specialties?: string[];
}

interface BarberProfileProps {
  specialists?: Specialist[];
}

const defaultBarbers = [
  {
    id: "1",
    name: "Alexandre Silva",
    role: "Barbeiro Master",
    bio: "Com mais de 10 anos de experiência, Alexandre é especialista em cortes clássicos e modernos.",
    image: "https://images.unsplash.com/photo-1534885320675-b08aa131cc5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  },
  {
    id: "2",
    name: "Miguel Rodrigues",
    role: "Barbeiro & Estilista",
    bio: "Miguel traz um olhar inovador e técnicas avançadas para criar estilos únicos para cada cliente.",
    image: "https://images.unsplash.com/photo-1584698919261-7175a0250f6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  },
  {
    id: "3",
    name: "Daniel Costa",
    role: "Barbeiro Senior",
    bio: "Especialista em barbas, Daniel é reconhecido por sua atenção aos detalhes e técnicas tradicionais.",
    image: "https://images.unsplash.com/photo-1494858723852-6d93f58ceae6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  }
];

const BarberProfile = ({ specialists = [] }: BarberProfileProps) => {
  // Use the provided specialists or fall back to default barbers if none are provided
  const displayBarbers = specialists.length > 0 ? specialists : defaultBarbers;

  return (
    <section className="py-24 px-4 bg-white" id="barbers">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest mb-2 inline-block text-amber-600">
            Conheça Nossos Profissionais
          </span>
          <h2 className="heading-lg text-amber-950 mb-4">
            Barbeiros Experientes e Qualificados
          </h2>
          <p className="text-muted-foreground">
            Nossa equipe é formada por profissionais altamente treinados e apaixonados pela arte da barbearia, 
            prontos para oferecer o melhor serviço personalizado para você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBarbers.map((barber, index) => (
            <motion.div
              key={barber.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-amber-50/50 rounded-xl overflow-hidden border border-amber-100/50"
            >
              <div className="h-80 overflow-hidden">
                {barber.image ? (
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-800 text-lg">Foto não disponível</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-amber-950 mb-1">{barber.name}</h3>
                <p className="text-amber-600 mb-3">{barber.role || "Barbeiro"}</p>
                <p className="text-muted-foreground text-sm mb-4">{barber.bio || "Profissional especializado em técnicas modernas de barbearia."}</p>
                
                {barber.specialties && barber.specialties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">ESPECIALIDADES</p>
                    <div className="flex flex-wrap gap-1">
                      {barber.specialties.map((specialty, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
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
