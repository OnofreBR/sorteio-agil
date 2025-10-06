import { GetServerSideProps } from 'next'
import SEOHead from '@/components/SEOHead'
import CardResultadoLoteria from '@/components/CardResultadoLoteria'
import { getAllLotteryResults } from '@/services/lotteryApi'
import { LotteryResult } from '@/types/lottery'
import { useState } from 'react'

interface HomeProps {
  resultados: LotteryResult[]
}

export default function Home({ resultados }: HomeProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = async () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  return (
    <>
      <SEOHead
        title="Resultados das Loterias Brasileiras - Números Mega Sena"
        description="Acompanhe os resultados mais recentes da Mega-Sena, Quina, Lotofácil e todas as principais loterias do Brasil em tempo real."
        canonical="https://numerosmegasena.com.br/"
        ogImage="/logo.png"
        keywords="mega sena, quina, lotofácil, lotomania, dupla sena, timemania, dia de sorte, super sete, mais milionária, resultados, loterias"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resultados.map((resultado) => (
              <CardResultadoLoteria key={resultado.loteria + '-' + resultado.concurso} resultado={resultado} />
            ))}
          </div>
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

      {/* JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Números Mega Sena',
            url: 'https://numerosmegasena.com.br/',
            description: 'Resultados das principais loterias brasileiras, atualizados em tempo real.',
            publisher: {
              '@type': 'Organization',
              name: 'Números Mega Sena',
            },
          }),
        }}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const resultados = await getAllLotteryResults()
    return {
      props: {
        resultados: Array.isArray(resultados) ? resultados : [],
      },
    }
  } catch (error) {
    console.error('Error fetching lottery results:', error)
    return {
      props: {
        resultados: [],
      },
    }
  }
}
