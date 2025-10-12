
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Link from 'next/link';
import SEOHead from '@/components/SEOHead';
import NumbersPills from '@/components/NumbersPills';
import PrizeTable from '@/components/PrizeTable';
import { buildUrl } from '@/lib/config/site';
import {
  formatCurrencyBRL,
  formatDate,
  formatNumber,
} from '@/utils/formatters';
import { lotteryApi } from '@/services/lotteryApi';
import { LotteryResult, LotterySlug, LOTTERY_SLUGS } from '@/types/lottery';

interface LotteryPageProps {
  lottery: LotteryResult | null;
}

const LotteryPage: NextPage<LotteryPageProps> = ({ lottery }) => {
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
    );
  }

  const canonicalUrl = buildUrl(`/loterias/${lottery.loteria}`);
  const pageTitle = `${lottery.nome} - Concurso ${lottery.concurso}`;
  const formattedDate = formatDate(lottery.data);
  const mainPrize = lottery.premiacoes.length > 0 ? lottery.premiacoes[0] : null;
  const prizeLabel = mainPrize ? formatCurrencyBRL(mainPrize.valorPremio) : '—';
  const winnersLabel =
    mainPrize?.ganhadores === null || mainPrize?.ganhadores === undefined
      ? '—'
      : mainPrize?.ganhadores === 0
      ? 'Acumulou'
      : `${formatNumber(mainPrize.ganhadores)} ${
          mainPrize.ganhadores === 1 ? 'ganhador' : 'ganhadores'
        }`;

  const nextContestNumber = lottery.proximoConcurso
    ? formatNumber(lottery.proximoConcurso)
    : '—';
  const nextContestDate = lottery.dataProximoConcurso
    ? formatDate(lottery.dataProximoConcurso)
    : '—';
  const nextContestPrize = formatCurrencyBRL(lottery.valorEstimadoProximoConcurso);

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={`Confira os resultados do concurso ${lottery.concurso} da ${lottery.nome}, realizado em ${formattedDate}. Números sorteados, ganhadores e prêmios.`}
        canonical={canonicalUrl}
        url={canonicalUrl}
      />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <article>
          <header className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg">
            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              {lottery.nome}
            </h1>
            <p className="mt-2 text-lg opacity-95">
              Concurso {formatNumber(lottery.concurso)} • {formattedDate}
            </p>
          </header>

          <section className="space-y-6">
            <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Números sorteados
              </h2>
              <NumbersPills
                numbers={lottery.dezenas}
                size="lg"
                ariaLabel={`Números sorteados do concurso ${lottery.concurso}`}
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

            {lottery.premiacoes && lottery.premiacoes.length > 0 && (
              <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Premiação completa
                </h2>
                <PrizeTable tiers={lottery.premiacoes} caption={`Premiação do concurso ${lottery.concurso}`} />
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

            <div className="mt-8 text-center">
                <Link
                    href={`/`}
                    className="inline-flex items-center justify-center rounded-lg border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                    Voltar para a página inicial
                </Link>
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = LOTTERY_SLUGS.map((slug) => ({
    params: { loteriaSlug: slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<LotteryPageProps> = async (context) => {
  const slugParam = context.params?.loteriaSlug;
  const slug = typeof slugParam === 'string' ? (slugParam.toLowerCase() as LotterySlug) : null;

  if (!slug || !LOTTERY_SLUGS.includes(slug)) {
    return { notFound: true };
  }

  try {
    const result = await lotteryApi.getLatestByLottery(slug);
    return {
      props: {
        lottery: result.data,
      },
      revalidate: 60, // Revalida a cada 60 segundos
    };
  } catch (error) {
    console.error(`[${slug}] Erro ao obter o último concurso:`, error);
    return {
      props: {
        lottery: null,
      },
      revalidate: 10, // Tenta revalidar antes se houver erro
    };
  }
};

export default LotteryPage;
