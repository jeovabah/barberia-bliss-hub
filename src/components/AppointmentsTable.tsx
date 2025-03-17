
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
import { Eye, MoreHorizontal, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface AppointmentTableProps {
  companyId: string;
}

const AppointmentsTable: React.FC<AppointmentTableProps> = ({ companyId }) => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [isLoading, setIsLoading] = useState(false);
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
        <Button size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
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
