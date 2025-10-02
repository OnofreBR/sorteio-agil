import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getLatestResult, formatCurrency } from '@/services/lotteryApi';
import { LOTTERY_MAP } from '@/types/lottery';
import { Calendar, TrendingUp, Trophy, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function LotteryPage() {
  const { lottery = '' } = useParams<{ lottery: string }>();
  const navigate = useNavigate();
  
  const lotteryInfo = LOTTERY_MAP[lottery];

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['lottery', lottery, 'latest'],
    queryFn: () => getLatestResult(lottery),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    retry: 2,
    enabled: typeof window !== 'undefined',
  });

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar dados da loteria');
    }
  }, [error]);

  if (!lotteryInfo) {
    navigate('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pageTitle = `${lotteryInfo.name} - Resultados, Números e Prêmios Atualizados`;
  const pageDescription = `Confira todos os resultados da ${lotteryInfo.name}. ${lotteryInfo.description} Sorteios realizados ${lotteryInfo.drawDays.join(', ')}.`;
  const canonicalUrl = `/${lottery}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Início',
          item: '/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lotteryInfo.name,
          item: canonicalUrl,
        },
      ],
    },
    mainEntity: result ? {
      '@type': 'Event',
      name: `${lotteryInfo.name} - Concurso ${result.concurso}`,
      description: `Resultado do concurso ${result.concurso} da ${lotteryInfo.name}`,
      startDate: result.data,
      location: {
        '@type': 'Place',
        name: result.local,
      },
    } : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={`${lotteryInfo.name}, resultados, números, prêmios, ganhadores, sorteios`}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />
      
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Trophy className="w-4 h-4 mr-2" />
              Resultados Oficiais
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold">
              {lotteryInfo.name}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
              {lotteryInfo.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {lotteryInfo.drawDays.map((day, index) => (
                <Badge key={index} variant="outline" className="bg-white/10 text-white border-white/30">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Result */}
      {result && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-card border-primary/30 shadow-card-custom">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-2xl">Último Resultado</span>
                  <Badge variant="default">Concurso {result.concurso}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Numbers */}
                <div>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Números Sorteados - {result.data}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {result.dezenas.map((number, index) => (
                      <div
                        key={index}
                        className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold text-xl shadow-glow animate-bounce-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prize Info */}
                <div className="grid md:grid-cols-2 gap-6 pt-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Prêmio Principal</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(result.premiacoes?.[0]?.valorPremio || 0)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.premiacoes?.[0]?.ganhadores || 0} ganhador(es)
                    </p>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Próximo Concurso</p>
                    <p className="text-2xl font-bold text-foreground">
                      {result.proximoConcurso}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.dataProximoConcurso}
                    </p>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="text-center pt-4">
                  <Link to={`/${lottery}/concurso-${result.concurso}`}>
                    <Button size="lg" variant="gold" className="gap-2">
                      Ver Detalhes Completos
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Sobre a {lotteryInfo.name}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-muted-foreground">
                {lotteryInfo.description}
              </p>
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Dias de Sorteio
                  </h3>
                  <p className="text-muted-foreground">
                    {lotteryInfo.drawDays.join(', ')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Como Jogar
                  </h3>
                  <p className="text-muted-foreground">
                    Escolha {lotteryInfo.numbersDrawn} números entre {lotteryInfo.minNumber} e {lotteryInfo.maxNumber}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
