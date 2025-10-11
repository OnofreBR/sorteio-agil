import { ISitemapField, getServerSideSitemap } from 'next-sitemap';
import { lotteryApi } from './lotteryApi';
import { buildUrl } from '@/lib/config/site';
import { LOTTERY_SLUGS } from '@/types/lottery';

export const generateLotterySitemap = async (): Promise<string> => {
  const fields: ISitemapField[] = [];

  for (const slug of LOTTERY_SLUGS) {
    try {
      const response = await lotteryApi.getLatestByLottery(slug);
      if (response.data) {
        const contestNumber = response.data.concurso;
        fields.push({
          loc: buildUrl(`/loterias/${slug}`),
          lastmod: new Date().toISOString(),
        });
        fields.push({
          loc: buildUrl(`/loterias/${slug}/concurso-${contestNumber}`),
          lastmod: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error(`Erro ao gerar sitemap para ${slug}:`, error);
    }
  }

  return getServerSideSitemap(fields);
};
