import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/services/lotteryApi';
import { Link } from 'react-router-dom';

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
            <Link to={`/${lottery}/concurso-${currentContest - 1}`} className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <ChevronLeft className="w-4 h-4" />
                Concurso Anterior
              </Button>
            </Link>
            
            <Link to={`/${lottery}/concurso-${currentContest + 1}`} className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                Concurso Seguinte
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Próximo Concurso */}
      {nextContest && nextDate && estimatedPrize && (
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
      <Link to={`/${lottery}`}>
        <Button variant="outline" className="w-full">
          Ver Todos os Resultados da {lottery}
        </Button>
      </Link>
    </div>
  );
}
