import { useState } from 'react'
import SEOHead from '@/components/SEOHead'
import LotteryCard from '@/components/LotteryCard'
import { buildUrl } from '@/src/lib/config/site'
import {
  LOTTERY_SLUGS,
  CardSkeleton,
  handlePageRefresh,
} from './indexPage.utils'
import type { HomeProps } from './indexPage.utils'

export default function Home({ resultados }: HomeProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = handlePageRefresh(setIsRefreshing)

  const hasResults = resultados && resultados.length > 0

  return (
    <>
      <SEOHead
        title="Resultados das Loterias Brasileiras - Números Mega Sena"
        description="Acompanhe os resultados mais recentes da Mega-Sena, Quina, Lotofácil e todas as principais loterias do Brasil em tempo real."
        canonical={buildUrl('/')}
        url={buildUrl('/')}
        ogImage="/logo.png"
        keywords="mega sena, quina, lotofácil, lotomania, dupla sena, timemania, dia de sorte, super sete, mais milionária, resultados, loterias"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Números Mega Sena',
          url: buildUrl('/'),
          description:
            'Resultados das principais loterias brasileiras, atualizados em tempo real.',
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
            <div className="mb-4 text-sm font-bold tracking-widest uppercase text-blue-100">
              Resultados Oficiais
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
              Resultados das <br className="md:hidden" />
              <span className="md:inline"> </span>
              Loterias Brasileiras
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 max-w-4xl mx-auto leading-relaxed font-medium">
              Acompanhe os resultados mais recentes da Mega-Sena, Quina,
              Lotofácil e todas as principais loterias do Brasil em tempo real.
            </p>
          </div>
        </section>

        {/* Results Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                Últimos Resultados
              </h2>
              <p className="text-gray-600 text-lg font-medium">
                Confira os resultados mais recentes de todas as loterias
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              aria-label="Atualizar resultados"
            >
              <svg
                className={`w-6 h-6 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {hasResults
              ? resultados.map((resultado) => (
                  <LotteryCard
                    key={`${resultado.lotterySlug}-${resultado.contestNumber}`}
                    result={resultado}
                  />
                ))
              : LOTTERY_SLUGS.map((slug) => (
                  <CardSkeleton key={slug} />
                ))}
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
            <h2 className="text-4xl font-black text-gray-900 mb-8">
              Sobre os Resultados das Loterias Brasileiras
            </h2>
            <p className="text-gray-700 text-xl leading-relaxed max-w-5xl font-medium">
              Acompanhe informações atualizadas sobre Mega-Sena, Quina,
              Lotofácil, Lotomania, Dupla Sena, Dia de Sorte, Timemania, Super
              Sete, Mais Milionária e Loteria Federal. Todos os resultados são
              obtidos diretamente da Caixa Econômica Federal.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

export { getStaticProps } from './indexPage.utils'
