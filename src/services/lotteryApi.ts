import { LotteryResult } from '@/types/lottery';
import { getMockLotteryResult, getAllMockResults } from './mockData';

const API_URL = 'https://apiloterias.com.br/app';
const API_TOKEN = 'JY8FOJADU04L1YQ';
const USE_MOCK_DATA = true; // Set to false when API is working

export class LotteryApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'LotteryApiError';
  }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new LotteryApiError(
        `Erro ao buscar dados: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof LotteryApiError) {
      throw error;
    }
    throw new LotteryApiError('Erro ao conectar com a API');
  }
}

export async function getLatestResult(lottery: string): Promise<LotteryResult> {
  if (USE_MOCK_DATA) {
    const mockData = getMockLotteryResult(lottery);
    if (mockData) {
      return Promise.resolve(mockData);
    }
    throw new LotteryApiError('Loteria não encontrada');
  }

  try {
    return await fetchApi<LotteryResult>(`/resultado?loteria=${lottery}`);
  } catch (error) {
    // Fallback to mock data if API fails
    const mockData = getMockLotteryResult(lottery);
    if (mockData) {
      console.warn(`API failed, using mock data for ${lottery}`);
      return mockData;
    }
    throw error;
  }
}

export async function getResultByContest(
  lottery: string,
  contest: number
): Promise<LotteryResult> {
  if (USE_MOCK_DATA) {
    const mockData = getMockLotteryResult(lottery);
    if (mockData) {
      // Adjust contest number for mock data
      return Promise.resolve({ ...mockData, concurso: contest });
    }
    throw new LotteryApiError('Loteria não encontrada');
  }

  try {
    return await fetchApi<LotteryResult>(`/resultado?loteria=${lottery}&concurso=${contest}`);
  } catch (error) {
    // Fallback to mock data if API fails
    const mockData = getMockLotteryResult(lottery);
    if (mockData) {
      console.warn(`API failed, using mock data for ${lottery} contest ${contest}`);
      return { ...mockData, concurso: contest };
    }
    throw error;
  }
}

export async function getAllLatestResults(): Promise<LotteryResult[]> {
  if (USE_MOCK_DATA) {
    return Promise.resolve(getAllMockResults());
  }

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
  ];

  try {
    const results = await Promise.allSettled(
      lotteries.map((lottery) => getLatestResult(lottery))
    );

    const fulfilledResults = results
      .filter((result): result is PromiseFulfilledResult<LotteryResult> => 
        result.status === 'fulfilled'
      )
      .map((result) => result.value);

    // If no results, fallback to mock data
    if (fulfilledResults.length === 0) {
      console.warn('All API calls failed, using mock data');
      return getAllMockResults();
    }

    return fulfilledResults;
  } catch (error) {
    console.warn('Error fetching lottery results, using mock data');
    return getAllMockResults();
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateString: string): string {
  const [day, month, year] = dateString.split('/');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
