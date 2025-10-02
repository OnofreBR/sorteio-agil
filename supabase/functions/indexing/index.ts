import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_INDEXING_API_KEY');
const INDEXNOW_KEY = Deno.env.get('INDEXNOW_KEY');

// Initialize Supabase client for logging
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface IndexingRequest {
  urls: string[];
  type?: 'URL_UPDATED' | 'URL_DELETED';
}

/**
 * Log indexing attempt to database
 */
async function logIndexing(
  url: string,
  service: 'google' | 'indexnow',
  status: 'success' | 'error',
  responseData?: any,
  errorMessage?: string
) {
  try {
    await supabase.from('indexing_logs').insert({
      url,
      service,
      status,
      response_data: responseData,
      error_message: errorMessage,
    });
  } catch (error) {
    console.error('Failed to log indexing:', error);
  }
}

async function submitToGoogleIndexing(url: string, type: string = 'URL_UPDATED'): Promise<boolean> {
  try {
    console.log(`🔄 Submitting to Google Indexing: ${url}`);
    
    const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GOOGLE_API_KEY}`,
      },
      body: JSON.stringify({ url, type }),
    });

    const responseData = await response.json().catch(() => ({}));

    if (response.ok) {
      console.log(`✅ Google Indexing: ${url}`);
      await logIndexing(url, 'google', 'success', responseData);
      return true;
    } else {
      console.error(`❌ Google Indexing error for ${url}:`, responseData);
      await logIndexing(url, 'google', 'error', responseData, responseData.error?.message);
      return false;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Google Indexing exception for ${url}:`, errorMessage);
    await logIndexing(url, 'google', 'error', null, errorMessage);
    return false;
  }
}

async function submitToIndexNow(urls: string[]): Promise<boolean> {
  try {
    console.log(`🔄 Submitting ${urls.length} URLs to IndexNow`);
    
    const host = new URL(urls[0]).hostname;
    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `https://${host}/indexnow-${INDEXNOW_KEY}.txt`,
      urlList: urls,
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      console.log(`✅ IndexNow: ${urls.length} URLs submitted`);
      await Promise.all(urls.map(url => logIndexing(url, 'indexnow', 'success')));
      return true;
    } else {
      const errorText = await response.text();
      console.error(`❌ IndexNow error:`, errorText);
      await Promise.all(urls.map(url => logIndexing(url, 'indexnow', 'error', null, errorText)));
      return false;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ IndexNow exception:`, errorMessage);
    await Promise.all(urls.map(url => logIndexing(url, 'indexnow', 'error', null, errorMessage)));
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { urls, type = 'URL_UPDATED' }: IndexingRequest = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'URLs array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📨 Received indexing request for ${urls.length} URLs`);

    // Submit to both services in parallel
    const [indexNowResult, googleResults] = await Promise.all([
      submitToIndexNow(urls),
      Promise.all(urls.map(url => submitToGoogleIndexing(url, type))),
    ]);

    const googleSuccessCount = googleResults.filter(r => r).length;

    const result = {
      success: true,
      indexNow: indexNowResult ? 'submitted' : 'failed',
      google: `${googleSuccessCount}/${urls.length} URLs indexed`,
      urls: urls.length,
    };

    console.log(`✅ Indexing complete:`, result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error in indexing function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});