
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
import { Eye, MoreHorizontal, Calendar, PlusCircle } from "lucide-react";
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

// Mock data for appointments - we'll replace with real data later
const mockAppointments = [
  {
    id: "1",
    clientName: "João Silva",
    service: "Corte de Cabelo",
    barber: "Carlos",
    date: "2025-03-20",
    time: "14:00",
    status: "confirmed",
  },
  {
    id: "2",
    clientName: "Maria Oliveira",
    service: "Barba",
    barber: "André",
    date: "2025-03-21",
    time: "10:30",
    status: "pending",
  },
  {
    id: "3",
    clientName: "Pedro Santos",
    service: "Corte e Barba",
    barber: "Carlos",
    date: "2025-03-22",
    time: "15:45",
    status: "completed",
  },
];

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  status: string;
}

interface AppointmentTableProps {
  companyId: string;
}

const AppointmentsTable: React.FC<AppointmentTableProps> = ({ companyId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    clientName: "",
    service: "",
    barber: "",
    date: new Date().toISOString().split('T')[0],
    time: "10:00",
    status: "pending"
  });
  const { toast } = useToast();

  // In a real implementation, we would fetch appointments from Supabase here
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        // This is where we'd fetch real data:
        // const { data, error } = await supabase
        //   .from('appointments')
        //   .select('*')
        //   .eq('company_id', companyId);
        
        // For now, we'll use mock data
        setAppointments(mockAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Erro ao carregar agendamentos",
          description: "Não foi possível carregar os agendamentos.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [companyId, toast]);

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

  const handleViewDetails = (id: string) => {
    toast({
      title: "Ver detalhes",
      description: `Visualizando detalhes do agendamento ${id}`,
    });
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    // In a real implementation, we would update the status in Supabase
    setAppointments(
      appointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );
    
    toast({
      title: "Status atualizado",
      description: `Status atualizado para ${newStatus}`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewAppointment(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAppointment = () => {
    // Validate form
    if (!newAppointment.clientName || !newAppointment.service || !newAppointment.barber || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Erro ao adicionar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, we would add the appointment to Supabase
    const appointment: Appointment = {
      id: `${Date.now()}`, // Generate a temporary ID
      clientName: newAppointment.clientName!,
      service: newAppointment.service!,
      barber: newAppointment.barber!,
      date: newAppointment.date!,
      time: newAppointment.time!,
      status: newAppointment.status || "pending",
    };

    setAppointments([...appointments, appointment]);
    setIsDialogOpen(false);
    
    // Reset form
    setNewAppointment({
      clientName: "",
      service: "",
      barber: "",
      date: new Date().toISOString().split('T')[0],
      time: "10:00",
      status: "pending"
    });
    
    toast({
      title: "Agendamento adicionado",
      description: "O agendamento foi adicionado com sucesso!",
    });
  };

  if (isLoading) {
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
                <Label htmlFor="clientName" className="text-right">
                  Cliente
                </Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={newAppointment.clientName}
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
                <Label htmlFor="barber" className="text-right">
                  Barbeiro
                </Label>
                <Input
                  id="barber"
                  name="barber"
                  value={newAppointment.barber}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
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
                <TableCell className="font-medium">{appointment.clientName}</TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>{appointment.barber}</TableCell>
                <TableCell>{new Date(appointment.date).toLocaleDateString('pt-BR')}</TableCell>
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
