import Link from 'next/link'
import SEOHead from '@/src/components/SEOHead'
import NumbersPills from '@/src/components/NumbersPills'
import PrizeTable from '@/src/components/PrizeTable'
import { buildUrl } from '@/src/lib/config/site'
import {
  formatCurrencyBRL,
  formatDate,
  formatDateLong,
  formatNumber,
  toISODate,
} from '@/utils/formatters'
import type { ContestPageProps } from './concursoPage.utils'

const ContestPage = ({ result, previousContest, latestContest }: ContestPageProps) => {
  if (!result) {
    return (
      <main className="container mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-foreground">Concurso não encontrado.</h1>
        <p className="mt-3 text-muted-foreground">Verifique o endereço e tente novamente.</p>
      </main>
    )
  }

  const canonicalUrl = buildUrl(`/${result.lotterySlug}/concurso-${result.contestNumber}`)
  const formattedDate = formatDateLong(result.contestDate)
  const prizeLabel = formatCurrencyBRL(result.mainPrize)
  const winnersLabel =
    result.mainWinners === null
      ? '—'
      : result.mainWinners === 0
      ? 'Acumulou'
      : `${formatNumber(result.mainWinners)} ${result.mainWinners === 1 ? 'ganhador' : 'ganhadores'}`

  const nextContest = result.nextContest.number ? formatNumber(result.nextContest.number) : '—'
  const nextContestDate = result.nextContest.date ? formatDate(result.nextContest.date) : '—'
  const nextContestPrize = formatCurrencyBRL(result.nextContest.estimatedPrize)

  const previousDisabled = !previousContest || previousContest < 1

  return (
    <>
      <SEOHead
        title={`${result.lotteryName} - Concurso ${result.contestNumber} | Números Mega Sena`}
        description={`Detalhes completos do concurso ${result.contestNumber} da ${result.lotteryName}: números, prêmios, ganhadores e próximos sorteios.`}
        canonical={canonicalUrl}
        url={canonicalUrl}
        ogImage="/logo.png"
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: `${result.lotteryName} - Concurso ${result.contestNumber}`,
          description: `Números sorteados: ${result.numbers.join(', ')}. ${result.mainWinners === 0 ? 'Acumulou.' : `${result.mainWinners || 0} ganhadores.`}`,
          datePublished: toISODate(result.contestDate),
          dateModified: toISODate(result.contestDate),
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl,
          },
          author: {
            '@type': 'Organization',
            name: 'Números Mega Sena',
            url: buildUrl('/'),
          },
          publisher: {
            '@type': 'Organization',
            name: 'Números Mega Sena',
            logo: {
              '@type': 'ImageObject',
              url: buildUrl('/logo.png'),
            },
          },
        }}
      />
      <main className="container mx-auto max-w-5xl space-y-8 px-4 py-8">
        <article className="space-y-6">
          <header className="space-y-4">
            <nav className="flex gap-2 text-sm text-muted-foreground">
              <Link href="/loterias" className="hover:text-foreground">
                Loterias
              </Link>
              <span>/</span>
              <Link
                href={`/loterias/${result.lotterySlug}`}
                className="hover:text-foreground"
              >
                {result.lotteryName}
              </Link>
              <span>/</span>
              <span className="text-foreground">Concurso {result.contestNumber}</span>
            </nav>

            <h1 className="text-4xl font-bold text-foreground">
              {result.lotteryName}
            </h1>

            <div className="flex flex-col gap-2 text-muted-foreground">
              <p className="text-lg">
                Concurso <span className="font-semibold text-foreground">{result.contestNumber}</span>
              </p>
              <time dateTime={toISODate(result.contestDate)}>{formattedDate}</time>
            </div>
          </header>

          <section
            className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm"
            aria-labelledby="numeros-sorteados"
          >
            <h2 id="numeros-sorteados" className="text-2xl font-semibold text-foreground">
              Números sorteados
            </h2>

            <div className="mt-6 space-y-6">
              <NumbersPills
                numbers={result.numbers}
                ariaLabel={`Números sorteados da ${result.lotteryName}`}
              />
              {result.specialNumbers ? (
                <NumbersPills
                  numbers={result.specialNumbers}
                  ariaLabel={`Trevos sorteados da ${result.lotteryName}`}
                />
              ) : null}
            </div>

            {result.mesSorte ? (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Mês da Sorte: <span className="font-semibold text-foreground">{result.mesSorte}</span>
                </p>
              </div>
            ) : null}
          </section>

          <section
            className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm"
            aria-labelledby="premiacao-principal"
          >
            <h2 id="premiacao-principal" className="text-2xl font-semibold text-foreground">
              Premiação principal
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Prêmio</p>
                <p className="text-2xl font-bold text-emerald-600">{prizeLabel}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Ganhadores</p>
                <p className="text-2xl font-bold text-foreground">{winnersLabel}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Distribuição de prêmios</h2>
            <PrizeTable tiers={result.prizeTiers} caption={`Premiação do concurso ${result.contestNumber}`} />
          </section>
        </article>

        <section className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Próximo concurso</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Concurso</p>
              <p className="text-lg font-semibold text-foreground">{nextContest}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Data prevista</p>
              <p className="text-lg font-semibold text-foreground">{nextContestDate}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Estimativa de prêmio</p>
              <p className="text-lg font-semibold text-emerald-600">{nextContestPrize}</p>
            </div>
          </div>
        </section>

        <nav className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link
            href={`/loterias/${result.lotterySlug}`}
            className="inline-flex items-center justify-center rounded-lg border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label={`Voltar para a página da loteria ${result.lotteryName}`}
          >
            Voltar à loteria
          </Link>
          <Link
            href={previousDisabled ? '#' : `/${result.lotterySlug}/concurso-${previousContest}`}
            aria-label="Concurso anterior"
            aria-disabled={previousDisabled}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              previousDisabled
                ? 'cursor-not-allowed border border-border/70 text-muted-foreground'
                : 'border border-emerald-500 text-emerald-600 hover:bg-emerald-50'
            }`}
            tabIndex={previousDisabled ? -1 : 0}
          >
            Concurso anterior
          </Link>
        </nav>
      </main>
    </>
  )
}

export default ContestPage