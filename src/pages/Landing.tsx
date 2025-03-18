
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronsRight, Scissors, Calendar, Star, Clock, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Landing = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleSection, setVisibleSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.title = "BarberBliss | Multiplataforma de Barbearias";
    fetchCompanies();
    
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollY = window.scrollY;
      
      setScrolled(scrollY > 50);
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).clientHeight;
        
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

  // Updated color scheme with our premium amber/gold theme
  const colors = {
    primary: "#B45309", // Amber 800 - Deep amber
    secondary: "#F59E0B", // Amber 500 - Medium amber
    accent: "#78350F", // Amber 900 - Very dark amber
    light: "#FFF9E5", // Very light amber/cream
    dark: "#292524", // Warm dark color
    white: "#FFFFFF",
    gold: "#D4AF37", // Gold accent
  };

  const features = [
    {
      icon: <Scissors className="h-10 w-10 text-amber-600" />,
      title: "Agendamento Intuitivo",
      description: "Sistema de agendamento fácil e intuitivo que permite aos clientes marcar horários a qualquer momento."
    },
    {
      icon: <Calendar className="h-10 w-10 text-amber-600" />,
      title: "Gestão de Agenda",
      description: "Controle total sobre a disponibilidade de horários e gerenciamento eficiente da sua equipe."
    },
    {
      icon: <Star className="h-10 w-10 text-amber-600" />,
      title: "Presença Online",
      description: "Página personalizada para sua barbearia, destacando seus serviços e captando novos clientes."
    },
    {
      icon: <Clock className="h-10 w-10 text-amber-600" />,
      title: "Lembretes Automáticos",
      description: "Notificações automáticas para reduzir faltas e manter seus clientes informados."
    },
    {
      icon: <Users className="h-10 w-10 text-amber-600" />,
      title: "Gestão de Clientes",
      description: "Base de dados completa de clientes com histórico de serviços e preferências pessoais."
    },
    {
      icon: <CheckCircle2 className="h-10 w-10 text-amber-600" />,
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

  const AnimatedSection = ({ children, id, className = "" }: { children: React.ReactNode, id: string, className?: string }) => {
    const isVisible = visibleSection === id;
    
    return (
      <motion.section
        id={id}
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className={`py-24 px-4 ${className}`}
      >
        {children}
      </motion.section>
    );
  };

  // Create glowing animation style for certain elements
  const glowEffect = {
    boxShadow: `0 0 15px ${colors.secondary}, 0 0 30px rgba(245, 158, 11, 0.2)`,
    transition: "all 0.3s ease-in-out"
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50/30">
      <motion.div 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-amber-950/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
      </motion.div>
      
      <div className="relative h-screen bg-cover bg-center flex items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-950/90 to-amber-900/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-2xl text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1 text-sm rounded-full mb-6 font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ boxShadow: "0 2px 10px rgba(245, 158, 11, 0.5)" }}
            >
              Premium Barber Management Platform
            </motion.span>
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Elevando o <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600" style={{textShadow: "0 2px 10px rgba(245, 158, 11, 0.3)"}}>Padrão</span> das Barbearias
            </motion.h1>
            <motion.p 
              className="text-xl mb-10 text-amber-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              A plataforma completa para barbearias gerenciarem agendamentos, clientes e presença online. Transforme seu negócio com tecnologia premium.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-lg border-none" style={glowEffect}>
                <Link to="/auth" className="flex items-center gap-2">
                  Começar Gratuitamente <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild size="lg" className="border-amber-400 text-amber-100 hover:bg-amber-700/20 hover:text-white hover:border-amber-300 text-lg">
                <a href="#features" className="flex items-center gap-2">
                  Conhecer Recursos <ChevronsRight size={16} />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-950 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />
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

      <AnimatedSection id="features" className="bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span 
              className="text-amber-600 text-sm font-medium uppercase tracking-wider px-4 py-1 rounded-full bg-amber-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Recursos Exclusivos
            </motion.span>
            <motion.h2 
              className="text-4xl font-bold mt-4 mb-4 text-amber-950 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="relative z-10">Tudo que sua barbearia merece</span>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-amber-400 rounded-full opacity-50"></span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-700"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Nossa plataforma foi desenvolvida para atender às necessidades específicas de barbearias premium, oferecendo ferramentas avançadas para impulsionar seu negócio.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-amber-100 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, backgroundColor: "rgba(254, 243, 199, 0.5)" }}
              >
                <div className="mb-6 w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 group-hover:from-amber-100 group-hover:to-amber-200 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-900 group-hover:text-amber-700 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 group-hover:text-amber-900/80 transition-colors">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="pricing" className="bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span 
              className="text-amber-600 text-sm font-medium uppercase tracking-wider px-4 py-1 rounded-full bg-amber-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Planos e Preços
            </motion.span>
            <motion.h2 
              className="text-4xl font-bold mt-4 mb-4 text-amber-950 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="relative z-10">Escolha o plano ideal para seu negócio</span>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-amber-400 rounded-full opacity-50"></span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-700"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Temos opções que se adequam a barbearias de todos os tamanhos, com recursos exclusivos para cada estágio do seu negócio.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={index}
                className={`rounded-xl overflow-hidden transition-all duration-500 ${
                  plan.highlighted 
                    ? 'border-4 border-amber-500 shadow-xl scale-105 relative z-10' 
                    : 'border border-amber-200 shadow-lg hover:shadow-2xl hover:border-amber-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={!plan.highlighted ? { y: -10, scale: 1.02 } : { y: -5 }}
                style={plan.highlighted ? { 
                  boxShadow: `0 10px 30px rgba(245, 158, 11, 0.3), 0 0 0 4px rgba(245, 158, 11, 0.2)` 
                } : {}}
              >
                {plan.highlighted && (
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center py-2 text-sm font-medium">
                    Mais Popular
                  </div>
                )}
                <div className={`p-8 ${plan.highlighted ? 'bg-gradient-to-b from-amber-50 to-white' : 'bg-white'}`}>
                  <h3 className="text-2xl font-bold mb-2 text-amber-900">{plan.title}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-amber-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 className={`h-5 w-5 ${plan.highlighted ? 'text-amber-600' : 'text-amber-500'} mr-2 mt-0.5 flex-shrink-0`} />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className={`w-full ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl' 
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

      <AnimatedSection id="testimonials" className="bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span 
              className="text-amber-600 text-sm font-medium uppercase tracking-wider px-4 py-1 rounded-full bg-amber-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Depoimentos
            </motion.span>
            <motion.h2 
              className="text-4xl font-bold mt-4 mb-4 text-amber-950 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="relative z-10">O que nossos clientes dizem</span>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-amber-400 rounded-full opacity-50"></span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-700"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Veja como o BarberBliss tem transformado barbearias por todo o país.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl border border-amber-100 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -5, borderColor: "rgb(245, 158, 11)" }}
              >
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="inline-block h-5 w-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-200 mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900">{testimonial.name}</h4>
                    <p className="text-amber-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="companies" className="bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span 
              className="text-amber-600 text-sm font-medium uppercase tracking-wider px-4 py-1 rounded-full bg-amber-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Exemplos
            </motion.span>
            <motion.h2 
              className="text-4xl font-bold mt-4 mb-4 text-amber-950 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="relative z-10">Barbearias Premium na Plataforma</span>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-amber-400 rounded-full opacity-50"></span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-700"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Conheça algumas barbearias de sucesso que utilizam o BarberBliss para oferecer serviços de excelência.
            </motion.p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            </div>
          ) : companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border border-amber-200 h-full group">
                    <div className="h-48 bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center relative overflow-hidden">
                      <div className="text-6xl font-bold text-white z-10">{company.name.charAt(0)}</div>
                      <div className="absolute inset-0 bg-amber-600 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <motion.div
                        className="absolute -bottom-10 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                        animate={{ 
                          x: [0, 10, 0], 
                          y: [0, 15, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 5, 
                          ease: "easeInOut" 
                        }}
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-amber-900">{company.name}</h3>
                      <p className="text-gray-600 mb-4">Uma barbearia exclusiva com serviços premium para o homem moderno.</p>
                      <Button asChild variant="outline" className="w-full mt-2 border-amber-500 text-amber-700 hover:bg-amber-50 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all duration-300">
                        <Link to={`/${company.slug}`} className="flex items-center justify-center gap-2">
                          Visitar <ChevronsRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 bg-gradient-to-r from-amber-50 to-white p-12 rounded-xl shadow-md max-w-lg mx-auto border border-amber-100">
              <Scissors className="h-14 w-14 text-amber-500 mx-auto mb-6 opacity-80" />
              <h3 className="text-2xl font-medium mb-3 text-amber-900">Seja o primeiro!</h3>
              <p className="mb-8 text-gray-600">Destaque seu negócio em nossa plataforma premium e atraia clientes que procuram qualidade e sofisticação.</p>
              <Button asChild className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl">
                <Link to="/auth">Cadastrar Minha Barbearia</Link>
              </Button>
            </div>
          )}
        </div>
      </AnimatedSection>

      <AnimatedSection id="cta" className="bg-amber-50 pt-16 pb-0 px-0">
        <div className="container mx-auto pb-24">
          <div className="bg-gradient-to-br from-amber-800 to-amber-900 rounded-2xl p-16 text-center text-white max-w-5xl mx-auto relative overflow-hidden shadow-2xl">
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl"
              animate={{ 
                x: [0, 50, 0], 
                y: [0, 30, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 8, 
                ease: "easeInOut" 
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl"
              animate={{ 
                x: [0, -30, 0], 
                y: [0, -20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                repeat: Infinity,
                duration: 6, 
                ease: "easeInOut",
                delay: 1
              }}
            />
            <div className="relative z-10">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Pronto para transformar sua barbearia?
              </motion.h2>
              <motion.p 
                className="text-xl mb-10 max-w-2xl mx-auto text-amber-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Junte-se às barbearias de elite que estão elevando o padrão de serviço com a plataforma BarberBliss. Começe hoje mesmo!
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button asChild size="lg" className="bg-white text-amber-900 hover:bg-amber-100 text-lg" style={{ boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)" }}>
                  <Link to="/auth" className="flex items-center gap-2">
                    Começar Agora <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-amber-400 text-amber-100 hover:bg-amber-800/50 hover:text-white hover:border-amber-300 text-lg backdrop-blur-sm">
                  <a href="#pricing" className="flex items-center gap-2">
                    Ver Planos <ChevronsRight size={18} />
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="bg-amber-950 text-amber-100 py-4 text-center text-sm">
          <p>Já temos uma empresa registrada: <Link to="/barberbliss-elite" className="text-amber-400 hover:text-amber-300 underline">BarberBliss Elite</Link></p>
        </div>
      </AnimatedSection>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Landing;
