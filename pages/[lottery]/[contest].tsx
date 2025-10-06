import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Calendar, DollarSign, Hash, Trophy, MapPin, Building2, Info, PieChart, Users } from 'lucide-react';
import { getResultByContest } from '../../services/lotteryApi';
import { indexNewResult } from '../../services/indexing';
import { LotteryResult } from '../../types/lottery';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import SEOHead from '../../components/SEOHead';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ContestPageProps {
  result: LotteryResult | null;
  error?: string;
}

// generic safe helper
const safe = <T,>(v: T | null | undefined, fallback: T): T => (v ?? fallback);

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

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold flex items-center gap-2">{icon}{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const KV: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-gray-900 text-right break-words">{value ?? '-'}</span>
  </div>
);

const List: React.FC<{ items?: Array<string | number> | null }> = ({ items }) => (
  <ul className="list-disc pl-5 space-y-1">
    {Array.isArray(items) && items.length > 0 ? (
      items.map((it, idx) => (
        <li className="text-sm text-gray-800" key={idx}>{String(it)}</li>
      ))
    ) : (
      <li className="text-sm text-gray-500">-</li>
    )}
  </ul>
);

const Pill: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <Badge className={`px-3 py-1 ${className}`} variant="secondary">{children}</Badge>
);

const ContestPage: NextPage<ContestPageProps> = ({ result, error }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'geral' | 'premios' | 'locais' | 'estatisticas' | 'json'>('geral');

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
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  const lotteryName = LOTTERY_NAMES[result.loteria] || result.loteria;
  const dezenas = Array.isArray(result.dezenas) ? result.dezenas : [];
  const trevos = Array.isArray((result as any).trevos) ? ((result as any).trevos as Array<string | number>) : [];
  const premiacoes = Array.isArray((result as any).premiacoes) ? ((result as any).premiacoes as any[]) : [];
  const cidadesPremiadas = Array.isArray((result as any).cidadesPremiadas) ? ((result as any).cidadesPremiadas as any[]) : [];
  const rateioCidades = Array.isArray((result as any).rateioCidades) ? ((result as any).rateioCidades as any[]) : [];
  const estatisticas = (result as any).estatisticas || {};

  return (
    <>
      <SEOHead
        title={`Resultado ${lotteryName} Concurso ${result.concurso} - Detalhes completos`}
        description={`Resultado completo do concurso ${result.concurso} da ${lotteryName} realizado em ${safe(result.data, '')}. Números, premiação por faixa, ganhadores, cidades, arrecadação, estatísticas e mais.`}
        canonical={`https://numerosmegasena.com.br/${result.loteria}/${result.concurso}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/">
              <Button className="flex items-center gap-2" variant="outline">
                <ArrowLeft className="h-4 w-4" /> Voltar para Home
              </Button>
            </Link>
            <Pill className="text-lg">{lotteryName}</Pill>
          </div>

          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Hash className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-2xl">Concurso {result.concurso}</CardTitle>
                    <p className="text-gray-600 mt-1">{lotteryName}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" /> {safe(result.data, '-')}
                  </div>
                  {result.local && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="h-4 w-4" /> {result.local}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {result.acumulou && (
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
                  <p className="text-yellow-800 font-semibold text-center">🎲 ACUMULOU!</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'geral', label: 'Geral' },
                  { id: 'premios', label: 'Premiação' },
                  { id: 'locais', label: 'Locais/Ganhadores' },
                  { id: 'estatisticas', label: 'Estatísticas' },
                  { id: 'json', label: 'JSON bruto' },
                ].map((t) => (
                  <Button key={t.id} variant={activeTab === (t.id as any) ? 'default' : 'outline'} onClick={() => setActiveTab(t.id as any)}>
                    {t.label}
                  </Button>
                ))}
              </div>

              {activeTab === 'geral' && (
                <div className="space-y-6">
                  <Section title="Números Sorteados" icon={<Trophy className="h-5 w-5 text-yellow-600" />}>
                    <div className="flex flex-wrap gap-2">
                      {dezenas.map((n: any) => (
                        <Badge className="text-lg px-4 py-2 bg-blue-600 hover:bg-blue-700" key={String(n)}>
                          {String(n).padStart(2, '0')}
                        </Badge>
                      ))}
                    </div>
                  </Section>

                  {trevos.length > 0 && (
                    <Section title="Trevos da Sorte">
                      <div className="flex flex-wrap gap-2">
                        {trevos.map((t) => (
                          <Badge className="text-lg px-4 py-2 border-green-500 text-green-700" key={String(t)} variant="outline">
                            🍀 {String(t).padStart(2, '0')}
                          </Badge>
                        ))}
                      </div>
                    </Section>
                  )}

                  {(result as any).mesSorte && (
                    <Section title="Mês da Sorte">📅 {(result as any).mesSorte}</Section>
                  )}

                  {result.loteria === 'timemania' && result.observacao && (
                    <Section title="Time do Coração">⚽ {result.observacao}</Section>
                  )}

                  <Section title="Informações Financeiras" icon={<DollarSign className="h-5 w-5 text-green-600" />}>
                    <div className="grid md:grid-cols-2 gap-3">
                      <KV label="Arrecadação total" value={(result as any).arrecadacao != null ? formatCurrency((result as any).arrecadacao) : '-'} />
                      <KV label="Acumulado principal" value={(result as any).acumuladoPrincipal != null ? formatCurrency((result as any).acumuladoPrincipal) : '-'} />
                      <KV label="Acumulado especial" value={(result as any).acumuladoEspecial != null ? formatCurrency((result as any).acumuladoEspecial) : '-'} />
                      <KV label="Acumulado final zero" value={(result as any).acumuladoFinal_0 != null ? formatCurrency((result as any).acumuladoFinal_0) : '-'} />
                      <KV label="Valor estimado próximo concurso" value={result.valorEstimadoProximoConcurso != null ? formatCurrency(result.valorEstimadoProximoConcurso as any) : '-'} />
                      <KV label="Concurso próximo" value={result.proximoConcurso} />
                      <KV label="Data próximo" value={result.dataProximoConcurso ? formatDate(result.dataProximoConcurso as any) : '-'} />
                    </div>
                  </Section>

                  {result.observacao && result.loteria !== 'timemania' && (
                    <Section title="Observação" icon={<Info className="h-5 w-5 text-blue-600" />}>
                      <p className="text-sm text-gray-800">{result.observacao}</p>
                    </Section>
                  )}
                </div>
              )}

              {activeTab === 'premios' && (
                <div className="space-y-4">
                  <Section title="Faixas de Premiação" icon={<DollarSign className="h-5 w-5 text-green-600" />}>
                    {premiacoes.length === 0 && <p className="text-sm text-gray-500">Sem dados de premiação.</p>}
                    <div className="space-y-2">
                      {premiacoes.map((p: any, idx: number) => (
                        <Card key={idx}>
                          <CardContent className="py-3 px-4 space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">{p.descricao ?? p.faixa ?? `Faixa ${idx + 1}`}</p>
                                <p className="text-sm text-gray-600">
                                  {(typeof p.ganhadores === 'number' ? p.ganhadores : (p.quantidadeGanhadores ?? 0))} {(((p.ganhadores ?? p.quantidadeGanhadores) === 1) ? 'ganhador' : 'ganhadores')}
                                </p>
                              </div>
                              <p className="text-lg font-bold text-green-700">
                                {p.valorPremio != null ? formatCurrency(p.valorPremio) : (p.valor != null ? formatCurrency(p.valor) : (p.premio != null ? formatCurrency(p.premio) : '-'))}
                              </p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-2 text-sm text-gray-700">
                              <KV label="Acertos" value={p.acertos ?? p.acertosDescricao ?? '-'} />
                              <KV label="Mín/Máx acertos" value={p.minimoAcertos ? `${p.minimoAcertos} - ${p.maximoAcertos ?? '-'}` : (p.maximoAcertos ?? '-')} />
                              <KV label="Rateio" value={p.rateio ? formatCurrency(p.rateio) : '-'} />
                            </div>
                            {Array.isArray(p.localGanhadores) && p.localGanhadores.length > 0 && (
                              <div className="pt-2">
                                <p className="text-sm font-medium">Cidades/UF premiadas nesta faixa</p>
                                <List items={p.localGanhadores.map((l: any) => `${l.cidade ?? ''}${l.uf ? `/${l.uf}` : ''}${l.nome ? ` - ${l.nome}` : ''}`)} />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </Section>
                </div>
              )}

              {activeTab === 'locais' && (
                <div className="space-y-6">
                  <Section title="Locais do Sorteio" icon={<Building2 className="h-5 w-5 text-purple-600" />}>
                    <KV label="Local" value={result.local} />
                    <KV label="Cidade/UF" value={(result as any).cidadeUF ?? (result as any).cidade ?? '-'} />
                  </Section>

                  <Section title="Distribuição por Cidades/UF">
                    {cidadesPremiadas.length === 0 && rateioCidades.length === 0 && (
                      <p className="text-sm text-gray-500">Sem dados de cidades premiadas.</p>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      {cidadesPremiadas.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Cidades premiadas</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <List items={cidadesPremiadas.map((c: any) => `${c.cidade ?? ''}${c.uf ? `/${c.uf}` : ''} - ${c.quantidade ?? c.ganhadores ?? ''}`)} />
                          </CardContent>
                        </Card>
                      )}

                      {rateioCidades.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Rateio por cidade/UF</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <List items={rateioCidades.map((r: any) => `${r.cidade ?? ''}${r.uf ? `/${r.uf}` : ''} - ${r.quantidade ?? r.ganhadores ?? ''} (${r.faixa ?? r.descricao ?? ''})`)} />
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </Section>
                </div>
              )}

              {activeTab === 'estatisticas' && (
                <div className="space-y-4">
                  <Section title="Estatísticas" icon={<PieChart className="h-5 w-5 text-indigo-600" />}>
                    {Object.keys(estatisticas).length === 0 && <p className="text-sm text-gray-500">Sem estatísticas disponíveis.</p>}
                    <div className="grid md:grid-cols-2 gap-3">
                      {Object.entries(estatisticas).map(([k, v]) => (
                        <KV key={k} label={k} value={String(v)} />
                      ))}
                    </div>
                  </Section>
                </div>
              )}

              {activeTab === 'json' && (
                <div className="space-y-4">
                  <Section title="JSON completo" icon={<Info className="h-5 w-5 text-gray-600" />}>
                    <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </Section>
                </div>
              )}
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
    const result = await getResultByContest(lottery, contest);
    if (!result) {
      return { props: { result: null, error: 'Resultado não encontrado.' } };
    }

    await indexNewResult(lottery, parseInt(contest, 10));

    return { props: { result } };
  } catch (err: any) {
    console.error('Error fetching contest:', err);
    return { props: { result: null, error: err?.message || 'Erro desconhecido' } };
  }
};

export default ContestPage;
