import Link from 'next/link';
import NumbersPills from '@/src/components/NumbersPills';
import { LotteryResult } from '@/src/types/lottery';
import { formatCurrencyBRL, formatDate, formatNumber } from '@/utils/formatters';

interface LotteryCardProps {
  result: LotteryResult;
}

const LotteryCard = ({ result }: LotteryCardProps) => {
  const missingFields: string[] = [];
  if (!result.lotteryName) missingFields.push('nome');
  if (!result.contestNumber) missingFields.push('numero_concurso');
  if (!result.contestDate) missingFields.push('data_concurso');
  if (!result.numbers.length) missingFields.push('dezenas');
  if (result.mainPrize === null) missingFields.push('premiacao[0].valor_total');

  if (missingFields.length) {
    console.warn(`[${result.lotterySlug}] Campos ausentes: ${missingFields.join(', ')}`);
  }

  const formattedDate = formatDate(result.contestDate) || '—';
  const prizeLabel = result.mainPrize !== null ? formatCurrencyBRL(result.mainPrize) : '—';
  const winnersLabel =
    result.mainWinners === null
      ? '—'
      : result.mainWinners === 0
      ? 'Acumulou'
      : formatNumber(result.mainWinners);

  const nextContestNumber = result.nextContest.number ?? null;
  const nextContestDate = result.nextContest.date ? formatDate(result.nextContest.date) : '—';
  const nextContestPrize =
    result.nextContest.estimatedPrize !== null && result.nextContest.estimatedPrize !== undefined
      ? formatCurrencyBRL(result.nextContest.estimatedPrize)
      : '—';

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-md transition-shadow duration-200 hover:shadow-lg">
      <header className="flex items-center justify-between bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-4 text-white">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold leading-tight tracking-tight">{result.lotteryName}</h2>
          <p className="mt-1 text-sm opacity-90">
            Concurso {formatNumber(result.contestNumber)} • {formattedDate}
          </p>
        </div>
      </header>

      <section className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Números sorteados</p>
          <NumbersPills numbers={result.numbers} ariaLabel={`Números sorteados da ${result.lotteryName}`} />

          {result.secondDrawNumbers && result.secondDrawNumbers.length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Segundo sorteio</p>
              <NumbersPills 
                numbers={result.secondDrawNumbers}
                variant="secondary"
                ariaLabel={`Segundo sorteio da ${result.lotteryName}`}
              />
            </div>
          ) : null}

          {(result.trevos ?? []).length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trevos</p>
              <NumbersPills 
                numbers={result.trevos ?? []}
                variant="secondary"
                ariaLabel={`Trevos sorteados da ${result.lotteryName}`}
              />
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prêmio principal</p>
            <p className="text-2xl font-bold text-foreground">{prizeLabel}</p>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ganhadores</p>
            <p className="text-2xl font-bold text-foreground">{winnersLabel}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Próximo concurso</p>
          <p className="text-sm text-muted-foreground">
            {nextContestNumber ? `Concurso ${formatNumber(nextContestNumber)} · ` : ''}
            {nextContestDate}
          </p>
          <p className="text-lg font-bold text-emerald-600">{nextContestPrize}</p>
        </div>
      </section>

      <footer className="mt-auto pt-6">
        <Link 
          href={`/${result.lotterySlug}/concurso-${result.contestNumber}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition-transform duration-150 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          Ver detalhes do concurso
        </Link>
      </footer>
    </article>
  );
};

export default LotteryCard;
