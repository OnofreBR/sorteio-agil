import { GetServerSideProps } from 'next';
import { generateLotterySitemap } from '@/services/futureContests';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = await generateLotterySitemap();

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

const SitemapPage = () => {};

export default SitemapPage;
