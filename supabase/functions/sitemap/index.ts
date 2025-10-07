import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESULTS_API_URL = Deno.env.get('RESULTS_API_URL') || '';
const RESULTS_API_TOKEN = Deno.env.get('RESULTS_API_TOKEN') || '';

const LOTTERY_MAP: Record<string, { id: string; name: string }> = {
  'megasena': { id: 'mega-sena', name: 'Mega-Sena' },
  'lotofacil': { id: 'lotofacil', name: 'Lotofácil' },
  'quina': { id: 'quina', name: 'Quina' },
  'lotomania': { id: 'lotomania', name: 'Lotomania' },
  'timemania': { id: 'timemania', name: 'Timemania' },
  'duplasena': { id: 'duplasena', name: 'Dupla Sena' },
  'federal': { id: 'federal', name: 'Federal' },
  'diadesorte': { id: 'diadesorte', name: 'Dia de Sorte' },
  'supersete': { id: 'supersete', name: 'Super Sete' },
  'maismilionaria': { id: '+milionaria', name: '+Milionária' },
};

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

let cachedSitemap: string | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 3600000; // 1 hour

async function fetchLatestResults() {
  try {
    const results = await Promise.all(
      Object.keys(LOTTERY_MAP).map(async (lottery) => {
        const lotteryId = LOTTERY_MAP[lottery].id;
        const url = `${RESULTS_API_URL}/${lotteryId}/latest?token=${RESULTS_API_TOKEN}`;
        const response = await fetch(url);
        if (response.ok) {
          return await response.json();
        }
        return null;
      })
    );
    return results.filter(r => r !== null);
  } catch (error) {
    console.error('Error fetching latest results:', error);
    return [];
  }
}

function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

async function generateSitemap(siteUrl: string): Promise<string> {
  const now = Date.now();
  
  // Return cached sitemap if still valid
  if (cachedSitemap && (now - cacheTimestamp) < CACHE_TTL) {
    console.log('✅ Returning cached sitemap');
    return cachedSitemap;
  }

  console.log('🔄 Generating fresh sitemap...');
  
  const today = new Date().toISOString().split('T')[0];
  const urls: SitemapUrl[] = [];

  // Homepage
  urls.push({
    loc: siteUrl,
    lastmod: today,
    changefreq: 'daily',
    priority: 1.0,
  });

  // Static pages
  ['sobre', 'termos', 'privacidade'].forEach((page) => {
    urls.push({
      loc: `${siteUrl}/${page}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.3,
    });
  });

  // No dedicated lottery index pages (avoid 404s)

  // Latest contest results
  const results = await fetchLatestResults();
  results.forEach((result) => {
    const lottery = Object.keys(LOTTERY_MAP).find(
      (key) => LOTTERY_MAP[key].id === result.tipo
    );
    if (lottery && result.concurso) {
      // Current contest
      urls.push({
        loc: `${siteUrl}/${lottery}/${result.concurso}`,
        lastmod: today,
        changefreq: 'daily',
        priority: 0.9,
      });

      // Last 10 contests
      for (let i = 1; i <= 10; i++) {
        const contestNum = result.concurso - i;
        if (contestNum > 0) {
          urls.push({
            loc: `${siteUrl}/${lottery}/${contestNum}`,
            lastmod: today,
            changefreq: 'monthly',
            priority: 0.6,
          });
        }
      }

      // Next 5 future contests
      for (let i = 1; i <= 5; i++) {
        urls.push({
          loc: `${siteUrl}/${lottery}/${result.concurso + i}`,
          lastmod: today,
          changefreq: 'weekly',
          priority: 0.7,
        });
      }
    }
  });

  const sitemap = generateSitemapXml(urls);
  
  // Update cache
  cachedSitemap = sitemap;
  cacheTimestamp = now;
  
  console.log(`✅ Sitemap generated with ${urls.length} URLs`);
  
  return sitemap;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const siteUrl = `${url.protocol}//${url.host}`;
    
    const sitemap = await generateSitemap(siteUrl);

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
