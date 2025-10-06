import React from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getResultByContest } from '@/services/lotteryApi'
import { indexNewResult } from '@/services/indexing'
import { formatDate } from '@/utils/formatters'
import { LOTTERY_MAP } from '@/lib/lotteryConfig'

interface ContestPageProps {
  result: any
  error?: string
}

// safeDate: returns original string if new Date(str) is invalid or if str matches dd/MM/yyyy
function safeDate(str: string | undefined | null): string {
  if (!str) return ''
  // Check if already in dd/MM/yyyy format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return str
  const d = new Date(str)
  if (isNaN(d.getTime())) return str
  return str
}

// Color helpers
function safeLighten(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * percent))
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * percent))
  const b = Math.min(255, (num & 0xff) + Math.round(255 * percent))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function safeDarken(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, ((num >> 16) & 0xff) - Math.round(255 * percent))
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * percent))
  const b = Math.max(0, (num & 0xff) - Math.round(255 * percent))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

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

  const lotteryName = result.loteria || ''
  const contestNumber = result.concurso || ''
  const drawDate = formatDate(safeDate(result.data)) || safeDate(result.data) || ''
  const drawnNumbers = Array.isArray(result.dezenas) ? result.dezenas : []
  const prizes = Array.isArray(result.premiacoes) ? result.premiacoes : []
  const cidadesPremiadas = Array.isArray(result.cidadesPremiadas) ? result.cidadesPremiadas : []
  const rateioCidades = Array.isArray(result.rateioCidades) ? result.rateioCidades : []
  
  // Get lottery color
  const lotteryKey = lotteryName.toLowerCase().replace(/\s+/g, '')
  const lotteryConfig = LOTTERY_MAP[lotteryKey]
  const hexColor = lotteryConfig?.color || '#6366f1'
  const lightColor = safeLighten(hexColor, 0.15)
  const darkColor = safeDarken(hexColor, 0.1)
  
  // Check if we have arrecadação or acumulado data
  const hasArrecadacao = result.valorArrecadado && result.valorArrecadado > 0
  const hasAcumulado = result.valorAcumulado && result.valorAcumulado > 0
  const hasProximoEstimativa = result.valorEstimadoProximoConcurso && result.valorEstimadoProximoConcurso > 0
  
  const pageTitle = `${lotteryName} - Concurso ${contestNumber} - Sorteio Ágil`
  const pageUrl = `https://sorteioagil.com.br/${lotteryKey}/${contestNumber}`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="canonical" href={pageUrl} />
        <meta name="description" content={`Resultado do concurso ${contestNumber} da ${lotteryName}. Números sorteados: ${drawnNumbers.join(', ')}.`} />
      </Head>
      
      <div className="container mx-auto p-4 space-y-6">
        {/* Header with gradient */}
        <div 
          className="space-y-2 p-6 rounded-lg text-white"
          style={{
            background: `linear-gradient(135deg, ${hexColor} 0%, ${darkColor} 100%)`
          }}
        >
          <h1 className="text-3xl font-bold">
            {lotteryName} - Concurso {contestNumber}
          </h1>
          <p className="text-white/90">{drawDate}</p>
        </div>

        {/* Drawn Numbers */}
        {drawnNumbers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle 
                style={{ color: hexColor }}
              >
                Números Sorteados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {drawnNumbers.map((num, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${hexColor} 0%, ${darkColor} 100%)`
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prizes - only show if data exists */}
        {prizes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle style={{ color: hexColor }}>
                Premiação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {prizes.map((prize, i) => (
                  <div className="flex justify-between border-b pb-2" key={i}>
                    <span className="font-medium">{prize.faixa || prize.descricao || '—'}</span>
                    <span>{Number.isFinite(prize.ganhadores) ? prize.ganhadores : '—'} ganhador(es)</span>
                    <span className="text-green-600">
                      {Number.isFinite(prize.valorPremio) ? `R$ ${Number(prize.valorPremio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Arrecadação/Acumulados - only show if data exists */}
        {(hasArrecadacao || hasAcumulado || hasProximoEstimativa) && (
          <Card>
            <CardHeader>
              <CardTitle style={{ color: hexColor }}>
                Arrecadação e Acumulados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {hasArrecadacao && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Arrecadação Total</span>
                    <span className="text-blue-600">
                      R$ {Number(result.valorArrecadado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                {hasAcumulado && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Acumulado</span>
                    <span className="text-orange-600 font-bold">
                      R$ {Number(result.valorAcumulado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                {hasProximoEstimativa && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Estimativa Próximo Concurso</span>
                    <span className="text-green-600 font-bold">
                      R$ {Number(result.valorEstimadoProximoConcurso).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cidades Premiadas - only show if data exists */}
        {cidadesPremiadas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base" style={{ color: hexColor }}>
                Cidades Premiadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {cidadesPremiadas.map((c, i) => (
                  <li key={i}>
                    {(c.cidade || '') + (c.uf ? `/${c.uf}` : '')} - {c.quantidade || c.ganhadores || '—'}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Rateio Cidades - only show if data exists */}
        {rateioCidades.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base" style={{ color: hexColor }}>
                Rateio por cidade/UF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {rateioCidades.map((r, i) => (
                  <li key={i}>
                    {(r.cidade || '') + (r.uf ? `/${r.uf}` : '')} - {r.quantidade || r.ganhadores || '—'}
                    {r.faixa != null || r.descricao ? ` (${r.faixa || r.descricao})` : ''}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Observações */}
        {result.observacao && result.loteria !== 'timemania' && (
          <Card>
            <CardHeader>
              <CardTitle style={{ color: hexColor }}>
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-800">{result.observacao}</p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: hexColor }}>
              Navegação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <a href="/">
                <Button 
                  variant="outline"
                  style={{
                    borderColor: hexColor,
                    color: hexColor
                  }}
                >
                  Início
                </Button>
              </a>
              <a href={`/${result.loteria}`}>
                <Button 
                  variant="secondary"
                  style={{
                    background: `linear-gradient(135deg, ${hexColor} 0%, ${darkColor} 100%)`,
                    color: 'white'
                  }}
                >
                  Voltar para {lotteryName}
                </Button>
              </a>
              {result.proximoConcurso && result.proximoConcurso > 0 ? (
                <a href={`/${result.loteria}/${result.proximoConcurso}`}>
                  <Button 
                    variant="secondary"
                    style={{
                      background: `linear-gradient(135deg, ${lightColor} 0%, ${hexColor} 100%)`,
                      color: 'white'
                    }}
                  >
                    Ver próximo concurso ({result.proximoConcurso})
                  </Button>
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
      return {
        props: {
          result: null,
          error: 'Resultado não encontrado.'
        }
      }
    }
    
    await indexNewResult(lottery, parseInt(contest, 10))
    
    return {
      props: {
        result
      }
    }
  } catch (err: any) {
    console.error('Error fetching contest:', err)
    return {
      props: {
        result: null,
        error: err?.message || 'Erro desconhecido'
      }
    }
  }
}

export default ContestPage
