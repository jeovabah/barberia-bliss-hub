
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailData {
  clientName: string;
  clientEmail: string;
  service: string;
  date: string;
  time: string;
  specialistName: string;
  companyName?: string;
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const requestData = await req.json();
    const { 
      clientName, 
      clientEmail, 
      service, 
      date, 
      time, 
      specialistName,
      companyName 
    } = requestData as EmailData;

    if (!clientEmail) {
      return new Response(
        JSON.stringify({ error: 'Client email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Get email template
    const { data: templateData, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', 'appointment_confirmation')
      .single();

    if (templateError) {
      console.error('Error fetching email template:', templateError);
      return new Response(
        JSON.stringify({ error: 'Error fetching email template' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Replace placeholders in template
    let htmlContent = templateData.html_content;
    htmlContent = htmlContent.replace(/{{client_name}}/g, clientName);
    htmlContent = htmlContent.replace(/{{date}}/g, date);
    htmlContent = htmlContent.replace(/{{time}}/g, time);
    htmlContent = htmlContent.replace(/{{service}}/g, service);
    htmlContent = htmlContent.replace(/{{specialist_name}}/g, specialistName || 'Profissional selecionado');
    
    // Use Supabase REST API to send email (you'd typically use a service like Resend or SendGrid here)
    // For this implementation, we're just logging the email content
    console.log('SENDING EMAIL TO:', clientEmail);
    console.log('SUBJECT:', templateData.subject);
    console.log('CONTENT:', htmlContent);
    
    // In a real implementation, you would send the actual email here
    // Example with a hypothetical email service:
    // const emailResponse = await fetch('https://api.emailservice.com/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${EMAIL_API_KEY}` },
    //   body: JSON.stringify({
    //     to: clientEmail,
    //     from: 'agendamentos@barberbliss.com',
    //     subject: templateData.subject,
    //     html: htmlContent
    //   })
    // });

    return new Response(
      JSON.stringify({ success: true, message: 'Email would be sent in production' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error in send-appointment-email function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
