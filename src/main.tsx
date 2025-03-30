
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from '@/components/ui/sonner';
import { supabase } from "@/integrations/supabase/client";

// Export supabase to window for access from Puck components
declare global {
  interface Window {
    supabase: typeof supabase;
  }
}

window.supabase = supabase;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>,
);
