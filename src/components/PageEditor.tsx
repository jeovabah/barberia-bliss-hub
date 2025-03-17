
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PencilIcon, EyeIcon, RotateCcwIcon, GripVertical, SaveIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionType = 'hero' | 'services' | 'barbers' | 'booking';

interface EditorProps {
  onSave: (sections: SectionType[]) => void;
  onPreview: () => void;
  onReset: () => void;
  initialSections?: SectionType[];
}

const PageEditor: React.FC<EditorProps> = ({ 
  onSave, 
  onPreview, 
  onReset,
  initialSections = ['hero', 'services', 'barbers', 'booking']
}) => {
  const [sections, setSections] = useState<SectionType[]>(initialSections);
  const [activeTab, setActiveTab] = useState<string>('editor');
  
  // Ensure sections are always set from props
  useEffect(() => {
    if (initialSections && initialSections.length > 0) {
      setSections(initialSections);
    }
  }, [initialSections]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSections(items);
  };

  const handleSave = () => {
    onSave(sections);
  };

  const sectionNames = {
    hero: "Seção Hero",
    services: "Serviços",
    barbers: "Barbeiros",
    booking: "Agendamento"
  };
  
  const sectionDescriptions = {
    hero: "Título principal e chamada para ação",
    services: "Lista de serviços oferecidos",
    barbers: "Equipe de barbeiros",
    booking: "Formulário de agendamento"
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl md:text-2xl">Editor da Página Inicial</CardTitle>
          <CardDescription>
            Arraste e solte blocos para personalizar sua página inicial
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="editor" className="flex items-center gap-1">
                <PencilIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Editor</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-1" onClick={() => setActiveTab('preview')}>
                <EyeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            onClick={onPreview} 
            className="flex items-center gap-1"
          >
            <EyeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Ver Site</span>
          </Button>
          <Button 
            variant="destructive" 
            onClick={onReset}
            className="flex items-center gap-1"
          >
            <RotateCcwIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Restaurar Padrão</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <TabsContent value="editor" className="mt-0">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Organize as seções arrastando e soltando os elementos abaixo. Clique em Salvar quando terminar.
            </p>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {sections.map((section, index) => (
                    <Draggable key={section} draggableId={section} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-md border bg-card",
                            snapshot.isDragging ? "shadow-lg" : ""
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps} className="cursor-grab">
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{sectionNames[section]}</p>
                              <p className="text-sm text-muted-foreground">{sectionDescriptions[section]}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <SaveIcon className="w-4 h-4" />
              Salvar Alterações
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="border rounded-md p-4 bg-gray-50 h-[600px] overflow-auto">
            <div className="text-center p-8 bg-amber-50">
              <h2 className="text-2xl font-bold mb-4">Preview da Página Inicial</h2>
              <p className="mb-4">Esta é uma representação simplificada da sua página.</p>
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section} className="p-4 border rounded bg-white">
                    <h3 className="font-bold">{sectionNames[section]}</h3>
                    <p>{sectionDescriptions[section]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default PageEditor;
