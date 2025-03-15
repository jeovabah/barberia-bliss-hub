
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-lg border-b border-amber-200 py-4" 
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#" className="text-xl font-bold tracking-tighter animate-fade-in">
          BARBER<span className="font-light text-amber-600">BLISS</span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { name: 'Início', href: 'home' },
            { name: 'Serviços', href: 'services' },
            { name: 'Barbeiros', href: 'barbers' },
            { name: 'Agendar', href: 'book-now' },
            { name: 'Sobre', href: 'about' }
          ].map((item, index) => (
            <a 
              key={item.name} 
              href={`#${item.href}`}
              className={cn(
                "text-sm font-medium transition-all duration-300 hover:text-amber-600 relative",
                "after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-amber-600",
                "after:transition-all after:duration-300 hover:after:w-full"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {item.name}
            </a>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col space-y-1.5"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Alternar menu"
        >
          <span className={cn(
            "w-6 h-px bg-amber-800 transition-all duration-300",
            isMobileMenuOpen && "transform rotate-45 translate-y-1.5"
          )}></span>
          <span className={cn(
            "w-6 h-px bg-amber-800 transition-all duration-300",
            isMobileMenuOpen && "opacity-0"
          )}></span>
          <span className={cn(
            "w-6 h-px bg-amber-800 transition-all duration-300",
            isMobileMenuOpen && "transform -rotate-45 -translate-y-1.5"
          )}></span>
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden fixed inset-0 bg-amber-50 z-40 transition-all duration-500 ease-in-out flex flex-col pt-24 px-4",
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <nav className="flex flex-col space-y-8 items-center">
          {[
            { name: 'Início', href: 'home' },
            { name: 'Serviços', href: 'services' },
            { name: 'Barbeiros', href: 'barbers' },
            { name: 'Agendar', href: 'book-now' },
            { name: 'Sobre', href: 'about' }
          ].map((item) => (
            <a 
              key={item.name} 
              href={`#${item.href}`}
              className="text-xl font-medium text-amber-900"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
