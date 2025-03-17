
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    const fetchCompany = async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        setCompany(data);
      } catch (err) {
        console.error('Error fetching company:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch company'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [slug]);

  return { company, isLoading, error };
}
