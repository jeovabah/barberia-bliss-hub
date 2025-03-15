
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, Scissors } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const horarios = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

const servicos = [
  { id: 1, nome: "Corte Clássico", duracao: "45 min", preco: "R$70" },
  { id: 2, nome: "Barba & Modelagem", duracao: "30 min", preco: "R$50" },
  { id: 3, nome: "Barbear Premium", duracao: "45 min", preco: "R$90" },
  { id: 4, nome: "Tratamento Completo", duracao: "90 min", preco: "R$170" },
];

const barbeiros = [
  { id: 1, nome: "Alexandre Silva" },
  { id: 2, nome: "Miguel Rodrigues" },
  { id: 3, nome: "Daniel Costa" },
];

const BookingForm = () => {
  const { toast } = useToast();
  const [data, setData] = useState<Date | undefined>(undefined);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
  });
  const [etapa, setEtapa] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [horariosAberto, setHorariosAberto] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const proximaEtapa = () => {
    // Validação básica por etapa
    if (etapa === 1 && !servicoSelecionado) {
      toast({
        title: "Selecione um serviço",
        description: "Por favor, escolha um serviço para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    if (etapa === 2 && !barbeiroSelecionado) {
      toast({
        title: "Selecione um barbeiro",
        description: "Por favor, escolha um profissional para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    if (etapa === 3 && (!data || !horarioSelecionado)) {
      toast({
        title: "Selecione data e horário",
        description: "Por favor, escolha uma data e horário disponíveis.",
        variant: "destructive",
      });
      return;
    }
    
    setEtapa(prev => prev + 1);
  };

  const etapaAnterior = () => {
    setEtapa(prev => prev - 1);
  };

  const formatarData = (date: Date) => {
    try {
      return format(date, "d 'de' MMMM, yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação final
    if (!data || !horarioSelecionado || !servicoSelecionado || !barbeiroSelecionado || 
        !formData.nome || !formData.telefone || !formData.email) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, preencha todos os campos para confirmar seu agendamento.",
        variant: "destructive",
      });
      return;
    }
    
    setCarregando(true);
    
    // Simulando um envio de dados
    setTimeout(() => {
      const servicoNome = servicos.find(s => s.id === servicoSelecionado)?.nome;
      const barbeiroNome = barbeiros.find(b => b.id === barbeiroSelecionado)?.nome;
      
      // Mensagem de sucesso
      toast({
        title: "Agendamento Confirmado!",
        description: `${formData.nome}, seu agendamento para ${servicoNome} com ${barbeiroNome} em ${formatarData(data)} às ${horarioSelecionado} foi confirmado.`,
      });
      
      // Reset do formulário
      setData(undefined);
      setHorarioSelecionado(null);
      setServicoSelecionado(null);
      setBarbeiroSelecionado(null);
      setFormData({ nome: "", telefone: "", email: "" });
      setEtapa(1);
      setCarregando(false);
    }, 1500);
  };

  const renderEtapa = () => {
    switch (etapa) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Escolha o Serviço Desejado</h3>
            <div className="grid grid-cols-1 gap-3">
              {servicos.map((servico) => (
                <div
                  key={servico.id}
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all duration-300",
                    servicoSelecionado === servico.id 
                      ? "border-amber-500 bg-amber-50" 
                      : "border-gray-200 hover:border-amber-200"
                  )}
                  onClick={() => setServicoSelecionado(servico.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <Scissors className="w-5 h-5 text-amber-600 mt-1" />
                      <div>
                        <h4 className="font-medium">{servico.nome}</h4>
                        <span className="text-xs text-muted-foreground">{servico.duracao}</span>
                      </div>
                    </div>
                    <span className="font-medium text-amber-700">{servico.preco}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Escolha o Profissional</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {barbeiros.map((barbeiro) => (
                <div
                  key={barbeiro.id}
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all duration-300 text-center",
                    barbeiroSelecionado === barbeiro.id 
                      ? "border-amber-500 bg-amber-50" 
                      : "border-gray-200 hover:border-amber-200"
                  )}
                  onClick={() => setBarbeiroSelecionado(barbeiro.id)}
                >
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-amber-600" />
                  </div>
                  <h4 className="font-medium">{barbeiro.nome}</h4>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Escolha a Data e Horário</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selecione a Data</Label>
                <Popover open={calendarioAberto} onOpenChange={setCalendarioAberto}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !data && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {data ? formatarData(data) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={data}
                      onSelect={(date) => {
                        setData(date);
                        if (date) {
                          setCalendarioAberto(false);
                        }
                      }}
                      locale={ptBR}
                      initialFocus
                      disabled={(date) => 
                        date < new Date() || 
                        date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selecione o Horário</Label>
                <Popover open={horariosAberto} onOpenChange={setHorariosAberto}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !horarioSelecionado && "text-muted-foreground"
                      )}
                      disabled={!data}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {horarioSelecionado || "Selecione um horário"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <div className="grid grid-cols-3 gap-2">
                      {horarios.map((horario) => (
                        <Button
                          key={horario}
                          variant="outline"
                          className={cn(
                            "text-xs h-9",
                            horarioSelecionado === horario && "bg-amber-500 text-white hover:bg-amber-600 border-amber-500"
                          )}
                          onClick={() => {
                            setHorarioSelecionado(horario);
                            setHorariosAberto(false);
                          }}
                        >
                          {horario}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Informações de Contato</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">Nome Completo</Label>
                <div className="relative">
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Digite seu nome completo"
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-medium">Telefone</Label>
                <div className="relative">
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="Digite seu telefone com DDD"
                    className="pl-10"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Digite seu email"
                    className="pl-10"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5:
        const servicoInfo = servicos.find(s => s.id === servicoSelecionado);
        const barbeiroInfo = barbeiros.find(b => b.id === barbeiroSelecionado);
        
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Confirmar Agendamento</h3>
            
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <h4 className="font-medium text-amber-800 mb-3">Resumo do Agendamento</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Serviço:</span>
                  <span className="font-medium">{servicoInfo?.nome}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Barbeiro:</span>
                  <span className="font-medium">{barbeiroInfo?.nome}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Data:</span>
                  <span className="font-medium">{data ? formatarData(data) : ''}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Horário:</span>
                  <span className="font-medium">{horarioSelecionado}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Duração:</span>
                  <span className="font-medium">{servicoInfo?.duracao}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Valor:</span>
                  <span className="font-medium text-amber-700">{servicoInfo?.preco}</span>
                </div>
                
                <div className="pt-2 mt-2 border-t border-amber-200">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nome:</span>
                    <span className="font-medium">{formData.nome}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Telefone:</span>
                    <span className="font-medium">{formData.telefone}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Ao confirmar, você concorda com nossa política de cancelamento que permite reagendamento gratuito com até 4 horas de antecedência.
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section className="py-24 px-4 bg-amber-50/50" id="book-now">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <span className="text-xs uppercase tracking-widest mb-2 inline-block text-amber-600">
                Agende sua Visita
              </span>
              <h2 className="heading-lg mb-4 text-amber-950">Reserve seu Horário</h2>
              <p className="text-muted-foreground mb-6">
                Agende sua próxima sessão com nossos barbeiros especializados. Escolha a data, hora e serviço para uma experiência personalizada.
              </p>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-amber-100/50">
                <h3 className="text-lg font-medium mb-4 text-amber-900">Por que Escolher Nossos Serviços?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Barbeiros profissionais qualificados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Produtos e ferramentas premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Ambiente confortável e moderno</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Atenção personalizada aos detalhes</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 border border-amber-200 bg-white rounded-2xl shadow-sm">
                <h3 className="text-lg font-medium mb-2 text-amber-900">Precisa de Ajuda?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Entre em contato diretamente conosco se tiver dúvidas ou precisar de ajuda com seu agendamento.
                </p>
                <a href="tel:+5511987654321" className="text-sm font-medium inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 hover:underline">
                  <Phone className="w-4 h-4" />
                  +55 (11) 98765-4321
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-amber-100/50"
            >
              {/* Indicador de progresso */}
              <div className="mb-8 relative">
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div 
                      key={step} 
                      className={`flex flex-col items-center relative z-10 
                        ${etapa >= step ? 'text-amber-600' : 'text-gray-400'}`}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                          ${etapa >= step 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                          }`}
                      >
                        {step}
                      </div>
                      {step === 1 && <span className="text-xs hidden md:block">Serviço</span>}
                      {step === 2 && <span className="text-xs hidden md:block">Barbeiro</span>}
                      {step === 3 && <span className="text-xs hidden md:block">Data</span>}
                      {step === 4 && <span className="text-xs hidden md:block">Contato</span>}
                      {step === 5 && <span className="text-xs hidden md:block">Confirmar</span>}
                    </div>
                  ))}
                </div>
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
                <div 
                  className="absolute top-4 left-0 h-0.5 bg-amber-500 -z-0 transition-all duration-300"
                  style={{ width: `${(etapa - 1) * 25}%` }}
                ></div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderEtapa()}
                
                <div className="flex justify-between mt-8">
                  {etapa > 1 ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-amber-200 text-amber-700 hover:bg-amber-50"
                      onClick={etapaAnterior}
                      disabled={carregando}
                    >
                      Voltar
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  {etapa < 5 ? (
                    <Button 
                      type="button" 
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      onClick={proximaEtapa}
                    >
                      Continuar
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={carregando}
                    >
                      {carregando ? "Processando..." : "Confirmar Agendamento"}
                    </Button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
