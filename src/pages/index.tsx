import { useState } from 'react'
import { GetStaticProps } from 'next'
import LotteryCard from '@/components/LotteryCard'
import { Button } from '@/components/ui/button'
import { lotteryApi } from '@/services/lotteryApi'
import {
  LOTTERY_SLUGS,
  CardSkeleton,
  handlePageRefresh,
} from './index.utils'
import type { HomeProps } from './index.utils'

export default function Home({ resultados }: HomeProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = handlePageRefresh(setIsRefreshing)

  const hasResults = resultados && resultados.length > 0

  return (
    <main
      className={`container mx-auto flex min-h-screen flex-col items-center p-4`}
    >
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Resultados das Loterias</h1>
        <p className="mt-2 text-center text-gray-600">
          Confira os últimos resultados das loterias da Caixa Econômica Federal
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {LOTTERY_SLUGS.map(slug => (
            <Button key={slug} variant="outline">
              {slug}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col items-center justify-center">
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? 'Atualizando...' : 'Atualizar resultados'}
        </Button>
        <div className="mt-4 w-full">
          {isRefreshing && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: LOTTERY_SLUGS.length }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 w-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hasResults && !isRefreshing
              ? resultados.map(resultado => (
                  <LotteryCard
                    key={`${resultado.loteria}-${resultado.concurso}`}
                    result={resultado}
                  />
                ))
              : null}
          </div>

          {!hasResults && !isRefreshing && (
            <div className="flex w-full flex-col items-center justify-center">
              <p className="text-center text-gray-600">
                Não foi possível carregar os resultados. Por favor, tente
                novamente mais tarde.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  let resultados: any[] = []

  try {
    const promises = LOTTERY_SLUGS.map(slug =>
      lotteryApi.getLatestByLottery(slug),
    )
    const results = await Promise.all(promises)
    resultados = results.map(result => result.data)
  } catch (error) {
    console.error(error)
  }

  return {
    props: {
      resultados,
    },
    revalidate: 60, // Revalidate every 60 seconds
  }
}
