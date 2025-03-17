
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
import AppointmentsTable from "@/components/AppointmentsTable";

const CompanyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [puckData, setPuckData] = useState<any>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Obtenha a sessão atual do usuário
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Apenas navegue se ainda não verificamos a autenticação
        if (!hasCheckedAuth) {
          setHasCheckedAuth(true);
          navigate('/auth');
        }
        return;
      }

      setHasCheckedAuth(true);

      // Obtenha o email do usuário da sessão - não consulte diretamente a tabela auth.users
      const userEmail = session.user.email;
      const userId = session.user.id;
      
      console.log("Session user:", session.user);
      
      // Caso especial para admin baseado no email da sessão, não consultando auth.users
      if (userEmail === 'admin@barberbliss.com') {
        navigate('/admin');
        return;
      }

      // Buscar perfil do usuário da tabela profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar os dados do seu perfil.",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      console.log("Profile data:", profileData);

      // Se o usuário for administrador por user_type, redirecione para o painel de administração
      if (profileData.user_type === 'admin') {
        navigate('/admin');
        return;
      }

      setProfile(profileData);

      // Usuários da empresa devem ter um company_id
      if (!profileData.company_id) {
        toast({
          title: "Sem empresa associada",
          description: "Sua conta não está associada a nenhuma empresa. Entre em contato com o administrador.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Buscar dados da empresa
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profileData.company_id)
        .single();

      if (companyError) {
        console.error("Erro ao buscar empresa:", companyError);
        toast({
          title: "Erro ao carregar empresa",
          description: "Não foi possível carregar os dados da sua empresa.",
          variant: "destructive"
        });
      } else {
        setCompany(companyData);
        console.log("Company data:", companyData);
        
        // Usar nossa nova função para buscar o conteúdo Puck sem problemas de permissão
        try {
          console.log("Fetching Puck content using the new function for company:", companyData.id);
          
          // Chamando a função diretamente via RPC em vez de acessar a tabela
          const { data: puckContent, error: puckError } = await supabase
            .rpc('get_puck_content_by_company', { company_id_param: companyData.id });

          console.log("Puck content function response:", puckContent, puckError);

          if (puckError) {
            console.error("Erro ao buscar conteúdo puck via função:", puckError);
            toast({
              title: "Erro ao carregar conteúdo da página",
              description: "Não foi possível carregar o conteúdo da sua página.",
              variant: "destructive"
            });
          } else if (puckContent) {
            console.log("Conteúdo Puck carregado via função:", puckContent);
            // Certifique-se de limpar qualquer dado do localStorage para evitar loops
            localStorage.removeItem('puckData');
            setPuckData(puckContent);
          } else {
            console.log("Nenhum conteúdo puck encontrado via função");
            localStorage.removeItem('puckData');
            setPuckData(null);
          }
        } catch (fetchError) {
          console.error("Exceção ao buscar conteúdo puck:", fetchError);
        }
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setDataLoaded(true);
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
      setLoading(true);
      console.log("Saving Puck data:", data);
      
      // Remove from localStorage first to prevent any loops
      localStorage.removeItem('puckData');
      
      // Check if puck content exists for this company
      const { data: existingData, error: checkError } = await supabase
        .from('puck_content')
        .select('id')
        .eq('company_id', company.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing puck content:", checkError);
        toast({
          title: "Erro ao verificar dados existentes",
          description: "Não foi possível verificar se já existem dados para esta empresa.",
          variant: "destructive"
        });
        return;
      }

      let result;
      
      if (existingData) {
        // Update existing record
        console.log("Updating existing puck content record");
        result = await supabase
          .from('puck_content')
          .update({ content: data })
          .eq('company_id', company.id);
      } else {
        // Insert new record
        console.log("Creating new puck content record");
        result = await supabase
          .from('puck_content')
          .insert({ company_id: company.id, content: data });
      }

      if (result.error) {
        console.error("Error saving puck content:", result.error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as alterações: " + result.error.message,
          variant: "destructive"
        });
      } else {
        console.log("Puck content saved successfully:", result);
        toast({
          title: "Salvo com sucesso",
          description: "As alterações foram salvas com sucesso."
        });
        setPuckData(data);
        
        // Refresh the data to ensure we have the latest content
        const { data: refreshedContent, error: refreshError } = await supabase
          .rpc('get_puck_content_by_company', { company_id_param: company.id });
          
        if (!refreshError && refreshedContent) {
          console.log("Refreshed puck content:", refreshedContent);
          setPuckData(refreshedContent);
        }
      }
    } catch (error) {
      console.error("Unexpected error saving puck content:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado ao salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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

  const handleSignOut = async () => {
    try {
      setLoading(true);
      // First clear all local storage
      localStorage.removeItem('sb-fxdliwfsmavtagwnrjon-auth-token');
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('puckData');
      
      // Then attempt to sign out through the API
      await supabase.auth.signOut();
      
      // Always navigate to auth regardless of API result
      navigate('/auth');
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao sair",
        variant: "destructive"
      });
      // Attempt to redirect anyway
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dataLoaded) {
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
    if (hasCheckedAuth) {
      navigate('/auth');
      return null;
    }
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
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
          <h1 className="text-xl font-bold">Dashboard da Empresa: {company?.name}</h1>
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
            {dataLoaded && (
              <PageEditor 
                initialData={puckData}
                onSave={savePuckData}
                onPreview={viewSite}
              />
            )}
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Agendamentos</CardTitle>
                <CardDescription>Veja e gerencie os agendamentos dos seus clientes.</CardDescription>
              </CardHeader>
              <CardContent>
                {company && <AppointmentsTable companyId={company.id} />}
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
