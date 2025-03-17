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
import { Json } from "@/integrations/supabase/types";

// Define PuckContent interface to match the expected structure
interface PuckContent {
  content: any[];
  root: {
    props: any;
  };
}

const CompanyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [puckData, setPuckData] = useState<PuckContent | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Only navigate if we haven't checked auth yet
        if (!hasCheckedAuth) {
          setHasCheckedAuth(true);
          navigate('/auth');
        }
        return;
      }

      setHasCheckedAuth(true);

      // Get user email from session
      const userEmail = session.user.email;
      const userId = session.user.id;
      
      console.log("Session user:", session.user);
      
      // Special case for admin based on session email
      if (userEmail === 'admin@barberbliss.com') {
        navigate('/admin');
        return;
      }

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast({
          title: "Error loading profile",
          description: "Could not load your profile data.",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      console.log("Profile data:", profileData);

      // If user is admin by user_type, redirect to admin panel
      if (profileData.user_type === 'admin') {
        navigate('/admin');
        return;
      }

      setProfile(profileData);

      // Company users should have a company_id
      if (!profileData.company_id) {
        toast({
          title: "No associated company",
          description: "Your account is not associated with any company. Contact the administrator.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Fetch company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profileData.company_id)
        .single();

      if (companyError) {
        console.error("Error fetching company:", companyError);
        toast({
          title: "Error loading company",
          description: "Could not load your company data.",
          variant: "destructive"
        });
      } else {
        setCompany(companyData);
        console.log("Company data:", companyData);
        
        // First try a direct query to debug
        const { data: directPuckData, error: directPuckError } = await supabase
          .from('puck_content')
          .select('*')
          .eq('company_id', companyData.id)
          .maybeSingle();
          
        console.log("Direct puck_content query result:", directPuckData, directPuckError);
        
        // Use our function to fetch Puck content
        try {
          console.log("Fetching Puck content via function for company:", companyData.id);
          
          // Call the function directly via RPC
          const { data: puckContent, error: puckError } = await supabase
            .rpc('get_puck_content_by_company', { company_id_param: companyData.id });

          console.log("Puck content function response:", puckContent, puckError);

          if (puckError) {
            console.error("Error fetching puck content via function:", puckError);
            toast({
              title: "Error loading page content",
              description: "Could not load your page content.",
              variant: "destructive"
            });
            // Create default empty structure
            setPuckData({
              content: [],
              root: { props: {} }
            });
          } else if (puckContent) {
            console.log("Puck content loaded via function:", puckContent);
            
            // Make sure to clear any localStorage data to avoid loops
            localStorage.removeItem('puckData');
            
            // Process the content based on its type
            try {
              // Default empty structure to use if data is malformed
              const defaultContent: PuckContent = {
                content: [],
                root: { props: {} }
              };
              
              // Handle different response formats
              if (typeof puckContent === 'string') {
                // Parse string content
                console.log("Parsing string content");
                try {
                  const parsedContent = JSON.parse(puckContent);
                  // Validate parsed content has the correct structure
                  if (parsedContent && 
                      Array.isArray(parsedContent.content) && 
                      parsedContent.root && 
                      typeof parsedContent.root.props === 'object') {
                    setPuckData(parsedContent as PuckContent);
                  } else {
                    console.log("Parsed content missing required structure");
                    setPuckData(defaultContent);
                  }
                } catch (parseError) {
                  console.error("Error parsing string content:", parseError);
                  setPuckData(defaultContent);
                }
              } else if (typeof puckContent === 'object' && puckContent !== null) {
                // Handle object content
                console.log("Processing object content");
                
                if (puckContent.content && Array.isArray(puckContent.content) && 
                    puckContent.root && typeof puckContent.root === 'object') {
                  // Content has valid structure
                  const structured: PuckContent = {
                    content: puckContent.content,
                    root: {
                      props: puckContent.root.props || {}
                    }
                  };
                  setPuckData(structured);
                } else {
                  console.log("Object missing required structure");
                  setPuckData(defaultContent);
                }
              } else {
                console.log("Unexpected content format or null content");
                setPuckData(defaultContent);
              }
            } catch (parseError) {
              console.error("Error processing puck content:", parseError);
              setPuckData({
                content: [],
                root: { props: {} }
              });
            }
          } else {
            console.log("No puck content found via function");
            localStorage.removeItem('puckData');
            setPuckData({
              content: [],
              root: { props: {} }
            });
          }
        } catch (fetchError) {
          console.error("Exception fetching puck content:", fetchError);
          setPuckData({
            content: [],
            root: { props: {} }
          });
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Unexpected error",
        description: "An error occurred while loading data. Please try again later.",
        variant: "destructive"
      });
      setPuckData({
        content: [],
        root: { props: {} }
      });
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  };

  const savePuckData = async (data: PuckContent) => {
    if (!company) {
      toast({
        title: "Error",
        description: "You need to be associated with a company to save changes.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Saving Puck data:", data);
      
      // Remove from localStorage first to prevent any loops
      localStorage.removeItem('puckData');
      
      // Check if puck content exists for this company with direct query
      const { data: existingData, error: checkError } = await supabase
        .from('puck_content')
        .select('id')
        .eq('company_id', company.id)
        .maybeSingle();

      console.log("Existing data check:", existingData, checkError);
      
      if (checkError) {
        console.error("Error checking existing puck content:", checkError);
        toast({
          title: "Error checking existing data",
          description: "Could not verify if data already exists for this company.",
          variant: "destructive"
        });
        return;
      }

      // Convert PuckContent to Json type for Supabase
      const contentAsJson: Json = {
        content: data.content,
        root: data.root
      };

      let result;
      
      if (existingData) {
        // Update existing record
        console.log("Updating existing puck content record");
        result = await supabase
          .from('puck_content')
          .update({ content: contentAsJson })
          .eq('company_id', company.id);
      } else {
        // Insert new record
        console.log("Creating new puck content record");
        result = await supabase
          .from('puck_content')
          .insert({ company_id: company.id, content: contentAsJson });
      }

      console.log("Save operation result:", result);
      
      if (result.error) {
        console.error("Error saving puck content:", result.error);
        toast({
          title: "Error saving",
          description: "Could not save changes: " + result.error.message,
          variant: "destructive"
        });
      } else {
        console.log("Puck content saved successfully");
        toast({
          title: "Saved successfully",
          description: "Changes were saved successfully."
        });
        setPuckData(data);
        
        // Verify the saved data with a direct query
        const { data: verifyData, error: verifyError } = await supabase
          .from('puck_content')
          .select('content')
          .eq('company_id', company.id)
          .maybeSingle();
          
        console.log("Verification query result:", verifyData, verifyError);
        
        // Refresh the data to ensure we have the latest content
        const { data: refreshedContent, error: refreshError } = await supabase
          .rpc('get_puck_content_by_company', { company_id_param: company.id });
          
        console.log("Refreshed content via function:", refreshedContent, refreshError);
        
        if (!refreshError && refreshedContent) {
          try {
            console.log("Refreshed puck content:", refreshedContent);
            
            // Default content in case of issues
            const defaultContent: PuckContent = {
              content: [],
              root: { props: {} }
            };
            
            // Process the refreshed content
            if (typeof refreshedContent === 'string') {
              try {
                const parsedContent = JSON.parse(refreshedContent);
                if (parsedContent && 
                    Array.isArray(parsedContent.content) && 
                    parsedContent.root && 
                    typeof parsedContent.root.props === 'object') {
                  setPuckData(parsedContent);
                } else {
                  setPuckData(defaultContent);
                }
              } catch {
                setPuckData(defaultContent);
              }
            } else if (typeof refreshedContent === 'object' && refreshedContent !== null) {
              if (refreshedContent.content && Array.isArray(refreshedContent.content) && 
                  refreshedContent.root && typeof refreshedContent.root === 'object') {
                setPuckData({
                  content: refreshedContent.content,
                  root: {
                    props: refreshedContent.root.props || {}
                  }
                });
              } else {
                setPuckData(defaultContent);
              }
            } else {
              setPuckData(defaultContent);
            }
          } catch (error) {
            console.error("Error processing refreshed content:", error);
            // Keep using the data we just saved
            setPuckData(data);
          }
        }
      }
    } catch (error) {
      console.error("Unexpected error saving puck content:", error);
      toast({
        title: "Error saving",
        description: "An unexpected error occurred while saving changes.",
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
