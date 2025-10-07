import { GetStaticProps } from 'next'

import { getLatestForAll, LOTTERY_SLUGS } from '@/src/lib/api/results'
import { LotteryResult } from '@/src/types/lottery'

export interface HomeProps {
  resultados: LotteryResult[]
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const resultados = await getLatestForAll()

    const ordered = LOTTERY_SLUGS.map((slug) => resultados.find((item) => item.lotterySlug === slug)).filter(
      (item): item is LotteryResult => Boolean(item)
    )

    return {
      props: {
        resultados: ordered,
      },
      revalidate: 600,
    }
  } catch (error) {
    console.error('Error fetching lottery results:', error)
    return {
      props: {
        resultados: [],
      },
      revalidate: 300,
    }
  }
}

export { LOTTERY_SLUGS }
