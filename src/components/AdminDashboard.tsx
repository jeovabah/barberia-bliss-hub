
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, User, Scissors, CheckCircle, XCircle } from "lucide-react";

// Mock data for appointments
const mockAppointments = [
  {
    id: 1,
    clientName: "Carlos Oliveira",
    service: "Corte + Barba",
    date: "2023-08-22",
    time: "14:30",
    status: "confirmado"
  },
  {
    id: 2,
    clientName: "Ricardo Souza",
    service: "Corte Degradê",
    date: "2023-08-22",
    time: "16:00",
    status: "pendente"
  },
  {
    id: 3,
    clientName: "Felipe Santos",
    service: "Barba Completa",
    date: "2023-08-23",
    time: "10:30",
    status: "confirmado"
  },
  {
    id: 4,
    clientName: "Matheus Costa",
    service: "Corte + Barba + Sobrancelha",
    date: "2023-08-23",
    time: "14:00",
    status: "pendente"
  },
  {
    id: 5,
    clientName: "Bruno Almeida",
    service: "Corte Simples",
    date: "2023-08-24",
    time: "11:30",
    status: "pendente"
  }
];

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-500";
      case "pendente":
        return "bg-amber-500";
      case "cancelado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const filterAppointmentsByDate = () => {
    if (!selectedDate) return appointments;
    return appointments.filter(appt => appt.date === selectedDate);
  };

  const confirmAppointment = (id: number) => {
    const updatedAppointments = appointments.map(appt => 
      appt.id === id ? { ...appt, status: "confirmado" } : appt
    );
    setAppointments(updatedAppointments);
    toast({
      title: "Agendamento confirmado",
      description: "O cliente será notificado automaticamente.",
    });
  };

  const cancelAppointment = (id: number) => {
    const updatedAppointments = appointments.map(appt => 
      appt.id === id ? { ...appt, status: "cancelado" } : appt
    );
    setAppointments(updatedAppointments);
    toast({
      title: "Agendamento cancelado",
      description: "O cliente será notificado automaticamente.",
      variant: "destructive",
    });
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="mr-2 h-5 w-5" /> 
          Agendamentos
        </CardTitle>
        <CardDescription>
          Gerencie os agendamentos de clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="date-filter" className="block text-sm font-medium mb-1">
              Filtrar por data
            </label>
            <input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-md border border-input px-3 h-10"
            />
          </div>
          <div className="flex-1">
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => setSelectedDate("")}
            >
              Limpar Filtro
            </Button>
          </div>
        </div>

        <div className="overflow-auto max-h-[500px] rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterAppointmentsByDate().map(appointment => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium flex items-center">
                    <User className="mr-2 h-4 w-4 text-gray-400" />
                    {appointment.clientName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Scissors className="mr-2 h-4 w-4 text-gray-400" />
                      {appointment.service}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      {formatDate(appointment.date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      {appointment.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {appointment.status === "pendente" && (
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-green-500"
                          onClick={() => confirmAppointment(appointment.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="sr-only">Confirmar</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => cancelAppointment(appointment.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Cancelar</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filterAppointmentsByDate().length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    Nenhum agendamento encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
