import type { Dispatch, SetStateAction } from 'react';
import { LotteryResult, LOTTERY_SLUGS } from '@/types/lottery';

export interface HomeProps {
  resultados: LotteryResult[];
}

export const CardSkeleton = () => (
  <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200"></div>
);

export const handlePageRefresh = (setIsRefreshing: Dispatch<SetStateAction<boolean>>) => () => {
  setIsRefreshing(true);
  window.location.reload();
};

export { LOTTERY_SLUGS };
