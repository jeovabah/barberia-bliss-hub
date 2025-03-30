
import React from 'react';
import { ComponentConfig } from "@measured/puck";
import { colorOptions, textColorOptions, accentColorOptions } from "../../color-options";

type Service = {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  popular: boolean;
};

export const ServicesGrid: ComponentConfig = {
  label: "Serviços",
  render: ({ 
    title, 
    subtitle, 
    columns,
    backgroundColor, 
    textColor, 
    accentColor, 
    services,
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
          
          <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
            {services.map((service: Service) => (
              <div 
                key={service.id} 
                className={`bg-white p-6 rounded-lg shadow-md border ${service.popular ? 'border-amber-400 relative' : 'border-transparent'}`}
              >
                {service.popular && (
                  <div className="absolute top-0 right-0 bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                    Popular
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${!customTextColor ? textColor : ''}`} style={textStyle}>
                  {service.name}
                </h3>
                <div className="flex justify-between mb-3">
                  <span className={`text-lg font-medium ${!customAccentColor ? accentColor : ''}`} style={accentStyle}>
                    {service.price}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {service.duration}
                  </span>
                </div>
                <p className="text-gray-600">
                  {service.description}
                </p>
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
      type: "text" as const,
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
    services: {
      type: "array" as const,
      label: "Serviços",
      arrayFields: {
        id: {
          type: "text" as const,
          label: "ID"
        },
        name: {
          type: "text" as const,
          label: "Nome"
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
          type: "radio" as const,
          label: "Destacar como Popular",
          options: [
            { label: "Sim", value: true },
            { label: "Não", value: false }
          ]
        }
      }
    }
  }
};
