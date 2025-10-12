import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LotteryCard from '@/components/LotteryCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, Clock, Star } from 'lucide-react';

const Index = () => {
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // Set last update time
    const now = new Date();
    setLastUpdate(now.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }));
  }, []);

  // Mock data - in a real app, this would come from an API
  const lotteries = [
    {
      name: 'Mega-Sena',
      slug: 'megasena',
      color: 'lottery-megasena',
      contest: 2647,
      date: '28/09/2025',
      numbers: [12, 18, 25, 33, 41, 52],
      prize: 'R$ 45.000.000,00',
      winners: 0,
      nextContest: 2648,
      nextDate: '01/10/2025',
      estimatedPrize: 'R$ 55.000.000,00',
    },
    {
      name: 'Quina',
      slug: 'quina',
      color: 'lottery-quina',
      contest: 6234,
      date: '29/09/2025',
      numbers: [8, 15, 27, 44, 76],
      prize: 'R$ 2.800.000,00',
      winners: 1,
      nextContest: 6235,
      nextDate: '30/09/2025',
      estimatedPrize: 'R$ 700.000,00',
    },
    {
      name: 'Lotofácil',
      slug: 'lotofacil',
      color: 'lottery-lotofacil',
      contest: 2875,
      date: '29/09/2025',
      numbers: [2, 3, 5, 7, 8, 11, 13, 14, 16, 18, 19, 21, 22, 23, 25],
      prize: 'R$ 1.500.000,00',
      winners: 3,
      nextContest: 2876,
      nextDate: '30/09/2025',
      estimatedPrize: 'R$ 1.700.000,00',
    },
    {
      name: 'Lotomania',
      slug: 'lotomania',
      color: 'lottery-lotomania',
      contest: 2534,
      date: '27/09/2025',
      numbers: [5, 12, 18, 23, 28, 34, 41, 47, 52, 58, 63, 69, 74, 81, 87, 92, 95, 97, 98, 99],
      prize: 'R$ 850.000,00',
      winners: 0,
      nextContest: 2535,
      nextDate: '01/10/2025',
      estimatedPrize: 'R$ 1.200.000,00',
    },
    {
      name: 'Dupla Sena',
      slug: 'duplasena',
      color: 'lottery-dupla',
      contest: 2487,
      date: '28/09/2025',
      numbers: [7, 14, 21, 28, 35, 42],
      prize: 'R$ 950.000,00',
      winners: 2,
      nextContest: 2488,
      nextDate: '01/10/2025',
      estimatedPrize: 'R$ 600.000,00',
    },
    {
      name: 'Federal',
      slug: 'federal',
      color: 'lottery-federal',
      contest: 5712,
      date: '28/09/2025',
      numbers: [12345],
      prize: 'R$ 500.000,00',
      winners: 1,
      nextContest: 5713,
      nextDate: '05/10/2025',
      estimatedPrize: 'R$ 500.000,00',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* SEO-optimized head would go here in a real app */}
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
            <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed">
              Acompanhe os resultados mais recentes da Mega-Sena, Quina, Lotofácil e todas as 
              principais loterias do Brasil em tempo real.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                variant="gold"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Ver Todos os Resultados
              </Button>
              <div className="flex items-center text-primary-foreground/80 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                Última atualização: {lastUpdate}
              </div>
            </div>
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
          
          <Button 
            variant="outline" 
            size="sm"
            className="hover:bg-muted transition-smooth"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Lottery Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lotteries.map((lottery) => (
            <LotteryCard key={lottery.slug} lottery={lottery} />
          ))}
        </div>

        {/* SEO Content */}
        <section className="mt-16 prose prose-lg max-w-none">
          <div className="bg-gradient-card rounded-xl p-8 shadow-card-custom">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Sobre os Resultados das Loterias Brasileiras
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
              <div className="space-y-4">
                <p>
                  Acompanhe os resultados oficiais das principais loterias do Brasil. 
                  Nosso site oferece informações atualizadas sobre Mega-Sena, Quina, 
                  Lotofácil, Lotomania, Dupla Sena e Federal.
                </p>
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
                <p>
                  Lembre-se sempre de jogar com responsabilidade e consultar os 
                  resultados oficiais na Caixa Econômica Federal.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;