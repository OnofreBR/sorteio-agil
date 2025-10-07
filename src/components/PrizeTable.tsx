import { PrizeTier } from '@/src/types/lottery';
import { formatCurrencyBRL, formatNumber } from '@/utils/formatters';

interface PrizeTableProps {
  tiers: PrizeTier[];
  caption?: string;
}

const PrizeTable = ({ tiers, caption }: PrizeTableProps) => {
  if (!tiers.length) {
    return <p className="text-sm text-muted-foreground">Sem detalhes de premiação disponíveis.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-border/60">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-muted/50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
              Acertos
            </th>
            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
              Faixa
            </th>
            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
              Ganhadores
            </th>
            <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
              Premiação (R$)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {tiers.map((tier, index) => (
            <tr key={`${tier.name}-${index}`} className="hover:bg-muted/40">
              <td className="px-4 py-3 text-sm font-medium text-foreground">
                {tier.hits !== null ? formatNumber(tier.hits) : '—'}
              </td>
              <td className="px-4 py-3 text-sm text-foreground">{tier.name || '—'}</td>
              <td className="px-4 py-3 text-sm text-foreground">
                {tier.winners !== null ? formatNumber(tier.winners) : '—'}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-foreground">
                {tier.amount !== null ? formatCurrencyBRL(tier.amount) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrizeTable;

