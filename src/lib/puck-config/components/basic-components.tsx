import React from 'react';
import { ComponentConfig } from "@measured/puck";
import { colorOptions, textColorOptions, accentColorOptions, buttonColorOptions } from "../color-options";

export const basicComponents: Record<string, ComponentConfig> = {
  Heading: {
    label: "Título",
    render: ({ text, size, className, customColor }) => {
      if (customColor && customColor.startsWith('#')) {
        // Use custom color if specified
        if (size === "large") {
          return <h1 className={className} style={{ color: customColor }}>{text}</h1>;
        }
        if (size === "medium") {
          return <h2 className={className} style={{ color: customColor }}>{text}</h2>;
        }
        return <h3 className={className} style={{ color: customColor }}>{text}</h3>;
      } else {
        // Use Tailwind classes otherwise
        const baseClasses = `${className || ''}`;
        
        if (size === "large") {
          return <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${baseClasses}`}>{text}</h1>;
        }
        if (size === "medium") {
          return <h2 className={`text-2xl md:text-3xl font-bold ${baseClasses}`}>{text}</h2>;
        }
        return <h3 className={`text-xl md:text-2xl font-semibold ${baseClasses}`}>{text}</h3>;
      }
    },
    defaultProps: {
      text: "Título da Seção",
      size: "medium",
      className: "mb-4",
      customColor: ""
    },
    fields: {
      text: {
        type: "text" as const,
        label: "Texto"
      },
      size: {
        type: "select" as const,
        label: "Tamanho",
        options: [
          { label: "Pequeno", value: "small" },
          { label: "Médio", value: "medium" },
          { label: "Grande", value: "large" }
        ]
      },
      className: {
        type: "text" as const,
        label: "Classes CSS (opcional)"
      },
      customColor: {
        type: "custom" as const,
        label: "Cor personalizada (hex)",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#000000"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar o estilo padrão</p>
          </div>
        )
      }
    }
  },
  Paragraph: {
    label: "Parágrafo",
    render: ({ text, className, customColor }) => {
      const paragraphStyle = customColor ? { color: customColor } : {};
      return (
        <p className={`${className || ''}`} style={paragraphStyle}>{text}</p>
      );
    },
    defaultProps: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      className: "mb-4",
      customColor: ""
    },
    fields: {
      text: {
        type: "textarea" as const,
        label: "Texto"
      },
      className: {
        type: "text" as const,
        label: "Classes CSS (opcional)"
      },
      customColor: {
        type: "custom" as const,
        label: "Cor personalizada (hex)",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#000000"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar o estilo padrão</p>
          </div>
        )
      }
    }
  },
  Button: {
    label: "Botão",
    render: ({ text, link, className, buttonColor, customButtonColor }) => {
      const buttonStyle = customButtonColor ? { backgroundColor: customButtonColor, borderColor: customButtonColor } : {};
      return (
        <a
          href={link || "#"}
          className={`inline-block px-6 py-3 rounded-md font-medium ${buttonColor} ${className || ''}`}
          style={buttonStyle}
        >
          {text}
        </a>
      );
    },
    defaultProps: {
      text: "Saiba Mais",
      link: "#",
      className: "",
      buttonColor: "bg-amber-500",
      customButtonColor: ""
    },
    fields: {
      text: {
        type: "text" as const,
        label: "Texto"
      },
      link: {
        type: "text" as const,
        label: "Link"
      },
      className: {
        type: "text" as const,
        label: "Classes CSS (opcional)"
      },
      buttonColor: {
        type: "select" as const,
        label: "Cor do Botão",
        options: buttonColorOptions
      },
      customButtonColor: {
        type: "custom" as const,
        label: "Cor do Botão Personalizada",
        render: ({ value, onChange }) => (
          <div className="space-y-2">
            <div className="flex space-x-2 items-center">
              <input
                type="color"
                value={value || "#000000"}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#000000"
                className="flex-1 h-8 px-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">Deixe em branco para usar as cores padrão</p>
          </div>
        )
      }
    }
  },
  Image: {
    label: "Imagem",
    render: ({ src, alt, className }) => (
      <img src={src} alt={alt} className={className} />
    ),
    defaultProps: {
      src: "https://via.placeholder.com/300",
      alt: "Imagem",
      className: "w-full rounded-md"
    },
    fields: {
      src: {
        type: "text" as const,
        label: "URL da Imagem"
      },
      alt: {
        type: "text" as const,
        label: "Texto Alternativo"
      },
      className: {
        type: "text" as const,
        label: "Classes CSS (opcional)"
      }
    }
  },
  ServiceCard: {
    label: "Cartão de Serviço",
    render: ({ title, description, icon, className }) => (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className || ''}`}>
        <div className="text-amber-500 text-2xl mb-2">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    ),
    defaultProps: {
      title: "Serviço",
      description: "Descrição do serviço.",
      icon: "✂️",
      className: ""
    },
    fields: {
      title: {
        type: "text" as const,
        label: "Título"
      },
      description: {
        type: "textarea" as const,
        label: "Descrição"
      },
      icon: {
        type: "text" as const,
        label: "Ícone (emoji)"
      },
      className: {
        type: "text" as const,
        label: "Classes CSS (opcional)"
      }
    }
  },
};
