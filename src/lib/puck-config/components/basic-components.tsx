
import React from 'react';

// Heading component
const Heading = ({ text, size = "large" }: { text: string; size?: "small" | "medium" | "large" }) => {
  const className = 
    size === "small" 
      ? "text-xl font-bold mb-2" 
      : size === "medium" 
        ? "text-2xl font-bold mb-3" 
        : "text-4xl font-bold mb-4";
  
  return <h2 className={className}>{text}</h2>;
};

// Text Block component
const TextBlock = ({ content }: { content: string }) => {
  return <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: content }} />;
};

// Image Block component
const ImageBlock = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  return <img src={src} alt={alt} className={`rounded-lg ${className || "w-full h-auto"}`} />;
};

// Button component
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

// Button Group component
const ButtonGroup = ({ buttons }: { buttons: { label: string; href: string; variant: "primary" | "secondary" }[] }) => {
  return (
    <div className="flex gap-4">
      {buttons.map((button, index) => (
        <Button key={index} label={button.label} href={button.href} variant={button.variant} />
      ))}
    </div>
  );
};

// ServiceCard component
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

// CardBlock component
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

// Export basic components with their Puck configuration
export const basicComponents = {
  Heading: {
    render: Heading,
    label: "Título",
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
    label: "Bloco de Texto",
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
    label: "Imagem",
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
    label: "Botão",
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
    label: "Card de Serviço",
    defaultProps: {
      title: "Corte de Cabelo",
      price: "R$ 35,00",
      description: "Corte moderno e estiloso para todos os tipos de cabelo."
    },
    fields: {
      title: {
        type: "text",
        label: "Título do Serviço"
      },
      price: {
        type: "text",
        label: "Preço"
      },
      description: {
        type: "textarea",
        label: "Descrição"
      },
      imageUrl: {
        type: "text",
        label: "URL da Imagem (opcional)"
      }
    }
  },
  CardBlock: {
    render: CardBlock,
    label: "Card Informativo",
    defaultProps: {
      title: "Título do Card",
      content: "Conteúdo descritivo do card informativo.",
      buttonLabel: "Saiba Mais",
      buttonLink: "#"
    },
    fields: {
      title: {
        type: "text",
        label: "Título"
      },
      content: {
        type: "textarea",
        label: "Conteúdo"
      },
      imageUrl: {
        type: "text",
        label: "URL da Imagem (opcional)"
      },
      buttonLabel: {
        type: "text",
        label: "Texto do Botão (opcional)"
      },
      buttonLink: {
        type: "text",
        label: "Link do Botão (opcional)"
      }
    }
  },
  ButtonGroup: {
    render: ButtonGroup,
    label: "Grupo de Botões",
    defaultProps: {
      buttons: [
        {
          label: "Botão Primário",
          href: "#",
          variant: "primary"
        },
        {
          label: "Botão Secundário",
          href: "#",
          variant: "secondary"
        }
      ]
    },
    fields: {
      buttons: {
        type: "array",
        label: "Botões",
        arrayFields: {
          label: {
            type: "text",
            label: "Texto"
          },
          href: {
            type: "text",
            label: "Link"
          },
          variant: {
            type: "select",
            label: "Estilo",
            options: [
              { label: "Primário", value: "primary" },
              { label: "Secundário", value: "secondary" }
            ]
          }
        }
      }
    }
  }
};
