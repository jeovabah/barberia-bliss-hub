
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) {
        toast({
          title: "Falha no login",
          description: error.message,
          variant: "destructive",
        });
        onLogin(false);
      } else if (data.user) {
        // Special case for admin@barberbliss.com - treat as admin immediately
        if (data.user.email === 'admin@barberbliss.com') {
          toast({
            title: "Login bem-sucedido",
            description: "Bem-vindo ao painel administrativo.",
          });
          onLogin(true);
          return;
        }
        
        // For non-admin@barberbliss.com users, check admin status through a direct DB query
        // This avoids the recursive RLS issue by calling a service specifically for this check
        const { data: functionData, error: functionError } = await supabase.rpc('is_admin', {
          user_id: data.user.id
        });
        
        console.log("Admin check result:", functionData);
        
        if (functionError) {
          console.error("Error checking admin status:", functionError);
          toast({
            title: "Erro ao verificar permissões",
            description: "Não foi possível verificar suas permissões de administrador.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          onLogin(false);
          return;
        }
        
        // Check if the user is an admin based on the function result
        if (!functionData) {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissões de administrador.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          onLogin(false);
          return;
        }
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo ao painel administrativo.",
        });
        onLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description: error.message || "Ocorreu um erro durante o login.",
        variant: "destructive",
      });
      onLogin(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Área Administrativa</CardTitle>
          <CardDescription className="text-center">
            Faça login para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                {isLoading ? "Autenticando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-xs text-muted-foreground text-center mt-2">
            Usando as credenciais padrão:<br />
            Email: admin@barberbliss.com<br />
            Senha: admin123
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
