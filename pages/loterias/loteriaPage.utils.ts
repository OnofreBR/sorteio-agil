import { GetServerSideProps } from 'next'

import { getContest, getLatestByLottery, LOTTERY_SLUGS } from '@/src/lib/api/results'
import { LotteryResult, LotterySlug } from '@/src/types/lottery'

export interface LotteryPageProps {
  lottery: LotteryResult | null
  history: LotteryResult[]
}

export const getServerSideProps: GetServerSideProps<LotteryPageProps> = async ({ params }) => {
  const slugParam = params?.loteriaSlug
  const slug = typeof slugParam === 'string' ? (slugParam.toLowerCase() as LotterySlug) : null

  if (!slug || !LOTTERY_SLUGS.includes(slug)) {
    return { notFound: true }
  }

  try {
    const lottery = await getLatestByLottery(slug)

    const history: LotteryResult[] = []
    for (let step = 1; step <= 3; step += 1) {
      const contest = lottery.contestNumber - step
      if (contest <= 0) break
      try {
        const data = await getContest(slug, contest)
        history.push(data)
      } catch (error) {
        console.error(`[${slug}] Erro ao buscar histórico do concurso ${contest}:`, error)
        break
      }
    }

    return {
      props: {
        lottery,
        history,
      },
    }
  } catch (error) {
    console.error(`[${slug}] Erro ao carregar a loteria:`, error)
    return {
      props: {
        lottery: null,
        history: [],
      },
    }
  }
}
