import { GetServerSideProps } from 'next';
import SEOHead from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CardResultadoLoteria from '@/components/CardResultadoLoteria';
import { getAllLotteryResults } from '@/services/lotteryApi';
import { LotteryResult } from '@/types/lottery';
import { useState } from 'react';

interface HomeProps {
  resultados: LotteryResult[];
}

export default function Home({ resultados }: HomeProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  return (
    <>
      <SEOHead
        title="Resultados das Loterias Brasileiras - Números Mega Sena"
        description="Acompanhe os resultados mais recentes da Mega-Sena, Quina, Lotofácil e todas as principais loterias do Brasil em tempo real."
        canonical="https://numerosmegasena.com.br/"
        ogImage="/logo.png"
        keywords="mega sena, quina, lotofácil, lotomania, dupla sena, timemania, dia de sorte, super sete, mais milionária, resultados, loterias"
      />
      
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-3 text-sm font-semibold tracking-wider uppercase text-blue-200">
              Resultados Oficiais
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Resultados das<br className="md:hidden"/>
              <span className="md:inline"> </span>Loterias Brasileiras
            </h1>
            <p className="text-lg md:text-xl text-blue-50 max-w-3xl mx-auto leading-relaxed">
              Acompanhe os resultados mais recentes da Mega-Sena, Quina, Lotofácil e todas as principais loterias do Brasil em tempo real.
            </p>
          </div>
        </section>

        {/* Results Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                Últimos Resultados
              </h2>
              <p className="text-gray-600 text-base">
                Confira os resultados mais recentes de todas as loterias
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isRefreshing ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Atualizando...
                </>
              ) : (
                'Atualizar'
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resultados.map((resultado) => (
              <CardResultadoLoteria
                key={resultado.loteria}
                resultado={resultado}
              />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white py-16 mt-12 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
              Sobre os Resultados das Loterias Brasileiras
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
              Acompanhe informações atualizadas sobre Mega-Sena, Quina, Lotofácil, Lotomania, Dupla Sena,{' '}
              Dia de Sorte, Timemania, Super Sete, Mais Milionária e  Loteria Federal.
              Todos os resultados são obtidos diretamente da Caixa Econômica Federal.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
      
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
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const resultados = await getAllLotteryResults();
    
    return {
      props: {
        resultados: Array.isArray(resultados) ? resultados : [],
      },
    };
  } catch (error) {
    console.error('Error fetching lottery results:', error);
    return {
      props: {
        resultados: [],
      },
    };
  }
};
