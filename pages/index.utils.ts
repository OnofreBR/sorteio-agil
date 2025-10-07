import { GetStaticProps } from 'next'
import { getLatestForAll, LOTTERY_SLUGS } from '@/src/lib/api/results'
import { LotteryResult } from '@/src/types/lottery'

export interface HomeProps {
  resultados: LotteryResult[]
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const resultados = await getLatestForAll()
    const ordered = LOTTERY_SLUGS.map((slug) =>
      resultados.find((item) => item.lotterySlug === slug)
    ).filter(
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

// Utility function for handling page refresh
export const handlePageRefresh = (setIsRefreshing: (value: boolean) => void) => {
  return async () => {
    setIsRefreshing(true)
    if (typeof window !== 'undefined') window.location.reload()
  }
}

// CardSkeleton component
export const CardSkeleton = () => (
  <div className="rounded-2xl bg-card p-6 shadow-lg">
    <div className="mb-4 h-8 w-40 animate-pulse rounded-lg bg-muted" />
    <div className="mb-4 h-6 w-32 animate-pulse rounded-lg bg-muted" />
    <div className="mb-4 flex flex-wrap gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="h-12 w-12 animate-pulse rounded-full bg-muted" key={i} />
      ))}
    </div>
    <div className="space-y-2">
      <div className="h-5 w-full animate-pulse rounded-lg bg-muted" />
      <div className="h-5 w-3/4 animate-pulse rounded-lg bg-muted" />
    </div>
  </div>
)
