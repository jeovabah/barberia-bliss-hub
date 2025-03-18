
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Appointment {
  id: string;
  client_name: string;
  service: string;
  specialist_id: string | null;
  specialist_name?: string;
  date: string;
  time: string;
  status: string;
  client_email?: string | null;
  client_phone?: string | null;
  notes?: string | null;
}

interface Specialist {
  id: string;
  name: string;
}

interface AppointmentTableProps {
  companyId: string;
}

const AppointmentsTable: React.FC<AppointmentTableProps> = ({ companyId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    client_name: "",
    service: "",
    specialist_id: null,
    date: new Date().toISOString().split('T')[0],
    time: "10:00",
    status: "pending",
    client_email: "",
    client_phone: "",
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
    fetchSpecialists();
  }, [companyId]);

  const fetchSpecialists = async () => {
    try {
      const { data, error } = await supabase
        .from('specialists')
        .select('id, name')
        .eq('company_id', companyId);

      if (error) {
        throw error;
      }

      setSpecialists(data || []);
    } catch (error: any) {
      console.error("Error fetching specialists:", error.message);
    }
  };

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('company_id', companyId)
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }

      // Fetch specialist names for each appointment
      if (data && data.length > 0) {
        const enhancedAppointments = await Promise.all(
          data.map(async (appointment) => {
            if (!appointment.specialist_id) {
              return { ...appointment, specialist_name: 'Não especificado' };
            }
            
            const { data: specialistData, error: specialistError } = await supabase
              .from('specialists')
              .select('name')
              .eq('id', appointment.specialist_id)
              .maybeSingle();
              
            if (specialistError || !specialistData) {
              return { ...appointment, specialist_name: 'Desconhecido' };
            }
            
            return { ...appointment, specialist_name: specialistData.name };
          })
        );
        
        setAppointments(enhancedAppointments);
      } else {
        setAppointments([]);
      }
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Não foi possível carregar os agendamentos: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Confirmado
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pendente
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Concluído
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  };

  const handleViewDetails = (id: string) => {
    const appointment = appointments.find(a => a.id === id);
    if (!appointment) return;
    
    toast({
      title: "Detalhes do agendamento",
      description: `Cliente: ${appointment.client_name}
                    Serviço: ${appointment.service}
                    Data: ${formatDate(appointment.date)} às ${appointment.time}
                    Contato: ${appointment.client_phone || 'Não informado'}`,
    });
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        throw error;
      }

      toast({
        title: "Status atualizado",
        description: `Status atualizado para ${newStatus}`,
      });
      
      // Refresh appointments list
      fetchAppointments();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewAppointment(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAppointment = async () => {
    // Validate form
    if (!newAppointment.client_name || !newAppointment.service || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Erro ao adicionar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          company_id: companyId,
          client_name: newAppointment.client_name,
          service: newAppointment.service,
          specialist_id: newAppointment.specialist_id || null,
          date: newAppointment.date,
          time: newAppointment.time,
          status: newAppointment.status || 'pending',
          client_email: newAppointment.client_email || null,
          client_phone: newAppointment.client_phone || null,
          notes: newAppointment.notes || null
        })
        .select();

      if (error) {
        throw error;
      }
      
      setIsDialogOpen(false);
      
      // Reset form
      setNewAppointment({
        client_name: "",
        service: "",
        specialist_id: null,
        date: new Date().toISOString().split('T')[0],
        time: "10:00",
        status: "pending",
        client_email: "",
        client_phone: "",
        notes: ""
      });
      
      toast({
        title: "Agendamento adicionado",
        description: "O agendamento foi adicionado com sucesso!",
      });
      
      // Refresh appointments
      fetchAppointments();
    } catch (error: any) {
      console.error("Error adding appointment:", error);
      toast({
        title: "Erro ao adicionar agendamento",
        description: error.message || "Ocorreu um erro ao adicionar o agendamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso.",
      });
      
      // Refresh appointments list
      fetchAppointments();
    } catch (error: any) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Erro ao excluir agendamento",
        description: error.message || "Ocorreu um erro ao excluir o agendamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && appointments.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="p-4 flex justify-between items-center border-b">
        <h3 className="text-lg font-medium">Agendamentos</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Agendamento</DialogTitle>
              <DialogDescription>
                Adicione um novo agendamento para sua barbearia.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client_name" className="text-right">
                  Cliente
                </Label>
                <Input
                  id="client_name"
                  name="client_name"
                  value={newAppointment.client_name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Serviço
                </Label>
                <Input
                  id="service"
                  name="service"
                  value={newAppointment.service}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialist_id" className="text-right">
                  Barbeiro
                </Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("specialist_id", value)}
                  value={newAppointment.specialist_id || ""}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o barbeiro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Não especificado</SelectItem>
                    {specialists.map(specialist => (
                      <SelectItem key={specialist.id} value={specialist.id}>
                        {specialist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Data
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newAppointment.date}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Horário
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={newAppointment.time}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client_phone" className="text-right">
                  Telefone
                </Label>
                <Input
                  id="client_phone"
                  name="client_phone"
                  value={newAppointment.client_phone || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client_email" className="text-right">
                  Email
                </Label>
                <Input
                  id="client_email"
                  name="client_email"
                  type="email"
                  value={newAppointment.client_email || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("status", value)}
                  defaultValue="pending"
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAppointment}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Table>
        <TableCaption>Lista de todos os agendamentos da sua barbearia.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Barbeiro</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Nenhum agendamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">{appointment.client_name}</TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>{appointment.specialist_name || 'Não especificado'}</TableCell>
                <TableCell>{formatDate(appointment.date)}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewDetails(appointment.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteAppointment(appointment.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Atualizar status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(appointment.id, "confirmed")}>
                        Confirmar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(appointment.id, "completed")}>
                        Marcar como concluído
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(appointment.id, "canceled")}>
                        Cancelar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentsTable;
