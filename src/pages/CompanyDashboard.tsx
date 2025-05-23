
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
import SpecialistManagement from "@/components/SpecialistManagement";
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
        
        if (directPuckData) {
          // Extract the content field from the direct query result
          console.log("Found Puck content directly:", directPuckData.content);
          
          try {
            // Extract the content field from directPuckData
            const contentData = directPuckData.content as any;
            
            // Validate that it has the expected structure
            if (contentData && 
                typeof contentData === 'object' && 
                'content' in contentData && 
                'root' in contentData && 
                Array.isArray(contentData.content)) {
              // It has the right shape
              const validPuckData: PuckContent = {
                content: contentData.content,
                root: {
                  props: contentData.root && typeof contentData.root === 'object' && 
                         contentData.root.props ? contentData.root.props : {}
                }
              };
              
              setPuckData(validPuckData);
              setDataLoaded(true);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error processing direct Puck data:", error);
          }
        }
        
        // If direct query didn't work or had invalid data, try the function
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
            
            // Default empty structure to use if data is malformed
            const defaultContent: PuckContent = {
              content: [],
              root: { props: {} }
            };
            
            // Process the content based on its structure
            let validPuckData: PuckContent;
            
            // Check if puckContent is an object with both content and root properties
            if (typeof puckContent === 'object' && puckContent !== null && 
                'content' in puckContent && 'root' in puckContent && 
                Array.isArray((puckContent as any).content)) {
              // It has the right shape, validate deeper structure
              const contentData = puckContent as any;
              validPuckData = {
                content: Array.isArray(contentData.content) ? contentData.content : [],
                root: {
                  props: contentData.root && typeof contentData.root === 'object' && 
                         contentData.root.props ? contentData.root.props : {}
                }
              };
            } else if (typeof puckContent === 'string') {
              // Try to parse string content
              try {
                const parsedContent = JSON.parse(puckContent);
                if (parsedContent && 
                    'content' in parsedContent && Array.isArray(parsedContent.content) && 
                    'root' in parsedContent && typeof parsedContent.root === 'object') {
                  validPuckData = {
                    content: parsedContent.content,
                    root: {
                      props: parsedContent.root.props || {}
                    }
                  };
                } else {
                  console.log("Parsed content missing required structure");
                  validPuckData = defaultContent;
                }
              } catch (parseError) {
                console.error("Error parsing string content:", parseError);
                validPuckData = defaultContent;
              }
            } else {
              // Fallback to default content
              console.log("Content has invalid structure:", puckContent);
              validPuckData = defaultContent;
            }
            
            setPuckData(validPuckData);
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
      // This ensures compatibility with the database schema
      const contentAsJson = {
        content: data.content,
        root: {
          props: data.root.props
        }
      } as Json;

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
        if (verifyData && verifyData.content) {
          try {
            const contentData = verifyData.content as any;
            
            // Validate that the returned data has the expected structure
            if (contentData && 
                typeof contentData === 'object' && 
                'content' in contentData && 
                'root' in contentData && 
                Array.isArray(contentData.content)) {
              // It has the right shape
              const validPuckData: PuckContent = {
                content: contentData.content,
                root: {
                  props: contentData.root && typeof contentData.root === 'object' && 
                         contentData.root.props ? contentData.root.props : {}
                }
              };
              
              setPuckData(validPuckData);
            }
          } catch (error) {
            console.error("Error processing verified content:", error);
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
          <div className="flex items-center">
            <div className="bg-amber-500 text-white p-2 rounded-md mr-3">
              <span className="font-bold">BB</span>
            </div>
            <h1 className="text-xl font-bold">Dashboard: {company?.name}</h1>
          </div>
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
            <TabsTrigger value="specialists">Especialistas</TabsTrigger>
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
          
          <TabsContent value="specialists">
            {company && <SpecialistManagement companyId={company.id} />}
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
