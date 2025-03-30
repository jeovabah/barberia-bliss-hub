
import React from 'react';
import { ComponentConfig } from "@measured/puck";
import ImageUploader from "@/components/ImageUploader";

// Custom color picker component for Puck
const ColorPicker: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
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
    </div>
  );
};

// Custom image field component for Puck that uses our Supabase ImageUploader
const ImageField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label?: string;
  directory?: string;
}> = ({ value, onChange, label, directory = "puck-uploads" }) => {
  return (
    <ImageUploader
      value={value}
      onChange={onChange}
      label={label}
      directory={directory}
    />
  );
};

export const utilityComponents: Record<string, ComponentConfig> = {
  // Custom color picker field
  CustomColor: {
    label: "Seletor de Cor",
    render: ({ color }) => (
      <div style={{ backgroundColor: color, height: "50px", width: "100%", borderRadius: "4px" }}>
        <span className="p-2 text-white text-xs font-mono">{color}</span>
      </div>
    ),
    defaultProps: {
      color: "#FFA500"
    },
    fields: {
      color: {
        type: "custom" as const,
        label: "Cor",
        render: ({ value, onChange }) => (
          <ColorPicker value={value} onChange={onChange} />
        )
      }
    }
  },
  
  // Custom image uploader component
  CustomImage: {
    label: "Imagem Personalizada",
    render: ({ src, alt, className }) => (
      <div className={`overflow-hidden rounded-md ${className}`}>
        {src ? (
          <img 
            src={src} 
            alt={alt || "Imagem"} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
            Nenhuma imagem selecionada
          </div>
        )}
      </div>
    ),
    defaultProps: {
      src: "",
      alt: "Imagem da barbearia",
      className: ""
    },
    fields: {
      src: {
        type: "custom" as const,
        label: "Imagem",
        render: ({ value, onChange }) => (
          <ImageField
            value={value}
            onChange={onChange}
            label="Selecione ou arraste uma imagem"
            directory="barbearia"
          />
        )
      },
      alt: {
        type: "text" as const,
        label: "Texto alternativo"
      },
      className: {
        type: "text" as const,
        label: "Classes CSS"
      }
    }
  }
};
