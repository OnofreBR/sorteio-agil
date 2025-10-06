import React from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Hash, Calendar, MapPin, Trophy, DollarSign, Users, Info, ArrowLeft } from 'lucide-react'

import { getResultByContest } from '../../services/lotteryApi'
import { indexNewResult } from '../../services/indexing'
import type { LotteryResult } from '../../types/lottery'

import SEOHead from '../../components/SEOHead'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { formatCurrency, formatDate } from '../../utils/formatters'

interface ContestPageProps {
  result: LotteryResult | null
  error?: string
}

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
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
)

const KV = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-gray-900 text-right break-words">{value ?? '-'}</span>
  </div>
)

const ContestPage: NextPage<ContestPageProps> = ({ result, error }) => {
  const router = useRouter()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-red-600">Erro ao Carregar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{error}</p>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!result) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  const lotteryName = LOTTERY_NAMES[result.loteria] || result.loteria
  const dezenas = Array.isArray(result.dezenas) ? result.dezenas : []
  const trevos = Array.isArray(result.trevos) ? result.trevos : []
  const premiacoes = Array.isArray(result.premiacoes) ? result.premiacoes : []

  // Optional arrays possibly provided by API (null-safe)
  const cidadesPremiadas: Array<{ cidade?: string; uf?: string; quantidade?: number; ganhadores?: number }> =
    (result as any).cidadesPremiadas ?? []
  const rateioCidades: Array<{ cidade?: string; uf?: string; quantidade?: number; ganhadores?: number; faixa?: number; descricao?: string }> =
    (result as any).rateioCidades ?? []

  const arrecadacaoTotal = (result as any).arrecadacaoTotal ?? (result as any).arrecadado
  const acumuladoPrincipal = (result as any).acumuladoPrincipal ?? (result as any).acumulado
  const acumuladoEspecial = (result as any).acumuladoEspecial
  const acumuladoFinalZero = (result as any).acumuladoFinalZero

  return (
    <>
      <SEOHead
        title={`Resultado ${lotteryName} Concurso ${result.concurso} - Detalhes`}
        description={`Resultado do concurso ${result.concurso} da ${lotteryName} em ${result.data}.`}
        canonical={`https://numerosmegasena.com.br/${result.loteria}/${result.concurso}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Voltar para Home
              </Button>
            </Link>
            <Badge className="text-base">{lotteryName}</Badge>
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
                    <Calendar className="h-4 w-4" /> {formatDate?.(result.data) ?? result.data}
                  </div>
                  {result.local && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="h-4 w-4" /> {result.local}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Números Sorteados + Trevos/Mês/Time */}
              <Section title="Números Sorteados">
                <div className="flex flex-wrap gap-2">
                  {dezenas.map((n) => (
                    <Badge key={String(n)} className="text-lg px-4 py-2 bg-blue-600 text-white">
                      {String(n).padStart(2, '0')}
                    </Badge>
                  ))}
                </div>
              </Section>

              {trevos?.length > 0 && (
                <Section title="Trevos da Sorte">
                  <div className="flex flex-wrap gap-2">
                    {trevos.map((t) => (
                      <Badge key={String(t)} variant="outline" className="text-lg px-4 py-2 border-green-500 text-green-700">
                        🍀 {String(t).padStart(2, '0')}
                      </Badge>
                    ))}
                  </div>
                </Section>
              )}

              {result.mesSorte && (
                <Section title="Mês da Sorte">
                  <p className="text-sm">📅 {result.mesSorte}</p>
                </Section>
              )}

              {result.loteria === 'timemania' && result.observacao && (
                <Section title="Time do Coração">
                  <p className="text-sm">⚽ {result.observacao}</p>
                </Section>
              )}

              {/* Premiação por faixa */}
              <Section title="Premiação por faixa">
                {premiacoes.length === 0 && <p className="text-sm text-gray-500">Sem dados de premiação.</p>}
                <div className="space-y-3">
                  {premiacoes.map((p, idx) => (
                    <Card key={idx}>
                      <CardContent className="py-3 px-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{p.descricao ?? `Faixa ${p.faixa ?? idx + 1}`}</p>
                            <p className="text-sm text-gray-600">
                              {p.ganhadores} {p.ganhadores === 1 ? 'ganhador' : 'ganhadores'}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-green-700">{formatCurrency?.(p.valorPremio) ?? p.valorPremio}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>

              {/* Arrecadação e Acumulados */}
              <Section title="Arrecadação e Acumulados">
                <div className="grid md:grid-cols-2 gap-3">
                  <KV label="Arrecadação total" value={arrecadacaoTotal != null ? formatCurrency?.(arrecadacaoTotal) ?? arrecadacaoTotal : '-'} />
                  <KV label="Acumulado principal" value={acumuladoPrincipal != null ? formatCurrency?.(acumuladoPrincipal) ?? acumuladoPrincipal : '-'} />
                  {acumuladoEspecial != null && (
                    <KV label="Acumulado especial" value={formatCurrency?.(acumuladoEspecial) ?? acumuladoEspecial} />
                  )}
                  {acumuladoFinalZero != null && (
                    <KV label="Acumulado final zero" value={formatCurrency?.(acumuladoFinalZero) ?? acumuladoFinalZero} />
                  )}
                  <KV label="Próximo concurso" value={result.proximoConcurso} />
                  <KV label="Data do próximo" value={formatDate?.(result.dataProximoConcurso) ?? result.dataProximoConcurso} />
                  <KV
                    label="Valor estimado próximo concurso"
                    value={result.valorEstimadoProximoConcurso != null ? formatCurrency?.(result.valorEstimadoProximoConcurso) ?? result.valorEstimadoProximoConcurso : '-'}
                  />
                </div>
              </Section>

              {/* Cidades/Ganhadores */}
              {(cidadesPremiadas?.length > 0 || rateioCidades?.length > 0) && (
                <Section title="Cidades/Ganhadores">
                  <div className="grid md:grid-cols-2 gap-4">
                    {cidadesPremiadas?.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Users className="h-4 w-4" /> Cidades premiadas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {cidadesPremiadas.map((c, i) => (
                              <li key={i}>
                                {(c.cidade ?? '') + (c.uf ? `/${c.uf}` : '')} - {c.quantidade ?? c.ganhadores ?? ''}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {rateioCidades?.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Rateio por cidade/UF</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {rateioCidades.map((r, i) => (
                              <li key={i}>
                                {(r.cidade ?? '') + (r.uf ? `/${r.uf}` : '')} - {r.quantidade ?? r.ganhadores ?? ''}
                                {r.faixa != null || r.descricao ? ` (${r.faixa ?? r.descricao})` : ''}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </Section>
              )}

              {/* Observações */}
              {result.observacao && result.loteria !== 'timemania' && (
                <Section title="Observações">
                  <p className="text-sm text-gray-800">{result.observacao}</p>
                </Section>
              )}

              {/* Links de navegação */}
              <Section title="Navegação">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/${result.loteria}`}> 
                    <Button variant="secondary">Voltar para {lotteryName}</Button>
                  </Link>
                  <Link href={`/${result.loteria}/${result.proximoConcurso}`}>
                    <Button>Ver próximo concurso</Button>
                  </Link>
                </div>
              </Section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { lottery, contest } = context.params as { lottery: string; contest: string }
  try {
    const result = await getResultByContest(lottery, contest)
    if (!result) {
      return { props: { result: null, error: 'Resultado não encontrado.' } }
    }
    await indexNewResult(lottery, parseInt(contest, 10))
    return { props: { result } }
  } catch (err: any) {
    console.error('Error fetching contest:', err)
    return { props: { result: null, error: err?.message || 'Erro desconhecido' } }
  }
}

export default ContestPage
