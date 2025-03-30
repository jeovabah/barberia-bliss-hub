
import React from 'react';
import { ComponentConfig } from "@measured/puck";
import { colorOptions, textColorOptions, accentColorOptions } from "../../color-options";
import { uploadImageToBucket } from "../../helpers/image-upload";

type Barber = {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  specialties: string[];
};

export const BarbersTeam: ComponentConfig = {
  label: "Equipe de Barbeiros",
  render: ({ 
    title, 
    subtitle, 
    backgroundColor, 
    textColor, 
    accentColor, 
    barbers, 
    customBgColor,
    customTextColor,
    customAccentColor
  }) => {
    // Use custom colors if provided (hex values)
    const bgStyle = customBgColor ? { backgroundColor: customBgColor } : {};
    const textStyle = customTextColor ? { color: customTextColor } : {};
    const accentStyle = customAccentColor ? { color: customAccentColor } : {};
    
    return (
      <section 
        className={`py-16 ${!customBgColor ? backgroundColor : ''}`}
        style={bgStyle}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 
              className={`text-3xl font-bold mb-4 ${!customTextColor ? textColor : ''}`}
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
            {barbers.map((barber: Barber) => (
              <div key={barber.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  {barber.image ? (
                    <img 
                      src={barber.image} 
                      alt={barber.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400 text-5xl">📷</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold ${!customTextColor ? textColor : ''}`} style={textStyle}>
                    {barber.name}
                  </h3>
                  <p className={`text-sm mb-2 ${!customAccentColor ? accentColor : ''}`} style={accentStyle}>
                    {barber.role}
                  </p>
                  <p className="text-gray-600 mb-4 text-sm">
                    {barber.bio}
                  </p>
                  
                  {barber.specialties && barber.specialties.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Especialidades:</h4>
                      <div className="flex flex-wrap gap-2">
                        {barber.specialties.map((specialty, index) => (
                          <span 
                            key={index} 
                            className={`text-xs px-2 py-1 rounded-full ${!customBgColor ? backgroundColor : ''} ${!customTextColor ? 'text-white' : ''}`}
                            style={{
                              ...(customBgColor ? { backgroundColor: customBgColor } : {}),
                              ...(customTextColor ? { color: customTextColor } : {})
                            }}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
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
    backgroundColor: "bg-amber-900",
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
      type: "text" as const,
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
      label: "Cor de Fundo Personalizada"
    },
    customTextColor: {
      type: "custom" as const,
      label: "Cor do Texto Personalizada"
    },
    customAccentColor: {
      type: "custom" as const,
      label: "Cor de Destaque Personalizada"
    },
    barbers: {
      type: "array" as const,
      label: "Barbeiros",
      arrayFields: {
        id: {
          type: "text" as const,
          label: "ID"
        },
        name: {
          type: "text" as const,
          label: "Nome"
        },
        role: {
          type: "text" as const,
          label: "Cargo"
        },
        bio: {
          type: "textarea" as const,
          label: "Biografia"
        },
        image: {
          type: "external" as const,
          label: "Imagem",
          render: ({ onChange, value }) => {
            return (
              <div className="flex flex-col space-y-2">
                {value && (
                  <img
                    src={value}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      try {
                        const url = await uploadImageToBucket(
                          e.target.files[0],
                          "barbers"
                        );
                        onChange(url);
                      } catch (error) {
                        console.error("Error uploading image:", error);
                        alert("Failed to upload image");
                      }
                    }
                  }}
                />
              </div>
            );
          }
        },
        specialties: {
          type: "array" as const,
          label: "Especialidades",
          arrayFields: {
            type: "text" as const
          }
        }
      }
    }
  }
};
