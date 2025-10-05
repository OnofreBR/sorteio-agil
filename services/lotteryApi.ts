import { LotteryResult } from '@/types/lottery';
import { getMockLotteryResult, getAllMockResults } from './mockData';

// Use environment variables for API configuration
const RESULTS_API_URL = process.env.NEXT_PUBLIC_RESULTS_API_URL || process.env.RESULTS_API_URL;
const RESULTS_API_TOKEN = process.env.NEXT_PUBLIC_RESULTS_API_TOKEN || process.env.RESULTS_API_TOKEN;
const USE_MOCK_DATA = false; // Using real API data

export class LotteryApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'LotteryApiError';
  }
}

// Map API lottery names to slugs
function getLotterySlugFromName(nome: string): string {
  const nameMap: Record<string, string> = {
    'MEGA-SENA': 'megasena',
    'MEGA SENA': 'megasena',
    'QUINA': 'quina',
    'LOTOFÁCIL': 'lotofacil',
    'LOTOFACIL': 'lotofacil',
    'LOTOMANIA': 'lotomania',
    'DUPLA-SENA': 'duplasena',
    'DUPLA SENA': 'duplasena',
    'FEDERAL': 'federal',
    'TIMEMANIA': 'timemania',
    'DIA DE SORTE': 'diadesorte',
    'SUPER SETE': 'supersete',
    'SUPERSETE': 'supersete',
    '+MILIONÁRIA': 'maismilionaria',
    'MAIS MILIONARIA': 'maismilionaria',
    'LOTECA': 'loteca',
  };
  
  return nameMap[nome.toUpperCase()] || nome.toLowerCase().replace(/[^a-z]/g, '');
}

export async function getLotteryResults(lottery: string, limit: number = 1): Promise<LotteryResult[]> {
  if (USE_MOCK_DATA) {
    const result = getMockLotteryResult(lottery);
    return result ? [result] : [];
  }

  if (!RESULTS_API_URL || !RESULTS_API_TOKEN) {
    throw new LotteryApiError('API configuration is missing. Please set NEXT_PUBLIC_RESULTS_API_URL and NEXT_PUBLIC_RESULTS_API_TOKEN environment variables.');
  }

  try {
    const url = `${RESULTS_API_URL}/resultado?loteria=${lottery}&token=${RESULTS_API_TOKEN}&concurso=latest`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new LotteryApiError(
        `Failed to fetch lottery results: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      throw new LotteryApiError('Invalid response format from API');
    }

    // Return the complete API response - it already includes all fields
    // dezenas, premiacoes (all prize tiers), acumulado, próximo concurso, etc.
    const result: LotteryResult = {
      ...data,
      loteria: getLotterySlugFromName(data.nome || lottery)
    };

    return [result];
  } catch (error) {
    if (error instanceof LotteryApiError) {
      throw error;
    }
    throw new LotteryApiError(
      `Error fetching lottery results: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getResultByContest(lottery: string, contest: string): Promise<LotteryResult | null> {
  if (!RESULTS_API_URL || !RESULTS_API_TOKEN) {
    throw new LotteryApiError('API configuration is missing. Please set NEXT_PUBLIC_RESULTS_API_URL and NEXT_PUBLIC_RESULTS_API_TOKEN environment variables.');
  }

  try {
    const url = `${RESULTS_API_URL}/resultado?loteria=${lottery}&token=${RESULTS_API_TOKEN}&concurso=${contest}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new LotteryApiError(
        `Failed to fetch lottery results: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      return null;
    }

    // Return the complete API response with all fields
    const result: LotteryResult = {
      ...data,
      loteria: getLotterySlugFromName(data.nome || lottery)
    };

    return result;
  } catch (error) {
    if (error instanceof LotteryApiError) {
      throw error;
    }
    return null;
  }
}

export async function getAllLotteryResults(): Promise<LotteryResult[]> {
  if (USE_MOCK_DATA) {
    return getAllMockResults();
  }

  if (!RESULTS_API_URL || !RESULTS_API_TOKEN) {
    throw new LotteryApiError('API configuration is missing. Please set NEXT_PUBLIC_RESULTS_API_URL and NEXT_PUBLIC_RESULTS_API_TOKEN environment variables.');
  }

  // Include ALL Brazilian national lotteries
  const lotteries = [
    'megasena',
    'quina',
    'lotofacil',
    'lotomania',
    'duplasena',
    'federal',
    'timemania',
    'diadesorte',
    'supersete',
    'maismilionaria',
    'loteca'
  ];

  const results = await Promise.allSettled(
    lotteries.map(lottery => getLotteryResults(lottery, 1))
  );

  return results
    .filter((result): result is PromiseFulfilledResult<LotteryResult[]> => result.status === 'fulfilled')
    .flatMap(result => result.value);
}

// Utility functions
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}
