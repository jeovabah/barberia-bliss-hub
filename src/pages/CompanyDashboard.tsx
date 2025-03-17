
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageEditor from "@/components/PageEditor";
import { LogOut, Home } from "lucide-react";

const CompanyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [puckData, setPuckData] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return;
      }

      if (profileData.user_type === 'admin') {
        navigate('/admin');
        return;
      }

      setProfile(profileData);

      if (profileData.company_id) {
        // Fetch company data
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profileData.company_id)
          .single();

        if (companyError) {
          console.error("Error fetching company:", companyError);
        } else {
          setCompany(companyData);
          
          // Fetch Puck content
          const { data: puckData, error: puckError } = await supabase
            .from('puck_content')
            .select('*')
            .eq('company_id', companyData.id)
            .single();

          if (puckError && puckError.code !== 'PGRST116') {
            console.error("Error fetching puck content:", puckError);
          } else if (puckData) {
            setPuckData(puckData.content);
          }
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const savePuckData = async (data: any) => {
    if (!company) {
      toast({
        title: "Erro",
        description: "Você precisa estar associado a uma empresa para salvar alterações.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if puck content exists for this company
      const { data: existingData, error: checkError } = await supabase
        .from('puck_content')
        .select('id')
        .eq('company_id', company.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing puck content:", checkError);
        return;
      }

      let result;
      
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('puck_content')
          .update({ content: data })
          .eq('company_id', company.id);
      } else {
        // Insert new record
        result = await supabase
          .from('puck_content')
          .insert({ company_id: company.id, content: data });
      }

      if (result.error) {
        console.error("Error saving puck content:", result.error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as alterações.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Salvo com sucesso",
          description: "As alterações foram salvas com sucesso."
        });
        setPuckData(data);
      }
    } catch (error) {
      console.error("Unexpected error saving puck content:", error);
    }
  };

  const viewSite = () => {
    if (company && company.slug) {
      window.open(`/${company.slug}`, '_blank');
    } else {
      toast({
        title: "Erro",
        description: "URL da empresa não encontrada.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    navigate('/auth');
    return null;
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sem empresa associada</CardTitle>
            <CardDescription>
              Sua conta não está associada a nenhuma empresa. Por favor, entre em contato com o administrador.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard da Empresa: {company.name}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={viewSite}>
              <Home className="mr-2 h-4 w-4" /> Ver Site
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <Tabs defaultValue="editor">
          <TabsList className="mb-8">
            <TabsTrigger value="editor">Editor de Página</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <PageEditor 
              initialData={puckData}
              onSave={savePuckData}
              onPreview={viewSite}
            />
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Agendamentos</CardTitle>
                <CardDescription>Veja e gerencie os agendamentos dos seus clientes.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade a ser implementada.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Empresa</CardTitle>
                <CardDescription>Personalize as configurações da sua empresa.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade a ser implementada.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  );
};

export default CompanyDashboard;
