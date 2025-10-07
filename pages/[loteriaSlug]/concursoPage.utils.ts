import { GetServerSideProps } from 'next'

import { getContest, getLatestByLottery, LOTTERY_SLUGS } from '@/src/lib/api/results'
import { LotteryResult, LotterySlug } from '@/src/types/lottery'

export interface ContestPageProps {
  result: LotteryResult | null
  previousContest?: number | null
  latestContest?: number | null
}

export const getServerSideProps: GetServerSideProps<ContestPageProps> = async ({ params }) => {
  const slugParam = params?.loteriaSlug
  const contestParam = params?.contestNumber

  const slug = typeof slugParam === 'string' ? (slugParam.toLowerCase() as LotterySlug) : null
  const contestNumber = typeof contestParam === 'string' ? Number(contestParam) : null

  if (!slug || !LOTTERY_SLUGS.includes(slug) || !contestNumber || Number.isNaN(contestNumber)) {
    return { notFound: true }
  }

  try {
    const result = await getContest(slug, contestNumber)
    let latestContest: number | null = null

    try {
      const latest = await getLatestByLottery(slug)
      latestContest = latest.contestNumber
    } catch (error) {
      console.error(`[${slug}] Erro ao obter concurso mais recente:`, error)
    }

    return {
      props: {
        result,
        previousContest: contestNumber > 1 ? contestNumber - 1 : null,
        latestContest,
      },
    }
  } catch (error) {
    console.error(`[${slug}] Erro ao obter concurso ${contestNumber}:`, error)
    return {
      props: {
        result: null,
        previousContest: null,
        latestContest: null,
      },
    }
  }
}
