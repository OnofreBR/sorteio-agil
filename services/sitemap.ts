import { LOTTERY_MAP } from '@/types/lottery';
import { getAllFutureContests } from './futureContests';

// Prefer server-side environment configuration; never rely on window here
const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://sorteioagil.com.br').replace(/\/$/, '');

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateSitemapUrls(): SitemapUrl[] {
  const today = new Date().toISOString().split('T')[0];
  const urls: SitemapUrl[] = [];

  // Homepage
  urls.push({
    loc: `${SITE_URL}/`,
    lastmod: today,
    changefreq: 'hourly',
    priority: 1.0,
  });

  // Páginas estáticas
  const staticPages = [
    { path: '/sobre', changefreq: 'monthly' as const, priority: 0.5 },
    { path: '/termos', changefreq: 'yearly' as const, priority: 0.3 },
    { path: '/privacidade', changefreq: 'yearly' as const, priority: 0.3 },
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${SITE_URL}${page.path}`,
      lastmod: today,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  // Individual lottery pages (opcional - páginas de índice)
  Object.keys(LOTTERY_MAP).forEach((lotterySlug) => {
    // Últimos 100 concursos de cada loteria (rota canônica: /:lottery/:contest)
    for (let i = 0; i < 100; i++) {
      const contestNumber = 2750 - i;
      urls.push({
        loc: `${SITE_URL}/${lotterySlug}/${contestNumber}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.8,
      });
    }
  });

  // Adicionar concursos futuros (20 por loteria)
  const futureContests = getAllFutureContests();
  futureContests.forEach(({ lottery, contest }) => {
    urls.push({
      loc: `${SITE_URL}/${lottery}/${contest}`,
      lastmod: today,
      changefreq: 'daily', // Muda quando resultado sai
      priority: 0.7,
    });
  });

  return urls;
}

export function generateSitemapXml(): string {
  const urls = generateSitemapUrls();
  
  const urlElements = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;
}

/**
 * Gera sitemap index para múltiplos sitemaps (otimização para muitas URLs)
 */
export function generateSitemapIndex(): string {
  const today = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Sitemap principal
  xml += '  <sitemap>\n';
  xml += `    <loc>${SITE_URL}/sitemap.xml</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '  </sitemap>\n';

  // Sitemap por loteria (opcional para escala)
  Object.keys(LOTTERY_MAP).forEach(lottery => {
    xml += '  <sitemap>\n';
    xml += `    <loc>${SITE_URL}/sitemap-${lottery}.xml</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '  </sitemap>\n';
  });

  xml += '</sitemapindex>';
  return xml;
}

/**
 * Gera sitemap dinâmico baseado em resultados reais (uso futuro)
 */
export function generateDynamicSitemap(latestResults: any[] = []): string {
  const today = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Homepage
  xml += '  <url>\n';
  xml += `    <loc>${SITE_URL}/</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += '    <changefreq>hourly</changefreq>\n';
  xml += '    <priority>1.0</priority>\n';
  xml += '  </url>\n';

  // Últimos resultados com novo formato de URL
  if (latestResults && latestResults.length > 0) {
    latestResults.forEach(result => {
      const lottery = result.loteria.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
      xml += '  <url>\n';
      xml += `    <loc>${SITE_URL}/${lottery}/${result.concurso}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });
  }

  // Concursos futuros
  const futureContests = getAllFutureContests();
  futureContests.forEach(({ lottery, contest }) => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}/${lottery}/${contest}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
}
