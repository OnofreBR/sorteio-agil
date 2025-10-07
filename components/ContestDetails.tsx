import { LotteryResult } from '@/types/lottery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Calendar, MapPin, TrendingUp, Users } from 'lucide-react';

interface ContestDetailsProps {
  result: LotteryResult;
  lotteryColor: string;
}

export default function ContestDetails({ result, lotteryColor }: ContestDetailsProps) {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      'lottery-megasena': 'from-lottery-megasena/20 to-lottery-megasena/5 border-lottery-megasena/30',
      'lottery-quina': 'from-lottery-quina/20 to-lottery-quina/5 border-lottery-quina/30',
      'lottery-lotofacil': 'from-lottery-lotofacil/20 to-lottery-lotofacil/5 border-lottery-lotofacil/30',
      'lottery-lotomania': 'from-lottery-lotomania/20 to-lottery-lotomania/5 border-lottery-lotomania/30',
      'lottery-timemania': 'from-lottery-timemania/20 to-lottery-timemania/5 border-lottery-timemania/30',
      'lottery-dupla': 'from-lottery-dupla/20 to-lottery-dupla/5 border-lottery-dupla/30',
      'lottery-diadesorte': 'from-lottery-diadesorte/20 to-lottery-diadesorte/5 border-lottery-diadesorte/30',
      'lottery-supersete': 'from-lottery-supersete/20 to-lottery-supersete/5 border-lottery-supersete/30',
      'lottery-federal': 'from-lottery-federal/20 to-lottery-federal/5 border-lottery-federal/30',
      'lottery-maismilionaria': 'from-lottery-maismilionaria/20 to-lottery-maismilionaria/5 border-lottery-maismilionaria/30',
    };
    return colorMap[color] || colorMap['lottery-megasena'];
  };

  const location = (result as any).location ?? (result as any).local ?? null;
  const contestDate = (result as any).contestDate ?? result.data;
  const prizeTiers = ((result as any).prizeTiers ?? result.premiacao) || [];
  const numbers = ((result as any).numbers ?? result.dezenas) || [];
  const states = ((result as any).winnerLocales ?? result.local_ganhadores) || [];
  const accumulated = (result as any).accumulated ?? (result as any).acumulou ?? false;

  return (
    <div className="space-y-6">
      {/* Números Sorteados */}
      <Card className={`bg-gradient-to-br ${getColorClasses(lotteryColor)} border shadow-lottery`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5" />
            Números Sorteados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 justify-center">
            {numbers.map((number: any, index: number) => (
              <div
                key={index}
                className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center text-white font-bold text-xl shadow-glow animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {number}
              </div>
            ))}
          </div>
          
          {result.trevos && result.trevos.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2 text-center">Trevos da Sorte</p>
              <div className="flex gap-3 justify-center">
                {result.trevos.map((trevo, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-foreground font-bold text-lg"
                  >
                    {trevo}
                  </div>
                ))}
              </div>
            </div>
          )}

          {Boolean((result as any).mesSorte) && (
            <div className="mt-6 text-center">
              <Badge variant="secondary" className="text-base px-4 py-2">
                Mês da Sorte: {(result as any).mesSorte}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações do Sorteio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Informações do Sorteio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm">Data do Sorteio</p>
              <p className="font-semibold text-foreground">{formatDate(contestDate)}</p>
              </div>
            </div>

          {location && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm">Local</p>
                <p className="font-semibold text-foreground">{location}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 text-muted-foreground">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm">Status</p>
              <Badge variant={accumulated ? 'destructive' : 'default'}>
                {accumulated ? 'Acumulou' : 'Com Ganhadores'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição de Prêmios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Distribuição de Prêmios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prizeTiers.map((prize: any, index: number) => {
              const winners = prize.ganhadores ?? prize.winners;
              const amount = prize.valorPremio ?? prize.amount;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{prize.descricao ?? prize.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {winners !== undefined && winners !== null
                        ? `${winners} ${winners === 1 ? 'ganhador' : 'ganhadores'}`
                        : '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-foreground">
                      {amount !== null && amount !== undefined ? formatCurrency(amount) : '—'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {states && states.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Estados Premiados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {states.map((estado: any, index: number) => {
                const label =
                  typeof estado === 'string'
                    ? estado
                    : estado.uf
                    ? `${estado.cidade ? `${estado.cidade} - ` : ''}${estado.uf}`
                    : estado.cidade ?? '—';
                return (
                  <Badge key={index} variant="outline">
                    {label}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {result.observacao && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{result.observacao}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
