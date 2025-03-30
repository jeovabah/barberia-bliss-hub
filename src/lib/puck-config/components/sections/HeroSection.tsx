
import React from 'react';
import { ComponentConfig } from "@measured/puck";
import { colorOptions, textColorOptions, accentColorOptions, buttonColorOptions } from "../../color-options";
import { uploadImageToBucket } from "../../helpers/image-upload";

export const HeroSection: ComponentConfig = {
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
};
