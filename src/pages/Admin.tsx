
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Trash2, Edit, LogOut, UserPlus } from "lucide-react";

const Admin = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // New company form state
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanySlug, setNewCompanySlug] = useState('');

  // New user form state
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserCompany, setNewUserCompany] = useState('');

  // Edit company form state
  const [editCompanyId, setEditCompanyId] = useState<string | null>(null);
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editCompanySlug, setEditCompanySlug] = useState('');

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
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
        navigate('/auth');
        return;
      }

      if (profileData.user_type !== 'admin') {
        navigate('/company-dashboard');
        return;
      }

      setProfile(profileData);
      fetchCompanies();
      fetchUsers();
    } catch (error) {
      console.error("Unexpected error:", error);
      navigate('/auth');
    }
  };

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true });

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

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          companies:company_id (id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleCreateCompany = async () => {
    if (!newCompanyName || !newCompanySlug) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name: newCompanyName, slug: newCompanySlug }])
        .select();

      if (error) {
        console.error("Error creating company:", error);
        toast({
          title: "Erro ao criar empresa",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Empresa criada",
          description: "A empresa foi criada com sucesso."
        });
        setNewCompanyName('');
        setNewCompanySlug('');
        fetchCompanies();
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast({
        title: "Erro inesperado",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditCompany = async () => {
    if (!editCompanyId || !editCompanyName || !editCompanySlug) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('companies')
        .update({ name: editCompanyName, slug: editCompanySlug })
        .eq('id', editCompanyId)
        .select();

      if (error) {
        console.error("Error updating company:", error);
        toast({
          title: "Erro ao atualizar empresa",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Empresa atualizada",
          description: "A empresa foi atualizada com sucesso."
        });
        setEditCompanyId(null);
        setEditCompanyName('');
        setEditCompanySlug('');
        fetchCompanies();
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast({
        title: "Erro inesperado",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting company:", error);
        toast({
          title: "Erro ao excluir empresa",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Empresa excluída",
          description: "A empresa foi excluída com sucesso."
        });
        fetchCompanies();
        fetchUsers(); // Refresh users as their company associations might have changed
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast({
        title: "Erro inesperado",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
      });

      if (authError) {
        console.error("Error creating user:", authError);
        toast({
          title: "Erro ao criar usuário",
          description: authError.message,
          variant: "destructive"
        });
        return;
      }

      if (!authData.user) {
        toast({
          title: "Erro ao criar usuário",
          description: "Não foi possível criar o usuário.",
          variant: "destructive"
        });
        return;
      }

      // Update the user profile with company association
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({ 
          company_id: newUserCompany || null,
          user_type: 'company' 
        })
        .eq('id', authData.user.id)
        .select();

      if (profileError) {
        console.error("Error updating user profile:", profileError);
        toast({
          title: "Erro ao atualizar perfil",
          description: profileError.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Usuário criado",
          description: "O usuário foi criado com sucesso."
        });
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserCompany('');
        fetchUsers();
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast({
        title: "Erro inesperado",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdateUserCompany = async (userId: string, companyId: string | null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ company_id: companyId })
        .eq('id', userId)
        .select();

      if (error) {
        console.error("Error updating user company:", error);
        toast({
          title: "Erro ao atualizar empresa do usuário",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Empresa atualizada",
          description: "A empresa do usuário foi atualizada com sucesso."
        });
        fetchUsers();
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast({
        title: "Erro inesperado",
        description: error.message,
        variant: "destructive"
      });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto"></div>
          <p>Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
          <Button variant="destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-6">
        <Tabs defaultValue="companies">
          <TabsList className="mb-8">
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Empresas</CardTitle>
                <CardDescription>
                  Crie, edite e gerencie as empresas na plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Empresa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Empresa</DialogTitle>
                        <DialogDescription>
                          Preencha os campos abaixo para criar uma nova empresa.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="company-name">Nome da Empresa</Label>
                          <Input
                            id="company-name"
                            value={newCompanyName}
                            onChange={(e) => setNewCompanyName(e.target.value)}
                            placeholder="Ex: Barbearia Silva"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="company-slug">
                            Slug (URL)
                            <span className="text-xs text-gray-500 ml-2">
                              Apenas letras minúsculas, números e hífens
                            </span>
                          </Label>
                          <Input
                            id="company-slug"
                            value={newCompanySlug}
                            onChange={(e) => setNewCompanySlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                            placeholder="Ex: barbearia-silva"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleCreateCompany}>Criar Empresa</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableCaption>Lista de empresas na plataforma</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Slug (URL)</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            Nenhuma empresa cadastrada. Clique em "Adicionar Nova Empresa" para começar.
                          </TableCell>
                        </TableRow>
                      ) : (
                        companies.map((company) => (
                          <TableRow key={company.id}>
                            <TableCell className="font-medium">{company.name}</TableCell>
                            <TableCell>{company.slug}</TableCell>
                            <TableCell>
                              {new Date(company.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditCompanyId(company.id);
                                        setEditCompanyName(company.name);
                                        setEditCompanySlug(company.slug);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Editar</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Editar Empresa</DialogTitle>
                                      <DialogDescription>
                                        Altere os dados da empresa conforme necessário.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-company-name">Nome da Empresa</Label>
                                        <Input
                                          id="edit-company-name"
                                          value={editCompanyName}
                                          onChange={(e) => setEditCompanyName(e.target.value)}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-company-slug">
                                          Slug (URL)
                                          <span className="text-xs text-gray-500 ml-2">
                                            Apenas letras minúsculas, números e hífens
                                          </span>
                                        </Label>
                                        <Input
                                          id="edit-company-slug"
                                          value={editCompanySlug}
                                          onChange={(e) => setEditCompanySlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button variant="outline">Cancelar</Button>
                                      </DialogClose>
                                      <Button onClick={handleEditCompany}>Salvar Alterações</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteCompany(company.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`/${company.slug}`, '_blank')}
                                >
                                  Ver Site
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Usuários</CardTitle>
                <CardDescription>
                  Adicione e gerencie os usuários da plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <UserPlus className="mr-2 h-4 w-4" /> Adicionar Novo Usuário
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                        <DialogDescription>
                          Crie um novo usuário e associe a uma empresa.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="user-email">Email</Label>
                          <Input
                            id="user-email"
                            type="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            placeholder="usuario@exemplo.com"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="user-password">Senha</Label>
                          <Input
                            id="user-password"
                            type="password"
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="user-company">Empresa (opcional)</Label>
                          <Select value={newUserCompany} onValueChange={setNewUserCompany}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma empresa" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Sem empresa</SelectItem>
                              {companies.map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleCreateUser}>Criar Usuário</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableCaption>Lista de usuários na plataforma</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            Nenhum usuário cadastrado. Clique em "Adicionar Novo Usuário" para começar.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {/* Display email - this would normally come from auth.users but we don't have access here */}
                              {user.id}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.user_type === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.user_type === 'admin' ? 'Administrador' : 'Empresa'}
                              </span>
                            </TableCell>
                            <TableCell>
                              {user.companies ? user.companies.name : 'Sem empresa'}
                            </TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Alterar empresa</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Alterar Empresa do Usuário</DialogTitle>
                                      <DialogDescription>
                                        Associe este usuário a uma empresa diferente.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4">
                                      <Label htmlFor="user-company-change">Empresa</Label>
                                      <Select 
                                        defaultValue={user.company_id || ''} 
                                        onValueChange={(value) => handleUpdateUserCompany(user.id, value || null)}
                                      >
                                        <SelectTrigger className="mt-2">
                                          <SelectValue placeholder="Selecione uma empresa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="">Sem empresa</SelectItem>
                                          {companies.map((company) => (
                                            <SelectItem key={company.id} value={company.id}>
                                              {company.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button>Fechar</Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
