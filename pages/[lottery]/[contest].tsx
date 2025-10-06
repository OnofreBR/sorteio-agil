import React from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getResultByContest } from '@/services/lotteryApi'
import { indexNewResult } from '@/services/indexing'
import { formatDate } from '@/utils/formatters'
import { LOTTERY_MAP } from '@/types/lottery'

interface ContestPageProps {
  result: any
  error?: string
}

function safeDate(str: string | undefined | null): string {
  if (!str) return ''
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return str
  const d = new Date(str)
  if (isNaN(d.getTime())) return String(str)
  return formatDate(String(str)) || String(str)
}

const toBRL = (v: any) => {
  const n = Number(v)
  if (!isFinite(n)) return '—'
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
const toInt = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : 0)

function safeLighten(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (((num >> 16) & 0xff) + Math.round(255 * percent)))
  const g = Math.min(255, (((num >> 8) & 0xff) + Math.round(255 * percent)))
  const b = Math.min(255, ((num & 0xff) + Math.round(255 * percent)))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
function safeDarken(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, (((num >> 16) & 0xff) - Math.round(255 * percent)))
  const g = Math.max(0, (((num >> 8) & 0xff) - Math.round(255 * percent)))
  const b = Math.max(0, ((num & 0xff) - Math.round(255 * percent)))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

const ThemedTitle: React.FC<{ color: string; children: React.ReactNode; className?: string }> = ({ color, children, className }) => (
  <CardTitle className={className} style={{ color }}>{children}</CardTitle>
)

const Row: React.FC<{ label: string; value?: React.ReactNode; accent?: string }> = ({ label, value = '—', accent }) => (
  <div className="flex justify-between border-b pb-2 text-sm">
    <span className="font-medium">{label}</span>
    <span className={accent}>{value ?? '—'}</span>
  </div>
)

const ContestPage: React.FC<ContestPageProps> = ({ result, error }) => {
  if (error || !result) {
    return (
      <div className="container mx-auto p-4">
        <Head>
          <title>Erro - Sorteio Ágil</title>
        </Head>
        <p className="text-red-600">{error || 'Resultado não encontrado.'}</p>
      </div>
    )
  }

  const lotteryName: string = result?.loteria || ''
  const contestNumber: string | number = result?.concurso ?? ''
  const drawDate: string = safeDate(result?.data) || ''
  const drawnNumbers: any[] = Array.isArray(result?.dezenas) ? result.dezenas : []
  const trevos: any[] = Array.isArray(result?.trevos) ? result.trevos : []
  const mesSorte: any[] = Array.isArray(result?.mesSorte) ? result.mesSorte : []
  const timeCoracao: string = result?.timeCoracao || result?.time_do_coracao || ''
  const local: string = result?.local || ''
  const observacao: string = result?.observacao || ''

  const apuracao: string = safeDate(result?.dataApuracao)
  const proximoConcurso: number = toInt(result?.proximoConcurso)
  const proximaData: string = safeDate(result?.dataProximoConcurso)

  const valorArrecadado = result?.valorArrecadado
  const valorAcumulado = result?.valorAcumulado
  const acumuladoEspecial = result?.acumuladoEspecial || result?.acumulado_megadavirada || result?.acumuladoSorteioEspecial
  const acumuladoFinalZero = result?.acumuladoFinalZero || result?.acumulado_final_zero
  const valorEstimadoProximoConcurso = result?.valorEstimadoProximoConcurso

  const premiacoes: any[] = Array.isArray(result?.premiacoes) ? result.premiacoes : []
  const cidadesPremiadas: any[] = Array.isArray(result?.cidadesPremiadas) ? result.cidadesPremiadas : []
  const rateioCidades: any[] = Array.isArray(result?.rateioCidades) ? result.rateioCidades : []

  const lotteryKey = (lotteryName || '').toLowerCase().replace(/\s+/g, '')
  const lotteryConfig = LOTTERY_MAP?.[lotteryKey]
  const hexColor = lotteryConfig?.hexColor || '#6366f1'
  const lightColor = safeLighten(hexColor, 0.15)
  const darkColor = safeDarken(hexColor, 0.1)

  const pageTitle = `${lotteryName} - Concurso ${contestNumber} - Sorteio Ágil`
  const pageUrl = `https://sorteioagil.com.br/${lotteryKey}/${contestNumber}`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link href={pageUrl} rel="canonical" />
        <meta name="description" content={`Resultado da ${lotteryName} concurso ${contestNumber}. Números sorteados, premiações, cidades premiadas, arrecadação e próxima estimativa.`} />
      </Head>

      <div className="container mx-auto p-4 space-y-6">
        <div className="space-y-2 p-6 rounded-lg text-white" style={{ background: `linear-gradient(135deg, ${hexColor} 0%, ${darkColor} 100%)` }}>
          <h1 className="text-3xl font-bold">{lotteryName} - Concurso {contestNumber}</h1>
          <p className="text-white/90">{drawDate}</p>
          {local && <p className="text-white/80 text-sm">Local: {local}</p>}
        </div>

        {(drawnNumbers.length > 0 || trevos.length > 0 || mesSorte.length > 0 || timeCoracao) && (
          <Card>
            <CardHeader>
              <ThemedTitle color={hexColor}>Números Sorteados</ThemedTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {drawnNumbers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {drawnNumbers.map((num: any, i: number) => (
                    <div key={i} className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{ background: `linear-gradient(135deg, ${hexColor} 0%, ${darkColor} 100%)` }}>{num}</div>
                  ))}
                </div>
              )}

              {trevos.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">Trevos:</span>
                  {trevos.map((t: any, i: number) => (
                    <span key={i} className="px-2 py-1 rounded text-white" style={{ background: lightColor }}>{String(t)}</span>
                  ))}
                </div>
              )}

              {mesSorte.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">Mês da Sorte:</span>
                  {mesSorte.map((m: any, i: number) => (
                    <span key={i} className="px-2 py-1 rounded text-white" style={{ background: lightColor }}>{String(m)}</span>
                  ))}
                </div>
              )}

              {timeCoracao && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Time do Coração:</span>
                  <span className="px-2 py-1 rounded text-white" style={{ background: lightColor }}>{timeCoracao}</span>
                </div>
              )}

              {(apuracao || proximaData) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {apuracao && <Row label="Data de Apuração" value={apuracao} />}
                  {proximaData && <Row label="Próxima Data" value={proximaData} />}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {premiacoes.length > 0 && (
          <Card>
            <CardHeader>
              <ThemedTitle color={hexColor}>Premiação</ThemedTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {premiacoes.map((prize: any, i: number) => (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b pb-2" key={i}>
                    <span className="font-medium">{prize?.faixa || prize?.descricao || '—'}</span>
                    <span>{Number.isFinite(Number(prize?.ganhadores)) ? Number(prize.ganhadores) : '—'} ganhador(es)</span>
                    <span className="text-green-600">{toBRL(prize?.valorPremio)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(valorArrecadado || valorAcumulado || acumuladoEspecial || acumuladoFinalZero || valorEstimadoProximoConcurso) && (
          <Card>
            <CardHeader>
              <ThemedTitle color={hexColor}>Arrecadação e Acumulados</ThemedTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {valorArrecadado ? (<Row label="Arrecadação Total" value={toBRL(valorArrecadado)} accent="text-blue-600" />) : null}
                {valorAcumulado ? (<Row label="Acumulado" value={toBRL(valorAcumulado)} accent="text-orange-600 font-bold" />) : null}
                {acumuladoEspecial ? (<Row label="Acumulado Especial" value={toBRL(acumuladoEspecial)} accent="text-purple-600 font-semibold" />) : null}
                {acumuladoFinalZero ? (<Row label="Acumulado Final Zero" value={toBRL(acumuladoFinalZero)} accent="text-pink-600 font-semibold" />) : null}
                {valorEstimadoProximoConcurso ? (<Row label="Estimativa Próximo Concurso" value={toBRL(valorEstimadoProximoConcurso)} accent="text-green-600 font-bold" />) : null}
              </div>
            </CardContent>
          </Card>
        )}

        {cidadesPremiadas.length > 0 && (
          <Card>
            <CardHeader>
              <ThemedTitle color={hexColor} className="text-base">Cidades Premiadas</ThemedTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {cidadesPremiadas.map((c: any, i: number) => (
                  <li key={i}>{(c?.cidade || '') + (c?.uf ? `/${c.uf}` : '')} - {c?.quantidade ?? c?.ganhadores ?? '—'}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {rateioCidades.length > 0 && (
          <Card>
            <CardHeader>
              <ThemedTitle color={hexColor} className="text-base">Rateio por cidade/UF</ThemedTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {rateioCidades.map((r: any, i: number) => (
                  <li key={i}>
                    {(r?.cidade || '') + (r?.uf ? `/${r.uf}` : '')} - {r?.quantidade ?? r?.ganhadores ?? '—'}
                    {(r?.faixa != null || r?.descricao) ? ` (${r?.faixa ?? r?.descricao})` : ''}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {observacao && result?.loteria !== 'timemania' && (
          <Card>
            <CardHeader>
              <ThemedTitle color={hexColor}>Observações</ThemedTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-800">{observacao}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <ThemedTitle color={hexColor}>Navegação</ThemedTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <a href="/">
                <Button variant="outline" style={{ borderColor: hexColor, color: hexColor }}>Início</Button>
              </a>
              <a href={`/${result?.loteria || lotteryKey}`}>
                <Button variant="secondary" style={{ background: `linear-gradient(135deg, ${hexColor} 0%, ${darkColor} 100%)`, color: 'white' }}>Voltar para {lotteryName}</Button>
              </a>
              {proximoConcurso > 0 ? (
                <a href={`/${result?.loteria || lotteryKey}/${proximoConcurso}`}>
                  <Button variant="secondary" style={{ background: `linear-gradient(135deg, ${lightColor} 0%, ${hexColor} 100%)`, color: 'white' }}>Ver próximo concurso ({proximoConcurso})</Button>
                </a>
              ) : (
                <span className="text-gray-500 italic px-3 py-2">Próximo concurso: —</span>
              )}
            </div>
          </CardContent>
        </Card>
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
