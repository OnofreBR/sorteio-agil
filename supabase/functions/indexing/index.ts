import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const INDEXNOW_KEY = Deno.env.get('INDEXNOW_KEY');

interface IndexingRequest {
  urls: string[];
  type?: 'URL_UPDATED' | 'URL_DELETED';
}

interface GoogleCredentials {
  client_email: string;
  private_key: string;
}

// Load Google Service Account credentials
async function loadGoogleCredentials(): Promise<GoogleCredentials | null> {
  try {
    const credentialsPath = new URL('./google-credentials.json', import.meta.url).pathname;
    const credentialsText = await Deno.readTextFile(credentialsPath);
    const credentials = JSON.parse(credentialsText);
    return {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    };
  } catch (error) {
    console.error('❌ Failed to load Google credentials:', error);
    return null;
  }
}

// Generate JWT for Google API authentication
async function generateGoogleJWT(credentials: GoogleCredentials): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: getNumericDate(3600), // 1 hour
    iat: now,
  };

  // Import private key
  const privateKeyPem = credentials.private_key;
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = privateKeyPem.substring(
    pemHeader.length,
    privateKeyPem.length - pemFooter.length - 1
  ).replace(/\s/g, '');
  
  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const key = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  const jwt = await create({ alg: 'RS256', typ: 'JWT' }, payload, key);
  return jwt;
}

// Get OAuth2 access token from Google
async function getGoogleAccessToken(credentials: GoogleCredentials): Promise<string | null> {
  try {
    const jwt = await generateGoogleJWT(credentials);
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to get access token:', error);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting access token:', error);
    return null;
  }
}

async function submitToGoogleIndexing(
  url: string, 
  accessToken: string, 
  type: string = 'URL_UPDATED'
): Promise<boolean> {
  try {
    console.log(`🔄 Submitting to Google Indexing: ${url}`);
    
    const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
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

    if (response.ok || response.status === 202) {
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

    // Load Google credentials and get access token
    const credentials = await loadGoogleCredentials();
    let googleSuccessCount = 0;
    
    if (credentials) {
      const accessToken = await getGoogleAccessToken(credentials);
      
      if (accessToken) {
        const googleResults = await Promise.all(
          urls.map(url => submitToGoogleIndexing(url, accessToken, type))
        );
        googleSuccessCount = googleResults.filter(r => r).length;
      } else {
        console.error('❌ Failed to obtain Google access token');
      }
    } else {
      console.error('❌ Google credentials not available');
    }

    // Submit to IndexNow
    const indexNowResult = await submitToIndexNow(urls);

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
