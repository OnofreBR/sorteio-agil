import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LotteryCard from '@/components/LotteryCard';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, Clock, Star, Loader2 } from 'lucide-react';
import { getAllLatestResults, formatCurrency } from '@/services/lotteryApi';
import { LOTTERY_MAP } from '@/types/lottery';
import { toast } from 'sonner';
const Index = () => {
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const {
    data: results,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['all-lotteries'],
    queryFn: getAllLatestResults,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    retry: 2
  });
  useEffect(() => {
    const now = new Date();
    setLastUpdate(now.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
  }, [results]);
  const handleRefresh = async () => {
    toast.info('Atualizando resultados...');
    await refetch();
    toast.success('Resultados atualizados!');
  };
  const lotteries = results?.map(result => {
    const lotteryInfo = LOTTERY_MAP[result.loteria];
    return {
      name: lotteryInfo?.name || result.loteria,
      slug: result.loteria,
      color: lotteryInfo?.color || 'lottery-megasena',
      contest: result.concurso,
      date: result.data,
      numbers: result.dezenas || [],
      prize: formatCurrency(result.premiacoes?.[0]?.valorPremio || 0),
      winners: result.premiacoes?.[0]?.ganhadores || 0,
      nextContest: result.proximoConcurso,
      nextDate: result.dataProximoConcurso,
      estimatedPrize: formatCurrency(result.valorEstimadoProximoConcurso),
      mesSorte: result.mesSorte,
      trevos: result.trevos,
      observacao: result.observacao
    };
  }).filter(lottery => lottery.numbers.length > 0) || [];
  const pageTitle = 'Resultados das Loterias Brasileiras - Mega-Sena, Quina, Lotofácil e Mais';
  const pageDescription = 'Confira os resultados atualizados de todas as loterias brasileiras: Mega-Sena, Quina, Lotofácil, Lotomania, Dupla Sena, Federal e mais. Números sorteados, prêmios e ganhadores.';
  const canonicalUrl = typeof window !== 'undefined' ? window.location.origin + '/' : '/';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Números Mega Sena - Resultados das Loterias',
    description: pageDescription,
    url: canonicalUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${canonicalUrl}?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Números Mega Sena',
      url: canonicalUrl
    }
  };
  return <div className="min-h-screen bg-background">
      <SEOHead title={pageTitle} description={pageDescription} keywords="loterias, mega-sena, quina, lotofácil, resultados, números sorteados, prêmios, ganhadores" canonicalUrl={canonicalUrl} jsonLd={jsonLd} />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-4">
              <Star className="w-4 h-4 mr-2" />
              Resultados Oficiais
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Resultados das 
              <span className="block bg-gradient-gold bg-clip-text text-transparent">
                Loterias Brasileiras
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">Acompanhe os resultados mais recentes da Mega-Sena, Quina, Lotofácil e 
todas as principais loterias do Brasil em tempo real.
          </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Últimos Resultados
            </h2>
            <p className="text-muted-foreground">
              Confira os resultados mais recentes de todas as loterias
            </p>
          </div>
          
          <Button variant="outline" size="sm" className="hover:bg-muted transition-smooth" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Lottery Cards Grid */}
        {isLoading ? <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Carregando resultados...</p>
            </div>
          </div> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {lotteries.map(lottery => <LotteryCard key={lottery.slug} lottery={lottery} />)}
          </div>}

        {/* SEO Content */}
        <section className="mt-16 prose prose-lg max-w-none">
          <div className="bg-gradient-card rounded-xl p-8 shadow-card-custom">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Sobre os Resultados das Loterias Brasileiras
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
              <div className="space-y-4">
                <p>Acompanhe informações atualizadas sobre Mega-Sena, Quina, Lotofácil, Lotomania, Dupla Sena, Dia de Sorte, Timemania, Super Sete, Mais Milionária e  Loteria Federal.</p>
                <p>
                  Todos os resultados são obtidos diretamente da Caixa Econômica Federal 
                  e apresentados de forma clara e organizada para sua consulta.
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  Além dos números sorteados, você encontra informações sobre prêmios, 
                  quantidade de ganhadores e estimativas para os próximos concursos.
                </p>
                <p>Lembre-se sempre de jogar com responsabilidade.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Index;