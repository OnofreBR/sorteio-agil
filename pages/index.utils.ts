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

export const handlePageRefresh = (setIsRefreshing: (value: boolean) => void) => {
  return () => {
    setIsRefreshing(true)
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }
}

export const CardSkeleton = ({ lotterySlug }: { lotterySlug: string }) => (
  <article className="flex h-full flex-col rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
    <header className="mb-4">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-2 h-6 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-1 h-4 w-32 animate-pulse rounded bg-muted" />
    </header>
    <section className="space-y-4">
      <div className="space-y-2">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        <ul className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={`${lotterySlug}-${index}`} className="h-12 w-12 animate-pulse rounded-full bg-muted" />
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="h-16 animate-pulse rounded-xl bg-muted" />
        <div className="h-16 animate-pulse rounded-xl bg-muted" />
      </div>
      <div className="h-20 animate-pulse rounded-xl bg-muted" />
    </section>
    <footer className="mt-auto pt-6">
      <div className="h-12 animate-pulse rounded-lg bg-muted" />
    </footer>
  </article>
)
