import { LotteryResult } from '@/types/lottery';

const API_URL = 'https://apiloterias.com.br/app';
const API_TOKEN = 'JY8FOJADU04L1YQ';

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
  return fetchApi<LotteryResult>(`/resultado?loteria=${lottery}`);
}

export async function getResultByContest(
  lottery: string,
  contest: number
): Promise<LotteryResult> {
  return fetchApi<LotteryResult>(`/resultado?loteria=${lottery}&concurso=${contest}`);
}

export async function getAllLatestResults(): Promise<LotteryResult[]> {
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

  const results = await Promise.allSettled(
    lotteries.map((lottery) => getLatestResult(lottery))
  );

  return results
    .filter((result): result is PromiseFulfilledResult<LotteryResult> => 
      result.status === 'fulfilled'
    )
    .map((result) => result.value);
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
