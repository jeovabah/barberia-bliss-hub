
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, User } from "lucide-react";

interface Specialist {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  experience: string | null;
  image: string | null;
  specialties: string[];
}

interface SpecialistManagementProps {
  companyId: string;
}

const SpecialistManagement: React.FC<SpecialistManagementProps> = ({ companyId }) => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSpecialist, setCurrentSpecialist] = useState<Specialist | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    experience: "",
    image: "",
    specialties: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSpecialists();
  }, [companyId]);

  const fetchSpecialists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('specialists')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        throw error;
      }

      // Process data to ensure specialties is an array
      const processedData = data?.map(specialist => ({
        ...specialist,
        specialties: processSpecialties(specialist.specialties)
      })) || [];

      setSpecialists(processedData);
    } catch (error: any) {
      console.error("Error fetching specialists:", error.message);
      toast({
        title: "Erro ao carregar especialistas",
        description: "Não foi possível carregar os especialistas. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to process specialties from database
  const processSpecialties = (specialtiesData: any): string[] => {
    if (!specialtiesData) return [];
    if (Array.isArray(specialtiesData)) return specialtiesData;
    // If it's a JSON string, parse it
    if (typeof specialtiesData === 'string') {
      try {
        const parsed = JSON.parse(specialtiesData);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    // If it's already a JSON object from Supabase
    return [];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      bio: "",
      experience: "",
      image: "",
      specialties: ""
    });
    setIsEditing(false);
    setCurrentSpecialist(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditDialog = (specialist: Specialist) => {
    setCurrentSpecialist(specialist);
    setFormData({
      name: specialist.name,
      role: specialist.role || "",
      bio: specialist.bio || "",
      experience: specialist.experience || "",
      image: specialist.image || "",
      specialties: specialist.specialties ? specialist.specialties.join(", ") : ""
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (!formData.name.trim()) {
        toast({
          title: "Erro",
          description: "O nome do especialista é obrigatório",
          variant: "destructive"
        });
        return;
      }

      // Process specialties from comma-separated string to array
      const specialtiesArray = formData.specialties
        ? formData.specialties.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const specialistData = {
        company_id: companyId,
        name: formData.name.trim(),
        role: formData.role.trim() || null,
        bio: formData.bio.trim() || null,
        experience: formData.experience.trim() || null,
        image: formData.image.trim() || null,
        specialties: specialtiesArray
      };

      let result;
      
      if (isEditing && currentSpecialist) {
        // Update existing specialist
        result = await supabase
          .from('specialists')
          .update(specialistData)
          .eq('id', currentSpecialist.id);
      } else {
        // Add new specialist
        result = await supabase
          .from('specialists')
          .insert(specialistData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isEditing ? "Especialista atualizado" : "Especialista adicionado",
        description: isEditing 
          ? "As informações do especialista foram atualizadas com sucesso." 
          : "O especialista foi adicionado com sucesso."
      });

      resetForm();
      setIsFormOpen(false);
      fetchSpecialists();
    } catch (error: any) {
      console.error("Error saving specialist:", error.message);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar o especialista.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este especialista?")) {
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('specialists')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Especialista excluído",
        description: "O especialista foi excluído com sucesso."
      });

      fetchSpecialists();
    } catch (error: any) {
      console.error("Error deleting specialist:", error.message);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Ocorreu um erro ao excluir o especialista.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciar Especialistas</CardTitle>
          <CardDescription>
            Adicione e gerencie os especialistas da sua barbearia
          </CardDescription>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Especialista
        </Button>
      </CardHeader>
      <CardContent>
        {loading && specialists.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
          </div>
        ) : specialists.length === 0 ? (
          <div className="text-center py-10 border rounded-md bg-amber-50/30">
            <User className="h-12 w-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-1">Nenhum especialista cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Adicione especialistas para exibir no site e gerenciar agendamentos.
            </p>
            <Button onClick={openAddDialog} variant="secondary">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeiro Especialista
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialists.map((specialist) => (
              <Card key={specialist.id} className="border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center mb-4 pt-4">
                    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                      {specialist.image ? (
                        <img 
                          src={specialist.image} 
                          alt={specialist.name} 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User className="h-10 w-10 text-amber-600" />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{specialist.name}</h3>
                    {specialist.role && (
                      <p className="text-sm text-amber-600">{specialist.role}</p>
                    )}
                  </div>
                  
                  {specialist.experience && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-500">EXPERIÊNCIA</p>
                      <p className="text-sm">{specialist.experience}</p>
                    </div>
                  )}
                  
                  {specialist.specialties && specialist.specialties.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-500">ESPECIALIDADES</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {specialist.specialties.map((specialty, index) => (
                          <span 
                            key={index} 
                            className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => openEditDialog(specialist)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(specialist.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Especialista" : "Adicionar Especialista"}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Atualize as informações do especialista abaixo." 
                  : "Preencha as informações para adicionar um novo especialista."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome*</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome completo do especialista"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Cargo/Função</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Ex: Barbeiro Master, Estilista, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Experiência</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Ex: 5 anos de experiência"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialties">Especialidades</Label>
                <Input
                  id="specialties"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleInputChange}
                  placeholder="Corte masculino, Barba, Hidratação (separados por vírgulas)"
                />
                <p className="text-xs text-muted-foreground">Separe as especialidades por vírgulas</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Uma breve descrição sobre o especialista"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/foto.jpg"
                />
                <p className="text-xs text-muted-foreground">URL de uma foto do especialista (opcional)</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !formData.name.trim()}
              >
                {loading ? "Salvando..." : isEditing ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SpecialistManagement;
