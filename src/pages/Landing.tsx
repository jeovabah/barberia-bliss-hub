
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronsRight } from "lucide-react";

const Landing = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "BarberBliss | Multiplataforma de Barbearias";
    fetchCompanies();
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50/30">
      <Navbar />
      
      <div className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container mx-auto px-4 relative h-full flex items-center z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">BarberBliss Platform</h1>
            <p className="text-xl mb-8">A plataforma completa para barbearias gerenciarem sua presença online e seus agendamentos.</p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <a href="#companies">Ver Barbearias</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section id="companies" className="py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Barbearias na Plataforma</h2>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
            </div>
          ) : companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companies.map((company) => (
                <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-amber-100 flex items-center justify-center">
                    <div className="text-5xl font-bold text-amber-500">{company.name.charAt(0)}</div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                    <Button asChild variant="outline" className="mt-4 w-full">
                      <Link to={`/${company.slug}`} className="flex items-center justify-center gap-2">
                        Visitar <ChevronsRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Nenhuma barbearia cadastrada no momento.</p>
          )}
        </div>
      </section>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Landing;
