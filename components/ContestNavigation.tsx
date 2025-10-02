import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/services/lotteryApi';

interface ContestNavigationProps {
  lottery: string;
  currentContest: number;
  nextContest?: number;
  nextDate?: string;
  estimatedPrize?: number;
}

export default function ContestNavigation({
  lottery,
  currentContest,
  nextContest,
  nextDate,
  estimatedPrize,
}: ContestNavigationProps) {
  return (
    <div className="space-y-6">
      {/* Navegação de Concursos */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            {currentContest > 1 ? (
              <Link className="flex-1" href={`/${lottery}/concurso/${currentContest - 1}`}>
                <Button className="w-full gap-2" variant="outline">
                  <ChevronLeft className="w-4 h-4" />
                  Concurso Anterior
                </Button>
              </Link>
            ) : (
              <Button className="w-full gap-2" disabled variant="outline">
                <ChevronLeft className="w-4 h-4" />
                Concurso Anterior
              </Button>
            )}

            <Link className="flex-1" href={`/${lottery}/concurso/${currentContest + 1}`}>
              <Button className="w-full gap-2" variant="outline">
                Concurso Seguinte
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Próximo Concurso */}
      {nextContest && nextDate && (
        <Card className="bg-gradient-card border-primary/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-primary">
                <TrendingUp className="w-5 h-5" />
                <p className="font-semibold">Próximo Concurso</p>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {nextContest}
              </p>
              <p className="text-muted-foreground">{nextDate}</p>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">Prêmio Estimado</p>
                <p className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                  {formatCurrency(estimatedPrize)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Link para Página da Loteria */}
      <Link href={`/${lottery}`}>
        <Button className="w-full" variant="outline">
          Ver Todos os Resultados da {lottery}
        </Button>
      </Link>
    </div>
  );
}
