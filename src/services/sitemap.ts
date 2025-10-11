import { ISitemapField, getServerSideSitemap } from 'next-sitemap';
import { lotteryApi } from './lotteryApi';
import { buildUrl } from '@/lib/config/site';
import { LOTTERY_SLUGS } from '@/types/lottery';

export const generateSitemap = async (): Promise<string> => {
  const fields: ISitemapField[] = [];

  for (const slug of LOTTERY_SLUGS) {
    try {
      // Add the lottery page itself
      fields.push({
        loc: buildUrl(`/loterias/${slug}`),
        lastmod: new Date().toISOString(),
      });

      // Add all contest pages for the lottery
      const contests = await lotteryApi.getAllContestsByLottery(slug);
      for (const contestNumber of contests) {
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
