import { GetServerSideProps } from 'next'
import Link from 'next/link'
import SEOHead from '@/components/SEOHead'
import NumbersPills from '@/components/NumbersPills'
import PrizeTable from '@/components/PrizeTable'
import { getContest, getLatestByLottery, LOTTERY_SLUGS } from '@/src/lib/api/results'
import { LotteryResult, LotterySlug } from '@/src/types/lottery'
import { formatCurrencyBRL, formatDate, formatDateLong, formatNumber } from '@/utils/formatters'

interface LotteryPageProps {
  lottery: LotteryResult | null
  history: LotteryResult[]
}

const LotteryPage = ({ lottery, history }: LotteryPageProps) => {
  if (!lottery) {
    return (
      <main className="container mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-foreground">Sem dados disponíveis no momento.</h1>
        <p className="mt-3 text-muted-foreground">Tente novamente em instantes.</p>
      </main>
    )
  }

  const pageTitle = `${lottery.lotteryName} - Concurso ${lottery.contestNumber}`
  const formattedDate = formatDateLong(lottery.contestDate)
  const prizeLabel = formatCurrencyBRL(lottery.mainPrize)
  const winnersLabel =
    lottery.mainWinners === null
      ? '—'
      : lottery.mainWinners === 0
      ? 'Acumulou'
      : `${formatNumber(lottery.mainWinners)} ${lottery.mainWinners === 1 ? 'ganhador' : 'ganhadores'}`

  const nextContestNumber = lottery.nextContest.number ? formatNumber(lottery.nextContest.number) : '—'
  const nextContestDate = lottery.nextContest.date ? formatDate(lottery.nextContest.date) : '—'
  const nextContestPrize = formatCurrencyBRL(lottery.nextContest.estimatedPrize)

  return (
    <>
      <SEOHead
        title={`${pageTitle} | Números Mega Sena`}
        description={`Confira o resultado completo da ${lottery.lotteryName}, concurso ${lottery.contestNumber}: números sorteados, premiações e próximos concursos.`}
        canonical={`${(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://sorteioagil.com.br').replace(/\/$/, '')}/loterias/${lottery.lotterySlug}`}
        url={`${(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://sorteioagil.com.br').replace(/\/$/, '')}/loterias/${lottery.lotterySlug}`}
        ogImage="/logo.png"
      />

      <main className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
        <header className="rounded-2xl border border-border/60 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-muted-foreground">Concurso {formatNumber(lottery.contestNumber)}</p>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">{lottery.lotteryName}</h1>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
              {lottery.location ? (
                <p className="mt-2 text-sm text-muted-foreground">Local do sorteio: {lottery.location}</p>
              ) : null}
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
              <NumbersPills numbers={lottery.numbers} ariaLabel={`Números sorteados da ${lottery.lotteryName}`} />
            </div>
            {lottery.secondDrawNumbers && lottery.secondDrawNumbers.length > 0 ? (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Segundo sorteio</p>
                <NumbersPills
                  numbers={lottery.secondDrawNumbers}
                  variant="secondary"
                  ariaLabel={`Segundo sorteio da ${lottery.lotteryName}`}
                />
              </div>
            ) : null}
            {lottery.trevos && lottery.trevos.length > 0 ? (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trevos</p>
                <NumbersPills
                  numbers={lottery.trevos}
                  variant="secondary"
                  ariaLabel={`Trevos sorteados da ${lottery.lotteryName}`}
                />
              </div>
            ) : null}
            {lottery.mesSorte ? (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">Mês da Sorte: <span className="font-semibold text-foreground">{lottery.mesSorte}</span></p>
              </div>
            ) : null}
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Distribuição de prêmios</h2>
          <PrizeTable tiers={lottery.prizeTiers} caption={`Premiação do concurso ${lottery.contestNumber}`} />
        </section>

        <section className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground">Próximo concurso</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Concurso</p>
              <p className="text-lg font-semibold text-foreground">{nextContestNumber}</p>
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

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Concursos recentes</h2>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem histórico disponível.</p>
          ) : (
            <ul className="space-y-3">
              {history.map((item) => (
                <li key={`${item.lotterySlug}-${item.contestNumber}`} className="rounded-xl border border-border/60 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Concurso {formatNumber(item.contestNumber)} · {formatDate(item.contestDate)}
                      </p>
                      <NumbersPills numbers={item.numbers} size="sm" ariaLabel={`Números sorteados do concurso ${item.contestNumber}`} />
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
          )}
        </section>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<LotteryPageProps> = async ({ params }) => {
  const slugParam = params?.loteriaSlug;
  const slug = typeof slugParam === 'string' ? (slugParam.toLowerCase() as LotterySlug) : null;

  if (!slug || !LOTTERY_SLUGS.includes(slug)) {
    return { notFound: true };
  }

  try {
    const lottery = await getLatestByLottery(slug);

    const history: LotteryResult[] = [];
    for (let step = 1; step <= 3; step += 1) {
      const contest = lottery.contestNumber - step;
      if (contest <= 0) break;
      try {
        const data = await getContest(slug, contest);
        history.push(data);
      } catch (error) {
        console.error(`[${slug}] Erro ao buscar histórico do concurso ${contest}:`, error);
        break;
      }
    }

    return {
      props: {
        lottery,
        history,
      },
    };
  } catch (error) {
    console.error(`[${slug}] Erro ao carregar a loteria:`, error);
    return {
      props: {
        lottery: null,
        history: [],
      },
    };
  }
}

export default LotteryPage
