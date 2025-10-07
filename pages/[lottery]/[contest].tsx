import React from 'react'
import { GetServerSideProps } from 'next'
import SEOHead from '@/components/SEOHead'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getResultByContest } from '@/services/lotteryApi'
import { indexNewResult } from '@/services/indexing'
import { formatDate } from '@/utils/formatters'
import { LOTTERY_MAP } from '@/types/lottery'

interface ContestPageProps {
  result: any
  error?: string
  lotteryKey?: string
}

function safeDate(str: string | undefined | null): string {
  if (!str) return ''
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return String(str)
  const d = new Date(str as string)
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

// Dynamic field renderer - renders any value recursively
const DynamicFieldRenderer: React.FC<{
  data: any
  hexColor: string
  lightColor: string
  excludeKeys?: string[]
}> = ({ data, hexColor, lightColor, excludeKeys = [] }) => {
  if (data === null || data === undefined) return null

  const renderValue = (key: string, value: any, depth: number = 0): React.ReactNode => {
    // Skip excluded keys
    if (excludeKeys.includes(key)) return null

    const indentClass = depth > 0 ? 'ml-4' : ''

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) return null
      
      // Check if array of numbers (like dezenas)
      if (value.every(v => typeof v === 'number' || !isNaN(Number(v)))) {
        return (
          <div key={key} className={`mb-3 ${indentClass}`}>
            <span className="font-semibold text-sm capitalize">{key}:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {value.map((num, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                  style={{ background: hexColor }}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )
      }
      
      // Array of objects or mixed
      return (
        <div key={key} className={`mb-3 ${indentClass}`}>
          <span className="font-semibold text-sm capitalize">{key}:</span>
          <div className="ml-4 mt-1 space-y-2">
            {value.map((item, i) => (
              <div key={i} className="border-l-2 pl-3" style={{ borderColor: lightColor }}>
                {typeof item === 'object' ? (
                  Object.entries(item).map(([k, v]) => renderValue(k, v, depth + 1))
                ) : (
                  <span className="text-sm">{String(item)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Handle objects
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className={`mb-3 ${indentClass}`}>
          <span className="font-semibold text-sm capitalize">{key}:</span>
          <div className="ml-4 mt-1">
            {Object.entries(value).map(([k, v]) => renderValue(k, v, depth + 1))}
          </div>
        </div>
      )
    }

    // Handle primitives
    const formattedValue = (() => {
      if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}/.test(value)) {
        return safeDate(value)
      }
      if (key.toLowerCase().includes('valor') || key.toLowerCase().includes('premio')) {
        const numVal = Number(value)
        if (!isNaN(numVal) && numVal > 0) return toBRL(value)
      }
      return String(value)
    })()

    return (
      <div key={key} className={`flex justify-between border-b pb-2 text-sm ${indentClass}`}>
        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
        <span className="text-gray-700">{formattedValue}</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {Object.entries(data)
        .filter(([key]) => !excludeKeys.includes(key))
        .map(([key, value]) => renderValue(key, value))}
    </div>
  )
}

const ContestPage: React.FC<ContestPageProps> = ({ result, error, lotteryKey: lotteryKeyProp }) => {
  if (error || !result) {
    return (
      <div className="container mx-auto p-4">
        <SEOHead title="Erro - Números Mega Sena" description="Resultado não encontrado" />
        <p className="text-red-600">{error || 'Resultado não encontrado.'}</p>
      </div>
    )
  }

  // Extract key fields for header and special rendering
  const lotteryKey = (lotteryKeyProp || '').toLowerCase().replace(/\s+/g, '')
  const lotteryConfig = LOTTERY_MAP?.[lotteryKey]
  const lotteryName: string = result?.loteria || result?.nome || lotteryConfig?.name || ''
  const contestNumber: string | number = result?.concurso ?? ''
  const drawDate: string = safeDate(result?.data) || ''
  const drawnNumbers: any[] = Array.isArray(result?.dezenas) ? result.dezenas : []
  const local: string = result?.local || ''
  const proximoConcurso: number = toInt(result?.proximoConcurso)

  const hexColor = lotteryConfig?.hexColor || '#6366f1'
  const lightColor = safeLighten(hexColor, 0.15)
  const darkColor = safeDarken(hexColor, 0.1)

  const pageTitle = `${lotteryName} - Concurso ${contestNumber} - Números Mega Sena`
  const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://sorteioagil.com.br').replace(/\/$/, '')
  const pageUrl = `${SITE_URL}/${lotteryKey}/${contestNumber}`

  // Keys to exclude from dynamic rendering (already rendered specially)
  const excludedKeys = ['loteria', 'concurso', 'data', 'local', 'proximoConcurso']

  return (
    <>
      <SEOHead
        title={`${lotteryName} - Concurso ${contestNumber} | Números Mega Sena`}
        description={`Resultado da ${lotteryName} - Concurso ${contestNumber}. Números, prêmios, ganhadores e próximos concursos.`}
        canonical={pageUrl}
        url={pageUrl}
        type="article"
        ogImage="/logo.png"
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div
          className="space-y-2 p-6 rounded-lg text-white"
          style={{ background: `linear-gradient(135deg, ${hexColor}, ${darkColor})` }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold">{lotteryName} - Concurso {contestNumber}</h1>
          <p className="text-white/90">{drawDate}</p>
          {local && <p className="text-white/80 text-sm">Local: {local}</p>}
        </div>

        {/* Drawn Numbers (special rendering) */}
        {drawnNumbers.length > 0 && (
          <Card>
            <CardHeader>
              <ThemedTitle color={hexColor}>Números Sorteados</ThemedTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {drawnNumbers.map((num: any, i: number) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: hexColor }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dynamic Full API Data Rendering */}
        <Card>
          <CardHeader>
            <ThemedTitle color={hexColor}>Todos os Dados da API</ThemedTitle>
          </CardHeader>
          <CardContent>
            <DynamicFieldRenderer
              data={result}
              hexColor={hexColor}
              lightColor={lightColor}
              excludeKeys={excludedKeys}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <ThemedTitle color={hexColor}>Navegação</ThemedTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <a href="/">
                <Button style={{ borderColor: hexColor, color: hexColor }} variant="outline">Início</Button>
              </a>
              <a href={`/`}>
                <Button style={{ background: lightColor, color: hexColor }} variant="secondary">Voltar para Início</Button>
              </a>
              {proximoConcurso > 0 ? (
                <a href={`/${lotteryKey}/${proximoConcurso}`}>
                  <Button style={{ background: lightColor, color: hexColor }} variant="secondary">
                    Ver próximo concurso ({proximoConcurso})
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
    const sanitizedContest = String(contest).replace(/[^0-9]/g, '')
    const result = await getResultByContest(lottery, sanitizedContest)
    if (!result) {
      return { props: { result: null, error: 'Resultado não encontrado.' } }
    }
    await indexNewResult(lottery, parseInt(sanitizedContest, 10))
    return { props: { result, lotteryKey: String(lottery).toLowerCase() } }
  } catch (err: any) {
    console.error('Error fetching contest:', err)
    return { props: { result: null, error: err?.message || 'Erro desconhecido' } }
  }
}

export default ContestPage
