
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronsRight, Scissors, Calendar, Star, Clock, Users, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const Landing = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleSection, setVisibleSection] = useState("");

  useEffect(() => {
    document.title = "BarberBliss | Multiplataforma de Barbearias";
    fetchCompanies();
    
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).clientHeight;
        const scrollY = window.scrollY;
        
        if (scrollY >= sectionTop - 300 && scrollY < sectionTop + sectionHeight - 300) {
          setVisibleSection(section.getAttribute("id") || "");
        }
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*');

      if (error) {
        console.error("Error fetching companies:", error);
      } else {
        setCompanies(data || []);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Scissors className="h-10 w-10 text-amber-500" />,
      title: "Agendamento Intuitivo",
      description: "Sistema de agendamento fácil e intuitivo que permite aos clientes marcar horários a qualquer momento."
    },
    {
      icon: <Calendar className="h-10 w-10 text-amber-500" />,
      title: "Gestão de Agenda",
      description: "Controle total sobre a disponibilidade de horários e gerenciamento eficiente da sua equipe."
    },
    {
      icon: <Star className="h-10 w-10 text-amber-500" />,
      title: "Presença Online",
      description: "Página personalizada para sua barbearia, destacando seus serviços e captando novos clientes."
    },
    {
      icon: <Clock className="h-10 w-10 text-amber-500" />,
      title: "Lembretes Automáticos",
      description: "Notificações automáticas para reduzir faltas e manter seus clientes informados."
    },
    {
      icon: <Users className="h-10 w-10 text-amber-500" />,
      title: "Gestão de Clientes",
      description: "Base de dados completa de clientes com histórico de serviços e preferências pessoais."
    },
    {
      icon: <CheckCircle2 className="h-10 w-10 text-amber-500" />,
      title: "Relatórios Detalhados",
      description: "Acompanhe o desempenho do seu negócio com relatórios detalhados e análises estratégicas."
    }
  ];

  const pricing = [
    {
      title: "Básico",
      price: "R$99",
      period: "/mês",
      description: "Ideal para barbearias iniciantes",
      features: [
        "Agendamento online",
        "Página personalizada",
        "Até 2 barbeiros",
        "Suporte por email"
      ],
      cta: "Começar Agora",
      highlighted: false
    },
    {
      title: "Profissional",
      price: "R$199",
      period: "/mês",
      description: "Perfeito para barbearias em crescimento",
      features: [
        "Tudo do plano Básico",
        "Até 5 barbeiros",
        "Lembretes por SMS",
        "Relatórios básicos",
        "Suporte prioritário"
      ],
      cta: "Escolha Profissional",
      highlighted: true
    },
    {
      title: "Premium",
      price: "R$349",
      period: "/mês",
      description: "Para barbearias estabelecidas",
      features: [
        "Tudo do plano Profissional",
        "Barbeiros ilimitados",
        "Integração com redes sociais",
        "Relatórios avançados",
        "Suporte 24/7",
        "Consultoria de marketing"
      ],
      cta: "Escolha Premium",
      highlighted: false
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Proprietário da Barber King",
      image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1780",
      quote: "Desde que implementamos o BarberBliss, nossos agendamentos aumentaram em 40% e as faltas diminuíram drasticamente. A plataforma é intuitiva e nossos clientes adoram."
    },
    {
      name: "Rodrigo Almeida",
      role: "Gerente da Premium Cuts",
      image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=1634",
      quote: "A presença online proporcionada pelo BarberBliss nos colocou no mapa. Agora recebemos clientes de toda a cidade que encontram nossos serviços através da plataforma."
    },
    {
      name: "Marcos Oliveira",
      role: "Barbeiro na Studio M",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887",
      quote: "Como barbeiro, posso me concentrar no que faço de melhor enquanto o sistema cuida de toda a parte administrativa. Os relatórios me ajudam a entender melhor meu negócio."
    }
  ];

  const AnimatedSection = ({ children, id }: { children: React.ReactNode, id: string }) => {
    const isVisible = visibleSection === id;
    
    return (
      <motion.section
        id={id}
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="py-24 px-4"
      >
        {children}
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50/30">
      <Navbar />
      
      <div className="relative h-screen bg-cover bg-center flex items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-2xl text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="inline-block bg-amber-600 text-white px-3 py-1 text-sm rounded-full mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Plataforma All-in-One para Barbearias
            </motion.span>
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Transforme sua <span className="text-amber-500">Barbearia</span> com Tecnologia
            </motion.h1>
            <motion.p 
              className="text-xl mb-10 text-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              A plataforma completa para barbearias gerenciarem agendamentos, clientes e presença online. Aumente sua eficiência e impulsione seus resultados.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg">
                <Link to="/auth">Começar Gratuitamente</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg">
                <a href="#features">Conhecer Recursos</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <motion.div 
            className="inline-block animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <a href="#features" className="text-white text-sm flex flex-col items-center">
              <span className="mb-2">Saiba mais</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </a>
          </motion.div>
        </div>
      </div>

      <AnimatedSection id="features">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">Recursos Exclusivos</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 text-amber-950">Tudo que sua barbearia precisa</h2>
            <p className="text-lg text-gray-700">
              Nossa plataforma foi desenvolvida com foco nas necessidades específicas de barbearias, oferecendo um conjunto completo de ferramentas para impulsionar seu negócio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="pricing">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">Planos e Preços</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 text-amber-950">Escolha o plano ideal para sua barbearia</h2>
            <p className="text-lg text-gray-700">
              Temos opções que se adequam a barbearias de todos os tamanhos, desde iniciantes até estabelecimentos consolidados.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={index}
                className={`rounded-xl overflow-hidden transition-all duration-300 ${
                  plan.highlighted 
                    ? 'border-4 border-amber-500 shadow-xl scale-105 relative z-10' 
                    : 'border border-gray-200 shadow-md'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {plan.highlighted && (
                  <div className="bg-amber-500 text-white text-center py-1 text-sm font-medium">
                    Mais Popular
                  </div>
                )}
                <div className="bg-white p-8">
                  <h3 className="text-2xl font-bold mb-2 text-amber-900">{plan.title}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-amber-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className={`w-full ${
                      plan.highlighted 
                        ? 'bg-amber-600 hover:bg-amber-700' 
                        : 'bg-amber-500 hover:bg-amber-600'
                    }`}
                  >
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="testimonials">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">Depoimentos</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 text-amber-950">O que nossos clientes dizem</h2>
            <p className="text-lg text-gray-700">
              Veja como o BarberBliss tem transformado barbearias em todo o Brasil.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="inline-block h-5 w-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-amber-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="companies">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">Exemplos</span>
            <h2 className="text-4xl font-bold mt-2 mb-4 text-amber-950">Barbearias na Plataforma</h2>
            <p className="text-lg text-gray-700">
              Conheça algumas barbearias que já utilizam o BarberBliss para impulsionar seus negócios.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            </div>
          ) : companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="h-48 bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                      <div className="text-5xl font-bold text-white">{company.name.charAt(0)}</div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-amber-950">{company.name}</h3>
                      <p className="text-gray-600 mb-4">Uma barbearia exclusiva com serviços premium para o homem moderno.</p>
                      <Button asChild variant="outline" className="w-full mt-2 border-amber-500 text-amber-700 hover:bg-amber-50">
                        <Link to={`/${company.slug}`} className="flex items-center justify-center gap-2">
                          Visitar <ChevronsRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 bg-white p-8 rounded-xl shadow-md max-w-lg mx-auto">
              <Scissors className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Seja o primeiro!</h3>
              <p className="mb-6">Ainda não temos barbearias cadastradas. Seja o pioneiro e destaque seu negócio em nossa plataforma!</p>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link to="/auth">Cadastrar Minha Barbearia</Link>
              </Button>
            </div>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection id="cta">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-amber-500 to-amber-700 rounded-2xl p-12 text-center text-white max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Pronto para transformar sua barbearia?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de barbearias que estão elevando seus negócios com o BarberBliss. Comece hoje mesmo!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-amber-700 hover:bg-gray-100 text-lg">
                <Link to="/auth">Começar Agora</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg">
                <a href="#pricing">Ver Planos</a>
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Landing;
