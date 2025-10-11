import { GetServerSideProps } from 'next';
import { generateSitemap } from '@/services/sitemap';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = await generateSitemap();

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

const SitemapPage = () => {};

export default SitemapPage;
