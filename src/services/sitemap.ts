import { LOTTERY_MAP } from '@/types/lottery';

const SITE_URL = 'https://numerosmegasena.netlify.app';

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

  // Individual lottery pages
  Object.keys(LOTTERY_MAP).forEach((lotterySlug) => {
    urls.push({
      loc: `${SITE_URL}/${lotterySlug}`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.9,
    });

    // Generate URLs for last 100 contests of each lottery
    // This is a simplified version - in production you'd get actual contest numbers
    for (let i = 0; i < 100; i++) {
      const contestNumber = 2750 - i; // Example: starting from contest 2750
      urls.push({
        loc: `${SITE_URL}/${lotterySlug}/concurso-${contestNumber}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.7,
      });
    }
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
