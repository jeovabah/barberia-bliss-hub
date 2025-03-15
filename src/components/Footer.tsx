
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-amber-950 text-white" id="about">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 px-4">
          <div>
            <h3 className="text-xl font-bold mb-6">BARBER<span className="font-light text-amber-400">BLISS</span></h3>
            <p className="text-amber-200 text-sm mb-6">
              Experiência premium de barbearia dedicada ao artesanato e estilo pessoal. Elevando os padrões de cuidados masculinos desde 2015.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-amber-400 hover:text-white transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-amber-400 hover:text-white transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-amber-400 hover:text-white transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6 text-amber-300">Serviços</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-amber-200 hover:text-white text-sm transition-colors duration-300">Corte Clássico</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white text-sm transition-colors duration-300">Aparar & Modelar Barba</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white text-sm transition-colors duration-300">Barbear Premium</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white text-sm transition-colors duration-300">Tratamento Completo</a></li>
              <li><a href="#" className="text-amber-200 hover:text-white text-sm transition-colors duration-300">Estilização de Cabelo</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6 text-amber-300">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-amber-200 hover:text-white text-sm transition-colors duration-300">Início</a></li>
              <li><a href="#services" className="text-amber-200 hover:text-white text-sm transition-colors duration-300">Serviços</a></li>
              <li><a href="#barbers" className="text-amber-200 hover:text-white text-sm transition-colors duration-300">Nossos Barbeiros</a></li>
              <li><a href="#book-now" className="text-amber-200 hover:text-white text-sm transition-colors duration-300">Agendar Horário</a></li>
              <li><a href="#about" className="text-amber-200 hover:text-white text-sm transition-colors duration-300">Sobre Nós</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6 text-amber-300">Contato</h4>
            <address className="not-italic text-amber-200 text-sm">
              <p>Rua Principal, 123</p>
              <p>São Paulo, SP 01001</p>
              <p className="mt-4">(11) 9876-5432</p>
              <p>contato@barberbliss.com</p>
            </address>
            
            <div className="mt-6">
              <h5 className="text-sm font-medium mb-2 text-amber-300">Horário de Funcionamento</h5>
              <p className="text-amber-200 text-sm">Seg-Sex: 9h - 18h</p>
              <p className="text-amber-200 text-sm">Sáb: 10h - 17h</p>
              <p className="text-amber-200 text-sm">Dom: Fechado</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-amber-900 py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-amber-300 text-sm">© 2023 BarberBliss. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-amber-300 hover:text-white text-xs transition-colors duration-300">Política de Privacidade</a>
              <a href="#" className="text-amber-300 hover:text-white text-xs transition-colors duration-300">Termos de Serviço</a>
              <a href="#" className="text-amber-300 hover:text-white text-xs transition-colors duration-300">Política de Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
