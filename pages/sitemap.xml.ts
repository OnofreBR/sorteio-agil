import type { GetServerSideProps } from 'next';
import { buildUrl } from '@/src/lib/config/site';
import { getLatestForAll, LOTTERY_SLUGS } from '@/src/lib/api/results';
import { toISODate } from '@/utils/formatters';

const buildUrlEntry = (loc: string, changefreq: string, priority: string, lastmod?: string) => `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${toISODate(lastmod)}</lastmod>
  </url>`;

const generateSitemap = async () => {
  const siteUrl = buildUrl('/').replace(/\/$/, '');
  const staticEntries = [
    buildUrlEntry(`${siteUrl}/`, 'hourly', '1.0'),
    buildUrlEntry(`${siteUrl}/sobre`, 'monthly', '0.4'),
    buildUrlEntry(`${siteUrl}/termos`, 'yearly', '0.2'),
    buildUrlEntry(`${siteUrl}/privacidade`, 'yearly', '0.2'),
  ];

  try {
    const latestResults = await getLatestForAll();

    const lotteryEntries = latestResults.flatMap((result) => {
      const entries: string[] = [];
      entries.push(
        buildUrlEntry(
          `${siteUrl}/loterias/${result.lotterySlug}`,
          'daily',
          '0.8',
          result.contestDate,
        ),
      );

      entries.push(
        buildUrlEntry(
          `${siteUrl}/${result.lotterySlug}/concurso-${result.contestNumber}`,
          'daily',
          '0.9',
          result.contestDate,
        ),
      );

      // Adiciona até dois concursos anteriores como estimativa (caso existam)
      for (let offset = 1; offset <= 2; offset += 1) {
        const contest = result.contestNumber - offset;
        if (contest > 0) {
          entries.push(
            buildUrlEntry(
              `${siteUrl}/${result.lotterySlug}/concurso-${contest}`,
              'monthly',
              '0.6',
              undefined,
            ),
          );
        }
      }

      return entries;
    });

    const missingLotteries = LOTTERY_SLUGS.filter(
      (slug) => !latestResults.some((result) => result.lotterySlug === slug),
    ).map((slug) => buildUrlEntry(`${siteUrl}/loterias/${slug}`, 'weekly', '0.5'));

    const allEntries = [...staticEntries, ...lotteryEntries, ...missingLotteries];

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.join('\n')}
</urlset>`;
  } catch (error) {
    console.error('[sitemap] Falha ao gerar sitemap:', error);
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
</urlset>`;
  }
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xml = await generateSitemap();
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
