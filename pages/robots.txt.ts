import type { GetServerSideProps } from 'next';
import { buildUrl, getSiteUrl } from '@/src/lib/config/site';

const buildRobots = () => {
  const siteUrl = getSiteUrl();
  const indexNowKey = process.env.INDEXNOW_KEY;
  const sitemapUrl = buildUrl('/sitemap.xml');

  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /_next/',
    '',
    'User-agent: Googlebot',
    'Allow: /',
    'Crawl-delay: 1',
    '',
    'User-agent: Bingbot',
    'Allow: /',
    'Crawl-delay: 1',
    '',
    'User-agent: Twitterbot',
    'Allow: /',
    '',
    'User-agent: facebookexternalhit',
    'Allow: /',
    '',
    'User-agent: CCBot',
    'Disallow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
  ];

  if (indexNowKey) {
    lines.push(`IndexNow-Key-Location: ${buildUrl(`/${indexNowKey}.txt`)}`);
  }

  return lines.join('\n');
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robots = buildRobots();
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.write(robots);
  res.end();
  return { props: {} };
};

export default function RobotsTxt() {
  return null;
}

