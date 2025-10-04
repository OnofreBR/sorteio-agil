import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, Hash, Trophy, MapPin } from 'lucide-react';
import { getResultByContest, formatCurrency, formatDate } from '../../services/lotteryApi';
import { indexNewResult } from '../../services/indexing';
import { LotteryResult } from '../../types/lottery';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import SEOHead from '../../components/SEOHead';

interface ContestPageProps {
  result: LotteryResult | null;
  error?: string;
}

// Mapa de nomes amigáveis das loterias
const LOTTERY_NAMES: Record<string, string> = {
  megasena: 'Mega-Sena',
  quina: 'Quina',
  lotofacil: 'Lotofácil',
  lotomania: 'Lotomania',
  duplasena: 'Dupla Sena',
  federal: 'Federal',
  timemania: 'Timemania',
  diadesorte: 'Dia de Sorte',
  supersete: 'Super Sete',
  maismilionaria: '+Milionária',
  loteca: 'Loteca',
};

const ContestPage: NextPage<ContestPageProps> = ({ result, error }) => {
  const router = useRouter();
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-red-600">Erro ao Carregar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  const lotteryName = LOTTERY_NAMES[result.loteria] || result.loteria;
  const previousContest = result.concurso - 1;

  return (
    <>
      <SEOHead
        title={`Resultado ${lotteryName} Concurso ${result.concurso} - Números Sorteados`}
        description={`Resultado completo do concurso ${result.concurso} da ${lotteryName} realizado em ${result.data}. Confira os números sorteados, premiação completa e ganhadores.`}
        canonical={`https://numerosmegasena.com.br/${result.loteria}/${result.concurso}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header da Página */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/">
              <Button className="flex items-center gap-2" variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Home
              </Button>
            </Link>
            
            <Badge className="text-lg px-4 py-2" variant="secondary">
              {lotteryName}
            </Badge>
          </div>

          {/* Card Principal do Concurso */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Hash className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-2xl">
                      Concurso {result.concurso}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {lotteryName}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {result.data}
                  </div>
                  {result.local && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="h-4 w-4" />
                      {result.local}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Status de Acumulação */}
              {result.acumulou && (
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
                  <p className="text-yellow-800 font-semibold text-center">
                    🎲 ACUMULOU!
                  </p>
                </div>
              )}

              {/* Números Sorteados */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Números Sorteados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.dezenas.map((number) => (
                    <Badge
                      key={number}
                      variant="default"
                      className="text-lg px-4 py-2 bg-blue-600 hover:bg-blue-700"
                    >
                      {String(number).padStart(2, '0')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Trevos (para +Milionária) */}
              {result.trevos && result.trevos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Trevos da Sorte</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.trevos.map((trevo) => (
                      <Badge
                        key={trevo}
                        variant="outline"
                        className="text-lg px-4 py-2 border-green-500 text-green-700"
                      >
                        🍀 {String(trevo).padStart(2, '0')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Mês da Sorte (para Dia de Sorte) */}
              {result.mesSorte && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Mês da Sorte</h3>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    📅 {result.mesSorte}
                  </Badge>
                </div>
              )}

              {/* Time do Coração (para Timemania) */}
              {result.observacao && result.loteria === 'timemania' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Time do Coração</h3>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    ⚽ {result.observacao}
                  </Badge>
                </div>
              )}

              {/* Premiação */}
              {result.premiacoes && result.premiacoes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Premiação
                  </h3>
                  <div className="space-y-2">
                    {result.premiacoes.map((premio, index) => (
                      <Card key={index} className={index === 0 ? 'bg-green-50 border-green-200' : ''}>
                        <CardContent className="py-3 px-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{premio.descricao}</p>
                              <p className="text-sm text-gray-600">
                                {premio.ganhadores} {premio.ganhadores === 1 ? 'ganhador' : 'ganhadores'}
                              </p>
                            </div>
                            <p className="text-lg font-bold text-green-700">
                              {formatCurrency(premio.valorPremio)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações do Próximo Concurso */}
              {result.proximoConcurso && result.valorEstimadoProximoConcurso && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Próximo Concurso</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Concurso:</span>
                      <span className="font-semibold">{result.proximoConcurso}</span>
                    </div>
                    {result.dataProximoConcurso && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Data:</span>
                        <span className="font-semibold">{result.dataProximoConcurso}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prêmio Estimado:</span>
                      <span className="font-bold text-blue-700">
                        {formatCurrency(result.valorEstimadoProximoConcurso)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Botão Concurso Anterior */}
          {previousContest > 0 && (
            <div className="flex justify-center">
              <Link href={`/${result.loteria}/${previousContest}`}>
                <Button size="lg" className="gap-2">
                  <ArrowLeft className="h-5 w-5" />
                  Ver Concurso Anterior ({previousContest})
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { lottery, contest } = context.params as { lottery: string; contest: string };

  try {
    // Extrair número do concurso da URL amigável (ex: "concurso-2750" -> 2750)
    const contestNumber = contest.includes('-') 
      ? parseInt(contest.split('-')[1]) 
      : parseInt(contest);

    if (isNaN(contestNumber)) {
      return { 
        props: { 
          error: `Número de concurso inválido: ${contest}` 
        } 
      };
    }

    // Buscar dados do concurso na API
    const result = await getResultByContest(lottery, contestNumber);

    // Indexar a página (IndexNow + Google Indexing)
    // Esta chamada é assíncrona mas não bloqueamos a resposta
    indexNewResult(lottery, contestNumber).catch(err => {
      console.error('Erro ao indexar:', err);
    });

    return {
      props: {
        result,
      },
    };
  } catch (error: any) {
    console.error('Server-side error:', error);
    return {
      props: { 
        error: error.message || 'Erro ao buscar dados do concurso.' 
      },
    };
  }
};

export default ContestPage;
