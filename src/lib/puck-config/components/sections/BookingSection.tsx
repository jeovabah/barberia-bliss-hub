
import React from 'react';
import { ComponentConfig } from "@measured/puck";
import { colorOptions, textColorOptions, accentColorOptions } from "../../color-options";
import BookingForm from "@/components/BookingForm";

export const BookingSection: ComponentConfig = {
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
