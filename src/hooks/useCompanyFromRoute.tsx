
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Company {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export function useCompanyFromRoute() {
  const { slug } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompany = async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (!data) {
          throw new Error(`Empresa com o slug "${slug}" não encontrada.`);
        }
        
        setCompany(data);
      } catch (err) {
        console.error('Error fetching company:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch company'));
        
        toast({
          title: "Erro ao carregar empresa",
          description: err instanceof Error ? err.message : "Erro ao buscar dados da empresa",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [slug, toast]);

  return { company, isLoading, error };
}
