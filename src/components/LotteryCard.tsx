import Link from 'next/link';
import NumbersPills from '@/components/NumbersPills';
import { LotteryResult } from '@/types/lottery';
import { formatCurrencyBRL, formatDate, formatNumber } from '@/utils/formatters';

interface LotteryCardProps {
  result: LotteryResult;
}

const LotteryCard = ({ result }: LotteryCardProps) => {
  const mainPrize = result.premiacoes?.[0];

  const missingFields: string[] = [];
  if (!result.loteria) missingFields.push('nome');
  if (!result.concurso) missingFields.push('numero_concurso');
  if (!result.data) missingFields.push('data_concurso');
  if (!result.dezenas.length) missingFields.push('dezenas');
  if (!mainPrize) missingFields.push('premiacao[0]');

  if (missingFields.length) {
    console.warn(`[${result.loteria}] Campos ausentes: ${missingFields.join(', ')}`);
  }

  const formattedDate = formatDate(result.data) || '—';
  const prizeLabel = mainPrize?.valorPremio ? formatCurrencyBRL(mainPrize.valorPremio) : '—';
  const winnersLabel =
    mainPrize?.ganhadores === null
      ? '—'
      : mainPrize?.ganhadores === 0
      ? 'Acumulou'
      : formatNumber(mainPrize?.ganhadores ?? 0);

  const nextContestNumber = result.proximoConcurso ?? null;
  const nextContestDate = result.dataProximoConcurso ? formatDate(result.dataProximoConcurso) : '—';
  const nextContestPrize =
    result.valorEstimadoProximoConcurso !== null && result.valorEstimadoProximoConcurso !== undefined
      ? formatCurrencyBRL(result.valorEstimadoProximoConcurso)
      : '—';

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-md transition-shadow duration-200 hover:shadow-lg">
      <header className="flex items-center justify-between bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-4 text-white">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold leading-tight tracking-tight">{result.nome}</h2>
          <p className="mt-1 text-sm opacity-90">
            Concurso {formatNumber(result.concurso)} • {formattedDate}
          </p>
        </div>
      </header>

      <section className="space-y-4 p-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Números sorteados</p>
          <NumbersPills numbers={result.dezenas} ariaLabel={`Números sorteados da ${result.nome}`} />

          {result.dezenasOrdemSorteio && result.dezenasOrdemSorteio.length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Segundo sorteio</p>
              <NumbersPills 
                numbers={result.dezenasOrdemSorteio}
                variant="secondary"
                ariaLabel={`Segundo sorteio da ${result.nome}`}
              />
            </div>
          ) : null}

          {(result.trevos ?? []).length > 0 ? (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trevos</p>
              <NumbersPills 
                numbers={result.trevos ?? []}
                variant="secondary"
                ariaLabel={`Trevos sorteados da ${result.nome}`}
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
          href={`/${result.loteria}/concurso-${result.concurso}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition-transform duration-150 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          Ver detalhes do concurso
        </Link>
      </footer>
    </article>
  );
};

export default LotteryCard;
