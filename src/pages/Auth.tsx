import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        redirectBasedOnUserRole(data.session.user);
      }
    };
    
    checkUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          redirectBasedOnUserRole(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const redirectBasedOnUserRole = async (user: any) => {
    try {
      // Special case for system admin
      if (user.email === 'admin@barberbliss.com') {
        navigate('/admin');
        return;
      }

      // For non-admin users, check their profile and company association
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company_id, user_type')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast({
          title: "Erro ao verificar perfil",
          description: "Não foi possível verificar suas permissões.",
          variant: "destructive"
        });
        return;
      }

      // Admin goes to admin dashboard
      if (profile?.user_type === 'admin') {
        navigate('/admin');
        return;
      }

      // Company user goes to their company page or dashboard
      if (profile?.company_id) {
        // Company users go to company dashboard
        navigate('/company-dashboard');
        return;
      }
      
      // Default fallback - if no company assigned
      toast({
        title: "Sem empresa associada",
        description: "Sua conta não está associada a nenhuma empresa. Entre em contato com o administrador.",
        variant: "destructive"
      });
      navigate('/auth');
    } catch (error) {
      console.error("Error in redirect:", error);
      toast({
        title: "Erro ao redirecionar",
        description: "Ocorreu um erro ao verificar suas permissões.",
        variant: "destructive"
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro ao entrar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login bem-sucedido",
          description: "Você foi autenticado com sucesso.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            email_confirmed: true
          }
        }
      });

      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Conta criada com sucesso",
          description: "Sua conta foi criada e você está logado.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if admin exists in login page to provide default credentials
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        // You can either check for admin in auth.users or in profiles with user_type='admin'
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_type', 'admin')
          .single();

        if (error) {
          console.log("Admin check error:", error.message);
        }
      } catch (error) {
        console.error("Error checking admin:", error);
      }
    };

    checkAdminExists();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">BarberBliss Platform</CardTitle>
          <CardDescription className="text-center">
            Entre ou crie uma conta para acessar a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="exemplo@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signin-password">Senha</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700">
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="exemplo@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700">
                    {loading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-4 pt-4 border-t text-center text-sm">
            <p>Acesso administrativo:<br/>Email: admin@barberbliss.com<br/>Senha: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
