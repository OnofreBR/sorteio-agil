import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import AdSenseAd from '@/components/AdSenseAd';
import ContestDetails from '@/components/ContestDetails';
import ContestNavigation from '@/components/ContestNavigation';
import { getResultByContest, formatCurrency } from '@/services/lotteryApi';
import { LOTTERY_MAP } from '@/types/lottery';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContestPage() {
  const params = useParams();
  const navigate = useNavigate();
  
  // Normalize slug: mega-sena → megasena, +milionaria → maismilionaria
  const rawLottery = params.lottery || '';
  const lottery = rawLottery.toLowerCase().replace(/-/g, '').replace(/\+/g, 'mais');
  const contestNumber = parseInt(params.contest || '0');

  const lotteryInfo = LOTTERY_MAP[lottery];

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['lottery', lottery, contestNumber],
    queryFn: () => getResultByContest(lottery, contestNumber),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    retry: 2,
  });

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar resultado do concurso');
    }
  }, [error]);

  if (!lotteryInfo) {
    console.warn(`⚠️ Lottery not found in map: ${lottery}`);
    navigate('/');
    return null;
  }

  if (!contestNumber || contestNumber < 1) {
    console.warn(`⚠️ Invalid contest number: ${contestNumber}, redirecting to /${lottery}`);
    navigate(`/${lottery}`);
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Carregando resultado...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Resultado não encontrado</h1>
            <p className="text-muted-foreground">
              O concurso {contestNumber} da {lotteryInfo.name} não foi encontrado.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const pageTitle = `${lotteryInfo.name} Concurso ${contestNumber} - Resultado e Ganhadores`;
  const pageDescription = `Resultado completo do concurso ${contestNumber} da ${lotteryInfo.name}. Números sorteados: ${result.dezenas.join(', ')}. ${result.acumulou ? 'Acumulou!' : `${result.premiacoes?.[0]?.ganhadores || 0} ganhadores`}. Prêmio: ${formatCurrency(result.premiacoes?.[0]?.valorPremio || 0)}.`;
  const canonicalUrl = `${window.location.origin}/${rawLottery}/concurso-${contestNumber}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: pageTitle,
    description: pageDescription,
    image: `${window.location.origin}/logo.png`,
    datePublished: result.data,
    dateModified: result.data,
    wordCount: 500,
    articleSection: 'Resultados de Loterias',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.contest-numbers', '.prize-info'],
    },
    author: {
      '@type': 'Organization',
      name: 'Números Mega Sena',
      url: window.location.origin,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Números Mega Sena',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.png`,
        width: 512,
        height: 512,
      },
      url: window.location.origin,
    },
    mainEntity: {
      '@type': 'Event',
      name: `${lotteryInfo.name} - Concurso ${contestNumber}`,
      description: pageDescription,
      startDate: result.data,
      location: {
        '@type': 'Place',
        name: result.local,
      },
      offers: result.premiacoes?.map(prize => ({
        '@type': 'Offer',
        name: prize.descricao,
        price: prize.valorPremio,
        priceCurrency: 'BRL',
      })) || [],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Início',
          item: window.location.origin,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lotteryInfo.name,
          item: `${window.location.origin}/${rawLottery}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `Concurso ${contestNumber}`,
          item: canonicalUrl,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={`${lotteryInfo.name}, concurso ${contestNumber}, resultado, números sorteados, ganhadores, prêmio`}
        canonicalUrl={canonicalUrl}
        jsonLd={jsonLd}
      />
      
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              {lotteryInfo.name}
              <span className="block text-3xl md:text-4xl mt-2">
                Concurso {contestNumber}
              </span>
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Resultado completo do sorteio realizado em {result.data}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Ad Space - Top */}
        <div className="mb-8">
          <AdSenseAd format="auto" responsive={true} className="text-center" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Detalhes do Concurso */}
          <div className="lg:col-span-2">
            <ContestDetails result={result} lotteryColor={lotteryInfo.color} />
            
            {/* Ad Space - After Details */}
            <div className="mt-8">
              <AdSenseAd format="auto" responsive={true} className="text-center" />
            </div>
          </div>

          {/* Navegação e Próximo Concurso */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              <ContestNavigation
                lottery={lottery}
                currentContest={contestNumber}
                nextContest={result.proximoConcurso}
                nextDate={result.dataProximoConcurso}
                estimatedPrize={result.valorEstimadoProximoConcurso}
              />
              
              {/* Ad Space - Sidebar */}
              <AdSenseAd format="vertical" responsive={true} className="text-center" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
