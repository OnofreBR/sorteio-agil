import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, DollarSign, Eye } from 'lucide-react';

interface LotteryCardProps {
  lottery: {
    name: string;
    slug: string;
    color: string;
    contest: number;
    date: string;
    numbers: number[];
    prize: string;
    winners: number;
    nextContest: number;
    nextDate: string;
    estimatedPrize: string;
    mesSorte?: string;
    trevos?: number[];
    observacao?: string;
  };
}

const LotteryCard = ({ lottery }: LotteryCardProps) => {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      'lottery-megasena': 'bg-[hsl(150,100%,20%)] hover:bg-[hsl(150,100%,25%)]',
      'lottery-quina': 'bg-[hsl(276,68%,34%)] hover:bg-[hsl(276,68%,39%)]',
      'lottery-lotofacil': 'bg-[hsl(25,91%,54%)] hover:bg-[hsl(25,91%,59%)]',
      'lottery-lotomania': 'bg-[hsl(207,100%,28%)] hover:bg-[hsl(207,100%,33%)]',
      'lottery-timemania': 'bg-[hsl(151,100%,29%)] hover:bg-[hsl(151,100%,34%)]',
      'lottery-dupla': 'bg-[hsl(358,77%,48%)] hover:bg-[hsl(358,77%,53%)]',
      'lottery-diadesorte': 'bg-[hsl(42,93%,53%)] hover:bg-[hsl(42,93%,58%)]',
      'lottery-supersete': 'bg-[hsl(281,47%,31%)] hover:bg-[hsl(281,47%,36%)]',
      'lottery-federal': 'bg-[hsl(220,72%,21%)] hover:bg-[hsl(220,72%,26%)]',
      'lottery-maismilionaria': 'bg-[hsl(280,72%,30%)] hover:bg-[hsl(280,72%,35%)]',
    };
    return colorMap[color] || 'bg-[hsl(150,100%,20%)] hover:bg-[hsl(150,100%,25%)]';
  };

  return (
    <Card className="group hover:shadow-lottery transition-all duration-300 bg-gradient-card border-border/50 hover:border-primary/20 overflow-hidden">
      {/* Header with gradient */}
      <div className={`${getColorClasses(lottery.color)} p-4 relative overflow-hidden transition-colors duration-300`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h3 className="text-xl font-bold">{lottery.name}</h3>
              <p className="text-white/90 text-sm">Concurso {lottery.contest}</p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Calendar className="w-3 h-3 mr-1" />
              {lottery.date}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Números sorteados */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Números Sorteados
          </h4>
          <div className="flex flex-wrap gap-2">
            {lottery.numbers?.map((number, index) => (
              lottery.slug === 'federal' ? (
                <div
                  key={index}
                  className="px-4 py-3 rounded-lg bg-gradient-hero text-primary-foreground font-bold text-xl flex items-center justify-center shadow-lottery animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {number.toString().padStart(5, '0')}
                </div>
              ) : (
                <div
                  key={index}
                  className="w-12 h-12 rounded-full bg-gradient-hero text-primary-foreground font-bold text-lg flex items-center justify-center shadow-lottery animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {number.toString().padStart(2, '0')}
                </div>
              )
            ))}
          </div>
        </div>

        {/* Trevos - Mais Milionária */}
        {lottery.trevos && lottery.trevos.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Trevos da Sorte
            </h4>
            <div className="flex flex-wrap gap-2">
              {lottery.trevos.map((trevo, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-full bg-gradient-gold text-secondary-foreground font-bold text-lg flex items-center justify-center shadow-glow animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {trevo.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mês da Sorte - Dia de Sorte */}
        {lottery.mesSorte && (
          <div className="bg-gradient-lottery rounded-lg p-4">
            <h4 className="text-sm font-medium text-primary-foreground uppercase tracking-wide mb-2">
              Mês da Sorte
            </h4>
            <p className="text-xl font-bold text-primary-foreground">{lottery.mesSorte}</p>
          </div>
        )}

        {/* Time do Coração - Timemania */}
        {lottery.slug === 'timemania' && lottery.observacao && (
          <div className="bg-gradient-lottery rounded-lg p-4">
            <h4 className="text-sm font-medium text-primary-foreground uppercase tracking-wide mb-2">
              Time do Coração
            </h4>
            <p className="text-xl font-bold text-primary-foreground">{lottery.observacao}</p>
          </div>
        )}

        {/* Informações do prêmio */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4 mr-1" />
              Prêmio
            </div>
            <p className="text-lg font-bold text-foreground">{lottery.prize}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Trophy className="w-4 h-4 mr-1" />
              Ganhadores
            </div>
            <p className="text-lg font-bold text-foreground">
              {lottery.winners === 0 ? 'Acumulou!' : lottery.winners}
            </p>
          </div>
        </div>

        {/* Próximo concurso */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h5 className="text-sm font-medium text-foreground">Próximo Concurso</h5>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Concurso {lottery.nextContest} • {lottery.nextDate}
              </p>
              <p className="text-lg font-bold text-primary">{lottery.estimatedPrize}</p>
            </div>
            {lottery.contest && lottery.contest > 0 ? (
              <Link to={`/${lottery.slug}/concurso-${lottery.contest}`}>
                <Button size="sm" variant="hero">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalhes
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LotteryCard;