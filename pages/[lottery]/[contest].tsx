import React from 'react'
import { GetServerSideProps } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getResultByContest } from '@/services/lotteryApi'
import { indexNewResult } from '@/services/indexing'
import { formatDate } from '@/utils/formatters'

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

const ContestPage: React.FC<ContestPageProps> = ({ result, error }) => {
  if (error || !result) {
    return (
      <div className="container mx-auto p-4">
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {lotteryName} - Concurso {contestNumber}
        </h1>
        <p className="text-gray-600">{drawDate}</p>
      </div>

      {drawnNumbers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Números Sorteados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {drawnNumbers.map((num, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold"
                >
                  {num}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {prizes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Premiação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {prizes.map((prize, i) => (
                <div className="flex justify-between border-b pb-2" key={i}>
                  <span className="font-medium">{prize.faixa || prize.descricao || ''}</span>
                  <span>{Number.isFinite(prize.ganhadores) ? prize.ganhadores : 0} ganhador(es)</span>
                  <span className="text-green-600">
                    {Number.isFinite(prize.valorPremio) ? `R$ ${Number(prize.valorPremio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {cidadesPremiadas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cidades Premiadas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {cidadesPremiadas.map((c, i) => (
                <li key={i}>
                  {(c.cidade || '') + (c.uf ? `/${c.uf}` : '')} - {c.quantidade || c.ganhadores || ''}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {rateioCidades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rateio por cidade/UF</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {rateioCidades.map((r, i) => (
                <li key={i}>
                  {(r.cidade || '') + (r.uf ? `/${r.uf}` : '')} - {r.quantidade || r.ganhadores || ''}
                  {r.faixa != null || r.descricao ? ` (${r.faixa || r.descricao})` : ''}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {result.observacao && result.loteria !== 'timemania' && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-800">{result.observacao}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Navegação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <a href={`/${result.loteria}`}>
              <Button variant="secondary">Voltar para {lotteryName}</Button>
            </a>
            {result.proximoConcurso && (
              <a href={`/${result.loteria}/${result.proximoConcurso}`}>
                <Button>Ver próximo concurso</Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
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
