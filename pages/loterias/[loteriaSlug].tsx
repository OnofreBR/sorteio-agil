import Link from 'next/link'
import SEOHead from '@/components/SEOHead'
import NumbersPills from '@/components/NumbersPills'
import PrizeTable from '@/components/PrizeTable'
import { buildUrl } from '@/src/lib/config/site'
import {
  formatCurrencyBRL,
  formatDate,
  formatDateLong,
  formatNumber,
  toISODate,
} from '@/utils/formatters'
import type { LotteryPageProps } from './loteriaPage.utils'

const LotteryPage = ({ lottery, history }: LotteryPageProps) => {
  if (!lottery) {
    return (
      <main className="container mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Sem dados disponíveis no momento.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tente novamente em instantes.
        </p>
      </main>
    )
  }

  const canonicalUrl = buildUrl(`/loterias/${lottery.lotterySlug}`)
  const pageTitle = `${lottery.lotteryName} - Concurso ${lottery.contestNumber}`
  const formattedDate = formatDateLong(lottery.contestDate)
  const prizeLabel = formatCurrencyBRL(lottery.mainPrize)
  const winnersLabel =
    lottery.mainWinners === null
      ? '—'
      : lottery.mainWinners === 0
      ? 'Acumulou'
      : `${formatNumber(lottery.mainWinners)} ${
          lottery.mainWinners === 1 ? 'ganhador' : 'ganhadores'
        }`

  const nextContestNumber = lottery.nextContest.number
    ? formatNumber(lottery.nextContest.number)
    : '—'
  const nextContestDate = lottery.nextContest.date
    ? formatDate(lottery.nextContest.date)
    : '—'
  const nextContestPrize = formatCurrencyBRL(lottery.nextContest.estimatedPrize)

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={`Confira os resultados do concurso ${
          lottery.contestNumber
        } da ${lottery.lotteryName}, realizado em ${
          formattedDate
        }. Números sorteados, ganhadores e prêmios.`}
        canonicalUrl={canonicalUrl}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: pageTitle,
          description: `Resultado do concurso ${
            lottery.contestNumber
          } da ${lottery.lotteryName}`,
          datePublished: lottery.contestDate
            ? toISODate(lottery.contestDate)
            : undefined,
        }}
      />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <article>
          <header className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg">
            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              {lottery.lotteryName}
            </h1>
            <p className="mt-2 text-lg opacity-95">
              Concurso {formatNumber(lottery.contestNumber)} • {formattedDate}
            </p>
          </header>

          <section className="space-y-6">
            <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Números sorteados
              </h2>
              <NumbersPills
                numbers={lottery.numbers}
                size="lg"
                ariaLabel={`Números sorteados do concurso ${lottery.contestNumber}`}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-muted/40 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Prêmio principal
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {prizeLabel}
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/40 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Ganhadores
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {winnersLabel}
                </p>
              </div>
            </div>

            {lottery.prizes && lottery.prizes.length > 0 && (
              <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Premiação completa
                </h2>
                <PrizeTable prizes={lottery.prizes} />
              </div>
            )}

            <div className="rounded-xl border border-border/60 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Próximo concurso
              </h2>
              <p className="text-lg text-muted-foreground">
                Concurso {nextContestNumber} • {nextContestDate}
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {nextContestPrize}
              </p>
            </div>

            {history && history.length > 0 && (
              <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Últimos concursos da {lottery.lotteryName}
                </h2>
                <ul className="space-y-3">
                  {history.map((item) => (
                    <li
                      className="rounded-xl border border-border/60 bg-white p-4 shadow-sm"
                      key={`${item.lotterySlug}-${item.contestNumber}`}
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Concurso {formatNumber(item.contestNumber)} ·{' '}
                            {formatDate(item.contestDate)}
                          </p>
                          <NumbersPills
                            numbers={item.numbers}
                            size="sm"
                            ariaLabel={`Números sorteados do concurso ${item.contestNumber}`}
                          />
                        </div>
                        <Link
                          href={`/${item.lotterySlug}/concurso-${item.contestNumber}`}
                          className="inline-flex items-center justify-center rounded-lg border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          Ver concurso
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </article>
      </main>
    </>
  )
}

export default LotteryPage
