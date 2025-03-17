
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
          placeholder: "Digite o título",
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
          type: "rich-text",
          label: "Conteúdo",
          placeholder: "Digite seu conteúdo...",
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
          placeholder: "https://...",
        },
        alt: {
          type: "text",
          label: "Texto alternativo",
          placeholder: "Descrição da imagem",
        },
        className: {
          type: "text",
          label: "Classes CSS (opcional)",
          placeholder: "w-full h-auto",
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
          placeholder: "Clique Aqui",
        },
        href: {
          type: "text",
          label: "Link",
          placeholder: "#",
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
          placeholder: "Nome do serviço",
        },
        price: {
          type: "text",
          label: "Preço",
          placeholder: "R$ 35,00",
        },
        description: {
          type: "textarea",
          label: "Descrição",
          placeholder: "Descreva o serviço...",
        },
        imageUrl: {
          type: "text",
          label: "URL da imagem (opcional)",
          placeholder: "https://...",
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
          placeholder: "Título do Card",
        },
        content: {
          type: "textarea",
          label: "Conteúdo",
          placeholder: "Descreva o conteúdo...",
        },
        imageUrl: {
          type: "text",
          label: "URL da imagem (opcional)",
          placeholder: "https://...",
        },
        buttonLabel: {
          type: "text",
          label: "Texto do botão (opcional)",
          placeholder: "Saiba Mais",
        },
        buttonLink: {
          type: "text",
          label: "Link do botão (opcional)",
          placeholder: "#",
        },
      },
    },
  },
};

// Component for rendering Puck content on the front-end
export const PuckRenderer = ({ data }: { data: any }) => {
  if (!data || !data.root || !data.root.children) {
    return null;
  }
  
  return (
    <div className="puck-renderer">
      <PuckPreview data={data} config={config} />
    </div>
  );
};
