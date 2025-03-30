import React from 'react';
import { ComponentConfig } from "@measured/puck";
import { colorOptions, textColorOptions, accentColorOptions, buttonColorOptions } from "../color-options";
import BookingForm from "@/components/BookingForm";
import { uploadImageToBucket } from "../helpers/image-upload";

export const sectionComponents: Record<string, ComponentConfig> = {
  HeroSection: {
    label: "Seção Hero",
    render: ({ title, subtitle, buttonText, buttonLink, backgroundColor, textColor, accentColor, buttonColor, backgroundImage, customBgColor, customTextColor, customAccentColor, customButtonColor }) => {
      // Use custom colors if provided (hex values)
      const bgStyle = customBgColor ? { backgroundColor: customBgColor } : {};
      const textStyle = customTextColor ? { color: customTextColor } : {};
      const accentStyle = customAccentColor ? { color: customAccentColor } : {};
      const buttonStyle = customButtonColor ? { backgroundColor: customButtonColor } : {};
      
      return (
        <section 
          className={`py-24 relative overflow-hidden ${!customBgColor ? backgroundColor : ''}`}
          style={bgStyle}
        >
          {backgroundImage && (
            <div 
              className="absolute inset-0 z-0 opacity-20" 
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
          )}
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${!customTextColor ? textColor : ''}`}
                style={textStyle}
              >
                {title}
              </h1>
              <p 
                className={`text-xl mb-8 ${!customAccentColor ? accentColor : ''}`}
                style={accentStyle}
              >
                {subtitle}
              </p>
              {buttonText && (
                <a 
                  href={buttonLink || "#book-now"} 
                  className={`inline-block px-8 py-3 rounded-md text-white font-medium ${!customButtonColor ? buttonColor : ''}`}
                  style={buttonStyle}
                >
                  {buttonText}
                </a>
              )}
            </div>
          </div>
        </section>
      );
    },
    defaultProps: {
      title: "BARBEARIA PREMIUM",
      subtitle: "Cortes clássicos, ambiente moderno. Experiência exclusiva para cavalheiros.",
      buttonText: "Agende Agora",
      buttonLink: "#book-now",
      backgroundColor: "bg-amber-950",
      textColor: "text-white",
      accentColor: "text-amber-400",
      buttonColor: "bg-amber-500",
      backgroundImage: "",
      customBgColor: "",
      customTextColor: "",
      customAccentColor: "",
      customButtonColor: ""
    },
    fields: {
      title: {
        type: "text" as const,
        label: "Título"
      },
      subtitle: {
        type: "textarea" as const,
        label: "Subtítulo"
      },
      buttonText: {
        type: "text" as const,
        label: "Texto do Botão"
      },
      buttonLink: {
        type: "text" as const,
        label: "Link do Botão"
      },
      backgroundImage: {
        type: "custom" as const,
        label: "Imagem de Fundo",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div 
                className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0"
                style={{
                  backgroundImage: value ? `url(${value})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              ></div>
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="URL da imagem"
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div className="mt-2">
              <button
                type="button"
                onClick={() => {
                  // Open file input programmatically
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async (e: any) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    try {
                      const publicUrl = await uploadImageToBucket(file, "hero-backgrounds");
                      if (publicUrl) {
                        onChange(publicUrl);
                      }
                    } catch (error) {
                      console.error('Error uploading image:', error);
                      alert('Erro ao enviar imagem. Tente novamente.');
                    }
                  };
                  input.click();
                }}
                className="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
              >
                Enviar imagem
              </button>
            </div>
          </div>
        )
      },
      backgroundColor: {
        type: "select" as const,
        label: "Cor de Fundo",
        options: colorOptions
      },
      textColor: {
        type: "select" as const,
        label: "Cor do Texto",
        options: textColorOptions
      },
      accentColor: {
        type: "select" as const,
        label: "Cor de Destaque",
        options: accentColorOptions
      },
      buttonColor: {
        type: "select" as const,
        label: "Cor do Botão",
        options: buttonColorOptions
      },
      customBgColor: {
        type: "custom" as const,
        label: "Cor de Fundo Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      },
      customTextColor: {
        type: "custom" as const,
        label: "Cor do Texto Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      },
      customAccentColor: {
        type: "custom" as const,
        label: "Cor de Destaque Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      },
      customButtonColor: {
        type: "custom" as const,
        label: "Cor do Botão Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      }
    }
  },
  
  ServicesGrid: {
    label: "Grade de Serviços",
    render: ({ title, subtitle, services, columns, backgroundColor, textColor, accentColor, customBgColor, customTextColor, customAccentColor }) => {
      // Custom colors if provided (hex values)
      const bgStyle = customBgColor ? { backgroundColor: customBgColor } : {};
      const textStyle = customTextColor ? { color: customTextColor } : {};
      const accentStyle = customAccentColor ? { color: customAccentColor } : {};
      
      return (
        <section 
          className={`py-24 ${!customBgColor ? backgroundColor : ''}`}
          style={bgStyle}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 
                className={`text-3xl md:text-4xl font-bold mb-4 ${!customTextColor ? textColor : ''}`}
                style={textStyle}
              >
                {title}
              </h2>
              <p 
                className={`text-lg max-w-3xl mx-auto ${!customAccentColor ? accentColor : ''}`}
                style={accentStyle}
              >
                {subtitle}
              </p>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-8`}>
              {services.map((service, index) => (
                <div 
                  key={service.id || index} 
                  className="bg-white rounded-xl shadow-sm p-6 border border-amber-100/50 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-semibold ${!customTextColor ? textColor : ''}`} style={textStyle}>
                      {service.name}
                    </h3>
                    <span 
                      className={`text-lg font-bold ${!customAccentColor ? accentColor : ''}`}
                      style={accentStyle}
                    >
                      {service.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{service.duration}</span>
                    {service.popular && (
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    },
    defaultProps: {
      title: "Nossos Serviços",
      subtitle: "Oferecemos uma variedade de serviços premium para atender às suas necessidades.",
      columns: "2",
      backgroundColor: "bg-amber-50",
      textColor: "text-amber-950",
      accentColor: "text-amber-600",
      customBgColor: "",
      customTextColor: "",
      customAccentColor: "",
      services: [
        {
          id: "service-1",
          name: "Corte Clássico",
          price: "R$70",
          duration: "45 min",
          description: "Corte tradicional com acabamento perfeito e toalha quente.",
          popular: true
        },
        {
          id: "service-2",
          name: "Barba Completa",
          price: "R$50",
          duration: "30 min",
          description: "Modelagem de barba com toalha quente e produtos premium.",
          popular: false
        },
        {
          id: "service-3",
          name: "Combo Barba e Cabelo",
          price: "R$110",
          duration: "1h 15min",
          description: "Serviço completo de corte e barba com tratamento especial.",
          popular: true
        },
        {
          id: "service-4",
          name: "Tratamento Capilar",
          price: "R$90",
          duration: "45 min",
          description: "Hidratação profunda e tratamento para couro cabeludo.",
          popular: false
        }
      ]
    },
    fields: {
      title: {
        type: "text" as const,
        label: "Título"
      },
      subtitle: {
        type: "textarea" as const,
        label: "Subtítulo"
      },
      columns: {
        type: "select" as const,
        label: "Colunas",
        options: [
          { label: "1 Coluna", value: "1" },
          { label: "2 Colunas", value: "2" },
          { label: "3 Colunas", value: "3" },
          { label: "4 Colunas", value: "4" }
        ]
      },
      services: {
        type: "array" as const,
        label: "Serviços",
        itemLabel: (item) => item.name || "Serviço",
        defaultItemProps: {
          name: "Novo Serviço",
          price: "R$0",
          duration: "30 min",
          description: "Descrição do serviço",
          popular: false
        },
        arrayFields: {
          name: {
            type: "text" as const,
            label: "Nome do Serviço"
          },
          price: {
            type: "text" as const,
            label: "Preço"
          },
          duration: {
            type: "text" as const,
            label: "Duração"
          },
          description: {
            type: "textarea" as const,
            label: "Descrição"
          },
          popular: {
            type: "boolean" as const,
            label: "Popular"
          }
        }
      },
      backgroundColor: {
        type: "select" as const,
        label: "Cor de Fundo",
        options: colorOptions
      },
      textColor: {
        type: "select" as const,
        label: "Cor do Texto",
        options: textColorOptions
      },
      accentColor: {
        type: "select" as const,
        label: "Cor de Destaque",
        options: accentColorOptions
      },
      customBgColor: {
        type: "custom" as const,
        label: "Cor de Fundo Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      },
      customTextColor: {
        type: "custom" as const,
        label: "Cor do Texto Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      },
      customAccentColor: {
        type: "custom" as const,
        label: "Cor de Destaque Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      }
    }
  },
  
  BarbersTeam: {
    label: "Equipe de Barbeiros",
    render: ({ title, subtitle, barbers, backgroundColor, textColor, accentColor, customBgColor, customTextColor, customAccentColor }) => {
      // Custom colors if provided (hex values)
      const bgStyle = customBgColor ? { backgroundColor: customBgColor } : {};
      const textStyle = customTextColor ? { color: customTextColor } : {};
      const accentStyle = customAccentColor ? { color: customAccentColor } : {};
      
      return (
        <section 
          className={`py-24 ${!customBgColor ? backgroundColor : ''}`}
          style={bgStyle}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 
                className={`text-3xl md:text-4xl font-bold mb-4 ${!customTextColor ? textColor : ''}`}
                style={textStyle}
              >
                {title}
              </h2>
              <p 
                className={`text-lg max-w-3xl mx-auto ${!customAccentColor ? accentColor : ''}`}
                style={accentStyle}
              >
                {subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {barbers.map((barber, index) => (
                <div 
                  key={barber.id || index} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-amber-100/50 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {barber.image ? (
                      <img 
                        src={barber.image} 
                        alt={barber.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                        <span className="text-amber-800">Imagem não disponível</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 
                      className={`text-xl font-semibold mb-1 ${!customTextColor ? textColor : ''}`}
                      style={textStyle}
                    >
                      {barber.name}
                    </h3>
                    <p 
                      className={`mb-3 ${!customAccentColor ? accentColor : ''}`}
                      style={accentStyle}
                    >
                      {barber.role}
                    </p>
                    <p className="text-gray-600 mb-4">{barber.bio}</p>
                    {barber.specialties && barber.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {barber.specialties.map((specialty, i) => (
                          <span 
                            key={i} 
                            className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    },
    defaultProps: {
      title: "Nossos Barbeiros",
      subtitle: "Conheça nossa equipe de profissionais especializados.",
      backgroundColor: "bg-white",
      textColor: "text-amber-950",
      accentColor: "text-amber-600",
      customBgColor: "",
      customTextColor: "",
      customAccentColor: "",
      barbers: [
        {
          id: "barber-1",
          name: "Carlos Silva",
          role: "Barbeiro Master",
          bio: "Com mais de 15 anos de experiência, Carlos é especialista em cortes clássicos e modernos.",
          image: "",
          specialties: ["Cortes Clássicos", "Barba"]
        },
        {
          id: "barber-2",
          name: "André Santos",
          role: "Barbeiro Sênior",
          bio: "André traz técnicas internacionais e é especialista em degradês e cortes modernos.",
          image: "",
          specialties: ["Degradê", "Cortes Modernos"]
        },
        {
          id: "barber-3",
          name: "Marcos Oliveira",
          role: "Barbeiro Especialista",
          bio: "Especialista em barbas, Marcos cria estilos personalizados para cada cliente.",
          image: "",
          specialties: ["Barba Completa", "Tratamentos"]
        }
      ]
    },
    fields: {
      title: {
        type: "text" as const,
        label: "Título"
      },
      subtitle: {
        type: "textarea" as const,
        label: "Subtítulo"
      },
      barbers: {
        type: "array" as const,
        label: "Barbeiros",
        itemLabel: (item) => item.name || "Barbeiro",
        defaultItemProps: {
          name: "Nome do Barbeiro",
          role: "Função",
          bio: "Biografia do barbeiro",
          image: "",
          specialties: []
        },
        arrayFields: {
          name: {
            type: "text" as const,
            label: "Nome"
          },
          role: {
            type: "text" as const,
            label: "Função"
          },
          bio: {
            type: "textarea" as const,
            label: "Biografia"
          },
          image: {
            type: "custom" as const,
            label: "Foto",
            render: ({ value, onChange }) => (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0"
                    style={{
                      backgroundImage: value ? `url(${value})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  <input
                    type="text"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="URL da imagem"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Open file input programmatically
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = async (e: any) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        
                        try {
                          const publicUrl = await uploadImageToBucket(file, "barbers");
                          if (publicUrl) {
                            onChange(publicUrl);
                          }
                        } catch (error) {
                          console.error('Error uploading image:', error);
                          alert('Erro ao enviar imagem. Tente novamente.');
                        }
                      };
                      input.click();
                    }}
                    className="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                  >
                    Enviar imagem
                  </button>
                </div>
              </div>
            )
          },
          specialties: {
            type: "array" as const,
            label: "Especialidades",
            itemLabel: (item) => item || "Especialidade",
            defaultItemProps: "",
            arrayFields: {
              type: "text" as const
            }
          }
        }
      },
      backgroundColor: {
        type: "select" as const,
        label: "Cor de Fundo",
        options: colorOptions
      },
      textColor: {
        type: "select" as const,
        label: "Cor do Texto",
        options: textColorOptions
      },
      accentColor: {
        type: "select" as const,
        label: "Cor de Destaque",
        options: accentColorOptions
      },
      customBgColor: {
        type: "custom" as const,
        label: "Cor de Fundo Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      },
      customTextColor: {
        type: "custom" as const,
        label: "Cor do Texto Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      },
      customAccentColor: {
        type: "custom" as const,
        label: "Cor de Destaque Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      }
    }
  },
  
  BookingSection: {
    label: "Seção de Agendamento",
    render: ({ title, subtitle, backgroundColor, textColor, accentColor, customBgColor, customTextColor, customAccentColor }) => {
      // Custom colors if provided (hex values)
      const bgStyle = customBgColor ? { backgroundColor: customBgColor } : {};
      const textStyle = customTextColor ? { color: customTextColor } : {};
      const accentStyle = customAccentColor ? { color: customAccentColor } : {};
      
      return (
        <div 
          id="booking-section"
          className={`w-full ${!customBgColor ? backgroundColor : ''}`}
          style={bgStyle}
        >
          {(title || subtitle) && (
            <div className="container mx-auto py-12 px-4">
              <div className="text-center mb-10">
                {title && (
                  <h2 
                    className={`text-3xl md:text-4xl font-bold mb-4 ${!customTextColor ? textColor : ''}`}
                    style={textStyle}
                  >
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p 
                    className={`text-lg max-w-3xl mx-auto ${!customAccentColor ? accentColor : ''}`}
                    style={accentStyle}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
          <BookingForm />
        </div>
      );
    },
    defaultProps: {
      title: "Agende Seu Horário",
      subtitle: "Escolha o serviço, data e hora que desejar para uma experiência premium.",
      backgroundColor: "bg-amber-50",
      textColor: "text-amber-950",
      accentColor: "text-amber-700",
      customBgColor: "",
      customTextColor: "",
      customAccentColor: ""
    },
    fields: {
      title: {
        type: "text" as const,
        label: "Título"
      },
      subtitle: {
        type: "textarea" as const,
        label: "Subtítulo"
      },
      backgroundColor: {
        type: "select" as const,
        label: "Cor de Fundo",
        options: colorOptions
      },
      textColor: {
        type: "select" as const,
        label: "Cor do Texto",
        options: textColorOptions
      },
      accentColor: {
        type: "select" as const,
        label: "Cor de Destaque",
        options: accentColorOptions
      },
      customBgColor: {
        type: "custom" as const,
        label: "Cor de Fundo Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      },
      customTextColor: {
        type: "custom" as const,
        label: "Cor do Texto Personalizada",
