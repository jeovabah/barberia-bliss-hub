
import React from 'react';
import { ComponentConfig } from "@measured/puck";
import { colorOptions, textColorOptions, accentColorOptions } from "../../color-options";
import BookingForm from "@/components/BookingForm";

export const BookingSection: ComponentConfig = {
  label: "Seção de Agendamento",
  render: ({ 
    title, 
    subtitle, 
    backgroundColor, 
    textColor, 
    accentColor,
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
        id="book-now"
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
          
          <div className="max-w-3xl mx-auto">
            <BookingForm />
          </div>
        </div>
      </section>
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
    }
  }
};
