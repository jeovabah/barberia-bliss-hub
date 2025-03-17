import { Config } from "@measured/puck";
import { ComponentProps } from "react";

// Components for Puck Editor
const Heading = ({ text, size = "large" }: { text: string; size?: "small" | "medium" | "large" }) => {
  const className = 
    size === "small" 
      ? "text-xl font-bold mb-2" 
      : size === "medium" 
        ? "text-2xl font-bold mb-3" 
        : "text-4xl font-bold mb-4";
  
  return <h2 className={className}>{text}</h2>;
};

const TextBlock = ({ content }: { content: string }) => {
  return <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: content }} />;
};

const ImageBlock = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  return <img src={src} alt={alt} className={`rounded-lg ${className || "w-full h-auto"}`} />;
};

const Button = ({ 
  label, 
  href, 
  variant = "primary" 
}: { 
  label: string; 
  href: string; 
  variant?: "primary" | "secondary" 
}) => {
  const className = variant === "primary" 
    ? "bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium inline-block transition-colors" 
    : "bg-white text-amber-800 border border-amber-800 hover:bg-amber-50 px-6 py-3 rounded-md font-medium inline-block transition-colors";
  
  return <a href={href} className={className}>{label}</a>;
};

const ServiceCard = ({ 
  title, 
  price, 
  description, 
  imageUrl 
}: { 
  title: string; 
  price: string;
  description: string;
  imageUrl?: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {imageUrl && (
        <div className="h-48 overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{title}</h3>
          <span className="text-amber-600 font-bold">{price}</span>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const CardBlock = ({ 
  title, 
  content, 
  imageUrl, 
  buttonLabel, 
  buttonLink 
}: { 
  title: string; 
  content: string;
  imageUrl?: string;
  buttonLabel?: string;
  buttonLink?: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {imageUrl && (
        <div className="h-48 overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 mb-4">{content}</p>
        {buttonLabel && buttonLink && (
          <a 
            href={buttonLink} 
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded inline-block transition-colors"
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </div>
  );
};

// New Hero Section Component
const HeroSection = ({ 
  title, 
  subtitle, 
  description, 
  imageUrl, 
  primaryButtonLabel, 
  primaryButtonLink, 
  secondaryButtonLabel, 
  secondaryButtonLink 
}: { 
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  primaryButtonLabel?: string;
  primaryButtonLink?: string;
  secondaryButtonLabel?: string;
  secondaryButtonLink?: string;
}) => {
  return (
    <section className="h-screen relative overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-2xl ml-0 md:ml-8 lg:ml-16">
          {subtitle && (
            <span className="inline-block uppercase text-xs tracking-widest mb-3 p-2 bg-amber-500/10 backdrop-blur-md border border-amber-500/20 rounded-full">
              {subtitle}
            </span>
          )}
          
          <h1 className="text-5xl font-bold mb-6 text-white text-shadow-sm">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {primaryButtonLabel && primaryButtonLink && (
              <a 
                href={primaryButtonLink} 
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium inline-block transition-colors text-center"
              >
                {primaryButtonLabel}
              </a>
            )}
            
            {secondaryButtonLabel && secondaryButtonLink && (
              <a 
                href={secondaryButtonLink} 
                className="border-amber-400 bg-amber-400/10 text-amber-100 hover:bg-amber-500/30 hover:border-amber-300 hover:text-white font-medium rounded-md transition-all duration-300 px-6 py-3 text-center backdrop-blur-sm"
              >
                {secondaryButtonLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// Services Grid Component
const ServicesGrid = ({ 
  title, 
  subtitle, 
  description,
  services
}: { 
  title: string;
  subtitle?: string;
  description?: string;
  services: Array<{
    id: string;
    title: string;
    price: string;
    description: string;
    duration: string;
    image: string;
  }>;
}) => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {subtitle && (
            <span className="text-xs uppercase tracking-widest mb-2 inline-block text-amber-600">
              {subtitle}
            </span>
          )}
          <h2 className="text-3xl font-bold mb-4 text-amber-950">{title}</h2>
          {description && (
            <p className="text-gray-600">
              {description}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-amber-50 rounded-2xl overflow-hidden h-[400px] shadow-md relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${service.image})` }}
              ></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  <span className="text-white font-medium">{service.price}</span>
                </div>
                
                <p className="text-white/80 mb-4 text-sm">{service.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-white/70 text-sm">{service.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Barbers Team Component
const BarbersTeam = ({ 
  title, 
  subtitle, 
  description,
  barbers
}: { 
  title: string;
  subtitle?: string;
  description?: string;
  barbers: Array<{
    id: string;
    name: string;
    role: string;
    bio: string;
    experience: string;
    specialties: string[];
    image: string;
  }>;
}) => {
  return (
    <section className="py-24 px-4 bg-amber-50">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          {subtitle && (
            <span className="text-xs uppercase tracking-widest mb-2 inline-block text-amber-600">
              {subtitle}
            </span>
          )}
          <h2 className="text-3xl font-bold mb-4 text-amber-950">{title}</h2>
          {description && (
            <p className="text-gray-600">
              {description}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {barbers.map((barber) => (
            <div key={barber.id} className="bg-white rounded-2xl p-6 shadow-md flex flex-col">
              <div className="aspect-square overflow-hidden rounded-xl mb-6 relative">
                <img 
                  src={barber.image} 
                  alt={barber.name} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              <h3 className="text-xl font-bold mb-1 text-amber-950">{barber.name}</h3>
              <p className="text-sm text-amber-600 mb-4">{barber.role}</p>
              
              <p className="text-sm mb-4 text-amber-950/80">{barber.bio}</p>
              
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-amber-950">Experiência:</span>
                  <span className="text-xs text-gray-600">{barber.experience}</span>
                </div>
                
                <div>
                  <span className="text-xs font-medium block mb-2 text-amber-950">Especialidades:</span>
                  <div className="flex flex-wrap gap-2">
                    {barber.specialties.map((specialty) => (
                      <span 
                        key={specialty} 
                        className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Booking Section
const BookingSection = ({ 
  title, 
  subtitle, 
  description,
  buttonLabel,
  backgroundColor = "bg-amber-100"
}: { 
  title: string;
  subtitle?: string;
  description?: string;
  buttonLabel?: string;
  backgroundColor?: string;
}) => {
  return (
    <section className={`py-24 px-4 ${backgroundColor}`} id="book-now">
      <div className="container mx-auto text-center">
        {subtitle && (
          <span className="text-xs uppercase tracking-widest mb-2 inline-block text-amber-600">
            {subtitle}
          </span>
        )}
        <h2 className="text-3xl font-bold mb-4 text-amber-950">{title}</h2>
        {description && (
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {description}
          </p>
        )}
        
        {buttonLabel && (
          <a
            href="#contact"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md font-medium inline-block transition-colors"
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </section>
  );
};

export const config: Config = {
  components: {
    Heading: {
      render: Heading,
      defaultProps: {
        text: "Título da Seção",
        size: "large",
      },
      fields: {
        text: {
          type: "text",
          label: "Texto",
        },
        size: {
          type: "select",
          label: "Tamanho",
          options: [
            { label: "Pequeno", value: "small" },
            { label: "Médio", value: "medium" },
            { label: "Grande", value: "large" },
          ],
        },
      },
    },
    TextBlock: {
      render: TextBlock,
      defaultProps: {
        content: "<p>Adicione seu conteúdo aqui...</p>",
      },
      fields: {
        content: {
          type: "textarea",
          label: "Conteúdo",
        },
      },
    },
    ImageBlock: {
      render: ImageBlock,
      defaultProps: {
        src: "https://via.placeholder.com/800x400",
        alt: "Imagem",
      },
      fields: {
        src: {
          type: "text",
          label: "URL da imagem",
        },
        alt: {
          type: "text",
          label: "Texto alternativo",
        },
        className: {
          type: "text",
          label: "Classes CSS (opcional)",
        },
      },
    },
    Button: {
      render: Button,
      defaultProps: {
        label: "Clique Aqui",
        href: "#",
        variant: "primary",
      },
      fields: {
        label: {
          type: "text",
          label: "Texto do botão",
        },
        href: {
          type: "text",
          label: "Link",
        },
        variant: {
          type: "select",
          label: "Estilo",
          options: [
            { label: "Primário", value: "primary" },
            { label: "Secundário", value: "secondary" },
          ],
        },
      },
    },
    ServiceCard: {
      render: ServiceCard,
      defaultProps: {
        title: "Corte de Cabelo",
        price: "R$ 35,00",
        description: "Corte profissional com técnicas modernas.",
        imageUrl: "https://via.placeholder.com/300x200",
      },
      fields: {
        title: {
          type: "text",
          label: "Título",
        },
        price: {
          type: "text",
          label: "Preço",
        },
        description: {
          type: "textarea",
          label: "Descrição",
        },
        imageUrl: {
          type: "text",
          label: "URL da imagem (opcional)",
        },
      },
    },
    CardBlock: {
      render: CardBlock,
      defaultProps: {
        title: "Título do Card",
        content: "Conteúdo descritivo do card vai aqui.",
        imageUrl: "https://via.placeholder.com/400x300",
        buttonLabel: "Saiba Mais",
        buttonLink: "#",
      },
      fields: {
        title: {
          type: "text",
          label: "Título",
        },
        content: {
          type: "textarea",
          label: "Conteúdo",
        },
        imageUrl: {
          type: "text",
          label: "URL da imagem (opcional)",
        },
        buttonLabel: {
          type: "text",
          label: "Texto do botão (opcional)",
        },
        buttonLink: {
          type: "text",
          label: "Link do botão (opcional)",
        },
      },
    },
    // New component for Hero Section
    HeroSection: {
      render: HeroSection,
      defaultProps: {
        title: "Eleve Seu Estilo Pessoal",
        subtitle: "Experiência Premium de Barbearia",
        description: "Cortes precisos e técnicas tradicionais para o homem moderno. Experimente o trabalho artesanal que define seu visual assinatura.",
        imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070",
        primaryButtonLabel: "Agendar Horário",
        primaryButtonLink: "#book-now",
        secondaryButtonLabel: "Explorar Serviços",
        secondaryButtonLink: "#services",
      },
      fields: {
        title: {
          type: "text",
          label: "Título",
        },
        subtitle: {
          type: "text",
          label: "Subtítulo (opcional)",
        },
        description: {
          type: "textarea",
          label: "Descrição",
        },
        imageUrl: {
          type: "text",
          label: "URL da imagem de fundo",
        },
        primaryButtonLabel: {
          type: "text",
          label: "Texto do botão principal (opcional)",
        },
        primaryButtonLink: {
          type: "text",
          label: "Link do botão principal (opcional)",
        },
        secondaryButtonLabel: {
          type: "text",
          label: "Texto do botão secundário (opcional)",
        },
        secondaryButtonLink: {
          type: "text",
          label: "Link do botão secundário (opcional)",
        },
      },
    },
    // Services Grid Component
    ServicesGrid: {
      render: ServicesGrid,
      defaultProps: {
        title: "Serviços de Barbearia Especializados",
        subtitle: "Nossas Especialidades",
        description: "Serviços premium personalizados para realçar seu estilo pessoal com precisão e cuidado.",
        services: [
          {
            id: "1",
            title: "Corte Clássico",
            description: "Corte preciso adaptado ao formato do seu rosto e preferências de estilo.",
            price: "R$70",
            duration: "45 min",
            image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070"
          },
          {
            id: "2",
            title: "Aparar & Modelar Barba",
            description: "Esculpir e detalhar com expertise para aperfeiçoar seus pelos faciais.",
            price: "R$50",
            duration: "30 min",
            image: "https://images.unsplash.com/photo-1622296089780-290d715192af?q=80&w=1974"
          },
          {
            id: "3",
            title: "Barbear Premium",
            description: "Tratamento tradicional com toalha quente e precisão de navalha.",
            price: "R$90",
            duration: "45 min",
            image: "https://images.unsplash.com/photo-1493256338651-d82f7272f427?q=80&w=2070"
          },
          {
            id: "4",
            title: "Tratamento Completo",
            description: "Pacote completo incluindo corte de cabelo, modelagem de barba e tratamento facial.",
            price: "R$170",
            duration: "90 min",
            image: "https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=1974"
          }
        ]
      },
      fields: {
        title: {
          type: "text",
          label: "Título",
        },
        subtitle: {
          type: "text",
          label: "Subtítulo (opcional)",
        },
        description: {
          type: "textarea",
          label: "Descrição (opcional)",
        },
        services: {
          type: "array",
          label: "Serviços",
          arrayFields: {
            id: {
              type: "text",
              label: "ID"
            },
            title: {
              type: "text",
              label: "Título"
            },
            description: {
              type: "textarea",
              label: "Descrição"
            },
            price: {
              type: "text",
              label: "Preço"
            },
            duration: {
              type: "text",
              label: "Duração"
            },
            image: {
              type: "text",
              label: "URL da imagem"
            }
          }
        }
      }
    },
    // Barbers Team Component
    BarbersTeam: {
      render: BarbersTeam,
      defaultProps: {
        title: "Barbeiros Especialistas",
        subtitle: "Nossa Equipe",
        description: "Conheça nossa equipe de barbeiros especializados dedicados a aperfeiçoar seu estilo com habilidade e precisão.",
        barbers: [
          {
            id: "1",
            name: "Alexandre Silva",
            role: "Barbeiro Master",
            bio: "Com mais de 15 anos de experiência, Alexandre traz precisão e arte para cada corte de cabelo.",
            experience: "15+ anos",
            specialties: ["Cortes Clássicos", "Estilização de Barba"],
            image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974"
          },
          {
            id: "2",
            name: "Miguel Rodriguez",
            role: "Especialista em Estilo",
            bio: "Miguel é especializado em estilos contemporâneos e degradês de precisão que destacam suas características.",
            experience: "8 anos",
            specialties: ["Degradês", "Estilos Modernos"],
            image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1974"
          },
          {
            id: "3",
            name: "Daniel Costa",
            role: "Experiente em Cuidados",
            bio: "Daniel combina técnicas tradicionais com estética moderna para um visual atemporal.",
            experience: "12 anos",
            specialties: ["Design de Cabelo", "Barbear de Luxo"],
            image: "https://images.unsplash.com/photo-1557053815-9e5f9c2a0e46?q=80&w=1974"
          }
        ]
      },
      fields: {
        title: {
          type: "text",
          label: "Título",
        },
        subtitle: {
          type: "text",
          label: "Subtítulo (opcional)",
        },
        description: {
          type: "textarea",
          label: "Descrição (opcional)",
        },
        barbers: {
          type: "array",
          label: "Barbeiros",
          arrayFields: {
            id: {
              type: "text",
              label: "ID"
            },
            name: {
              type: "text",
              label: "Nome"
            },
            role: {
              type: "text",
              label: "Cargo"
            },
            bio: {
              type: "textarea",
              label: "Biografia"
            },
            experience: {
              type: "text",
              label: "Experiência"
            },
            specialties: {
              type: "array",
              label: "Especialidades",
              arrayFields: {
                value: {
                  type: "text",
                  label: "Especialidade"
                }
              }
            },
            image: {
              type: "text",
              label: "URL da imagem"
            }
          }
        }
      }
    },
    // Booking Section
    BookingSection: {
      render: BookingSection,
      defaultProps: {
        title: "Agende Seu Horário",
        subtitle: "Marque Agora",
        description: "Reserve um horário com nossos barbeiros especializados e experimente um serviço de barbearia de alta qualidade.",
        buttonLabel: "Agendar",
        backgroundColor: "bg-amber-100"
      },
      fields: {
        title: {
          type: "text",
          label: "Título",
        },
        subtitle: {
          type: "text",
          label: "Subtítulo (opcional)",
        },
        description: {
          type: "textarea",
          label: "Descrição (opcional)",
        },
        buttonLabel: {
          type: "text",
          label: "Texto do botão (opcional)",
        },
        backgroundColor: {
          type: "select",
          label: "Cor de fundo",
          options: [
            { label: "Âmbar Claro", value: "bg-amber-100" },
            { label: "Âmbar", value: "bg-amber-50" },
            { label: "Branco", value: "bg-white" },
          ],
        },
      }
    }
  },
};

// Component for rendering Puck content on the front-end
export const PuckRenderer = ({ data }: { data: any }) => {
  if (!data || !data.content) {
    return null;
  }
  
  return (
    <div className="puck-renderer">
      {data.content.map((child: any, index: number) => {
        const Component = config.components[child.type]?.render;
        return Component ? <Component key={index} {...child.props} /> : null;
      })}
    </div>
  );
};
