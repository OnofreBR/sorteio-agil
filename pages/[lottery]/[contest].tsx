import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head'; // Importação correta para Next.js
import { ArrowLeft, Calendar, DollarSign, Hash, Trophy } from 'lucide-react';

// Corrigir os caminhos de importação
import { supabase } from '../../integrations/supabase/client';
import { Contest } from '../../types/lottery'; // Ajuste para o tipo correto se necessário
import { Lottery } from '../../types/lottery';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { formatCurrency, formatDate } from '../../lib/utils';
import SEOHead from '../../components/SEOHead'; // Importar o componente SEOHead

interface ContestPageProps {
  contest: Contest | null;
  lottery: Lottery | null;
  error?: string;
}

const ContestPage: NextPage<ContestPageProps> = ({ contest, lottery, error }) => {
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

  if (!contest || !lottery) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            Carregando...
        </div>
    );
  }

  return (
    <>
      {/* IMPLEMENTAÇÃO CRÍTICA DO SEOHEAD */}
      <SEOHead
        title={`Resultado ${lottery.display_name} ${contest.contest_number} - Veja os Números!`}
        description={`Resultado do concurso ${contest.contest_number} da ${lottery.display_name} de ${formatDate(new Date(contest.draw_date))}. ✅ Clique para ver os números sorteados, a premiação e os ganhadores.`}
        canonical={`https://numerosmegasena.com.br/${lottery.name}/concurso/${contest.contest_number}`}
        lotteryName={lottery.display_name}
        contestNumber={contest.contest_number}
        drawDate={new Date(contest.draw_date).toISOString()}
        breadcrumbs={[
          { name: 'Início', url: '/' },
          { name: lottery.display_name, url: `/${lottery.name}` },
          { name: `Concurso ${contest.contest_number}`, url: `/${lottery.name}/concurso/${contest.contest_number}` }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header da Página */}
          <div className="flex items-center justify-between">
            <Link href={`/${lottery.name}`}>
              <Button className="flex items-center gap-2" variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Voltar para {lottery.display_name}
              </Button>
            </Link>
            <Badge className="text-lg px-4 py-2" variant="secondary">
              {lottery.display_name}
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
                      Concurso {contest.contest_number}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {lottery.display_name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {formatDate(new Date(contest.draw_date))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Números Sorteados */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Números Sorteados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {contest.drawn_numbers.map((number) => (
                    <Badge
                      key={number}
                      variant="default"
                      className="text-lg px-4 py-2"
                    >
                      {String(number).padStart(2, '0')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Informações de Prêmio */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      Total Arrecadado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-700">
                      {formatCurrency(contest.total_collected)}
                    </p>
                  </CardContent>
                </Card>

                {contest.next_contest_prize && (
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-green-600" />
                        Prêmio Próximo Concurso
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(contest.next_contest_prize)}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { lottery, contest } = context.params as { lottery: string; contest: string };

  try {
    const { data: lotteryData, error: lotteryError } = await supabase
      .from('lotteries')
      .select('*')
      .eq('name', lottery)
      .single();

    if (lotteryError || !lotteryData) {
      return { props: { error: `Loteria '${lottery}' não encontrada.` } };
    }

    const { data: contestData, error: contestError } = await supabase
      .from('contests')
      .select('*')
      .eq('lottery_id', lotteryData.id)
      .eq('contest_number', parseInt(contest))
      .single();

    if (contestError || !contestData) {
        return { props: { error: `Concurso ${contest} da ${lotteryData.display_name} não encontrado.` } };
    }

    return {
      props: {
        contest: contestData,
        lottery: lotteryData,
      },
    };
  } catch (error) {
    console.error('Server-side error:', error);
    return {
      props: { error: 'Ocorreu um erro no servidor ao buscar os dados.' },
    };
  }
};

export default ContestPage;
