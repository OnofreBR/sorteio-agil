import { GetStaticProps } from 'next'
import { useState } from 'react'
import SEOHead from '@/components/SEOHead'
import LotteryCard from '@/components/LotteryCard'
import { getLatestForAll, LOTTERY_SLUGS } from '@/src/lib/api/results'
import { LotteryResult } from '@/src/types/lottery'

interface HomeProps {
  resultados: LotteryResult[]
}

export default function Home({ resultados }: HomeProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = async () => {
    setIsRefreshing(true)
    if (typeof window !== 'undefined') window.location.reload()
  }

  const hasResults = resultados && resultados.length > 0

  return (
    <>
      <SEOHead
        title="Resultados das Loterias Brasileiras - Números Mega Sena"
        description="Acompanhe os resultados mais recentes da Mega-Sena, Quina, Lotofácil e todas as principais loterias do Brasil em tempo real."
        canonical={(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://sorteioagil.com.br').replace(/\/$/, '/')}
        url={(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://sorteioagil.com.br').replace(/\/$/, '/')}
        ogImage="/logo.png"
        keywords="mega sena, quina, lotofácil, lotomania, dupla sena, timemania, dia de sorte, super sete, mais milionária, resultados, loterias"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Números Mega Sena',
          url: (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://sorteioagil.com.br').replace(/\/$/, '/'),
          description: 'Resultados das principais loterias brasileiras, atualizados em tempo real.',
          publisher: {
            '@type': 'Organization',
            name: 'Números Mega Sena',
          },
        }}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-24">
          <div className="container mx-auto px-6 text-center">
            <div className="mb-4 text-sm font-bold tracking-widest uppercase text-blue-100">Resultados Oficiais</div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              Resultados das <br className="md:hidden" />
              <span className="md:inline"> </span>Loterias Brasileiras
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 max-w-4xl mx-auto leading-relaxed font-medium">
              Acompanhe os resultados mais recentes da Mega-Sena, Quina, Lotofácil e todas as principais loterias do Brasil em tempo real.
            </p>
          </div>
        </section>

        {/* Results Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Últimos Resultados</h2>
              <p className="text-gray-600 text-lg font-medium">Confira os resultados mais recentes de todas as loterias</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0"
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Atualizando...
                </>
              ) : (
                'Atualizar Resultados'
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {hasResults
              ? resultados.map((resultado) => (
                  <LotteryCard key={`${resultado.lotterySlug}-${resultado.contestNumber}`} result={resultado} />
                ))
              : LOTTERY_SLUGS.map((slug) => <CardSkeleton key={slug} lotterySlug={slug} />)}
          </div>
          {!hasResults ? (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Sem dados no momento. Tente novamente em instantes.
            </p>
          ) : null}
        </section>

        {/* About Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20 mt-16 border-t-2 border-gray-200">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-black text-gray-900 mb-8">Sobre os Resultados das Loterias Brasileiras</h2>
            <p className="text-gray-700 text-xl leading-relaxed max-w-5xl font-medium">
              Acompanhe informações atualizadas sobre Mega-Sena, Quina, Lotofácil, Lotomania, Dupla Sena, Dia de Sorte, Timemania, Super Sete, Mais Milionária e Loteria Federal.
              Todos os resultados são obtidos diretamente da Caixa Econômica Federal.
            </p>
          </div>
        </section>
      </main>

    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
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

interface CardSkeletonProps {
  lotterySlug: string
}

const CardSkeleton = ({ lotterySlug }: CardSkeletonProps) => (
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
            <li key={index} className="h-12 w-12 animate-pulse rounded-full bg-muted" />
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
