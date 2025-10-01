import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_INDEXING_API_KEY');
const INDEXNOW_KEY = Deno.env.get('INDEXNOW_KEY');

interface IndexingRequest {
  urls: string[];
  type?: 'URL_UPDATED' | 'URL_DELETED';
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

    if (response.ok) {
      console.log(`✅ Google Indexing: ${url}`);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ Google Indexing error for ${url}:`, errorData);
      return false;
    }
  } catch (error) {
    console.error(`❌ Google Indexing exception for ${url}:`, error);
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

    if (response.ok) {
      console.log(`✅ IndexNow: ${urls.length} URLs submitted`);
      return true;
    } else {
      console.error(`❌ IndexNow error:`, await response.text());
      return false;
    }
  } catch (error) {
    console.error(`❌ IndexNow exception:`, error);
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
