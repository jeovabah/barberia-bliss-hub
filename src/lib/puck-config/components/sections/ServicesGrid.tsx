
import React from 'react';
import { ComponentConfig } from "@measured/puck";
import { colorOptions, textColorOptions, accentColorOptions } from "../../color-options";

export const ServicesGrid: ComponentConfig = {
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
};
