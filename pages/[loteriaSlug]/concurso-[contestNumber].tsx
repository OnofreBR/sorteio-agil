import { GetServerSideProps } from 'next'
import Link from 'next/link'
import SEOHead from '@/components/SEOHead'
import NumbersPills from '@/components/NumbersPills'
import PrizeTable from '@/components/PrizeTable'
import { getContest, getLatestByLottery, LOTTERY_SLUGS } from '@/src/lib/api/results'
import { buildUrl } from '@/src/lib/config/site'
import { LotteryResult, LotterySlug } from '@/src/types/lottery'
import { formatCurrencyBRL, formatDate, formatDateLong, formatNumber, toISODate } from '@/utils/formatters'

interface ContestPageProps {
  result: LotteryResult | null
  previousContest?: number | null
  latestContest?: number | null
}

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
        }}
      />

      <main className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
        <header className="rounded-2xl border border-border/60 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-muted-foreground">Concurso {formatNumber(result.contestNumber)}</p>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">{result.lotteryName}</h1>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
              {result.location ? <p className="mt-2 text-sm text-muted-foreground">Local: {result.location}</p> : null}
            </div>
            <div className="space-y-2 text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prêmio principal</p>
              <p className="text-2xl font-bold text-emerald-600">{prizeLabel}</p>
              <p className="text-sm text-muted-foreground">{winnersLabel}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Números sorteados</p>
              <NumbersPills numbers={result.numbers} ariaLabel={`Números sorteados da ${result.lotteryName}`} />
            </div>
            {result.secondDrawNumbers && result.secondDrawNumbers.length > 0 ? (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Segundo sorteio</p>
                <NumbersPills
                  numbers={result.secondDrawNumbers}
                  variant="secondary"
                  ariaLabel={`Segundo sorteio da ${result.lotteryName}`}
                />
              </div>
            ) : null}
            {result.trevos && result.trevos.length > 0 ? (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trevos</p>
                <NumbersPills
                  numbers={result.trevos}
                  variant="secondary"
                  ariaLabel={`Trevos sorteados da ${result.lotteryName}`}
                />
              </div>
            ) : null}
            {result.mesSorte ? (
              <div>
                <p className="text-sm text-muted-foreground">Mês da Sorte: <span className="font-semibold text-foreground">{result.mesSorte}</span></p>
              </div>
            ) : null}
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Distribuição de prêmios</h2>
          <PrizeTable tiers={result.prizeTiers} caption={`Premiação do concurso ${result.contestNumber}`} />
        </section>

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

export const getServerSideProps: GetServerSideProps<ContestPageProps> = async ({ params }) => {
  const slugParam = params?.loteriaSlug
  const contestParam = params?.contestNumber

  const slug = typeof slugParam === 'string' ? (slugParam.toLowerCase() as LotterySlug) : null
  const contestNumber = typeof contestParam === 'string' ? Number(contestParam) : null

  if (!slug || !LOTTERY_SLUGS.includes(slug) || !contestNumber || Number.isNaN(contestNumber)) {
    return { notFound: true }
  }

  try {
    const result = await getContest(slug, contestNumber)
    let latestContest: number | null = null

    try {
      const latest = await getLatestByLottery(slug)
      latestContest = latest.contestNumber
    } catch (error) {
      console.error(`[${slug}] Erro ao obter concurso mais recente:`, error)
    }

    return {
      props: {
        result,
        previousContest: contestNumber > 1 ? contestNumber - 1 : null,
        latestContest,
      },
    }
  } catch (error) {
    console.error(`[${slug}] Erro ao obter concurso ${contestNumber}:`, error)
    return {
      props: {
        result: null,
        previousContest: null,
        latestContest: null,
      },
    }
  }
}

export default ContestPage
