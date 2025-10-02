import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/services/lotteryApi';

interface ContestNavigationProps {
  lottery: string;
  currentContest: number;
  nextContest?: { contest: number; prize: number };
  previousContest?: number;
}

const ContestNavigation = ({
  lottery,
  currentContest,
  nextContest,
  previousContest,
}: ContestNavigationProps) => {
  return (
    <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-md">
      {/* Previous Contest Button */}
      {previousContest ? (
        <Link href={`/${lottery}/concurso/${previousContest}`} passHref>
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
        </Link>
      ) : (
        <Button variant="outline" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
      )}

      {/* Next Contest Info */}
      <div className="text-center">
        {nextContest ? (
          <>
            <p className="text-sm text-gray-600">Próximo Concurso: {nextContest.contest}</p>
            <p className="font-bold text-green-600 flex items-center justify-center">
              <TrendingUp className="mr-1 h-5 w-5" />
              {formatCurrency(nextContest.prize)}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500">Este é o concurso mais recente.</p>
        )}
      </div>

      {/* Next Contest Button */}
      {nextContest ? (
        <Link href={`/${lottery}/concurso/${nextContest.contest}`} passHref>
          <Button variant="outline">
            Próximo
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" disabled>
          Próximo
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ContestNavigation;
