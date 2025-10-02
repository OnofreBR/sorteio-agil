import { LotteryResult } from '@/types/lottery';
import { getMockLotteryResult, getAllMockResults } from './mockData';

const API_URL = 'https://apiloterias.com.br/app';
const API_TOKEN = 'JY8FOJADU04L1YQ';
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
  
  const normalizedName = nome.toUpperCase().trim();
  return nameMap[normalizedName] || nome.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Transform API response to our expected format
function transformApiResponse(apiData: any): LotteryResult {
  const slug = getLotterySlugFromName(apiData.nome || apiData.loteria || '');
  
  // Format date from ISO to DD/MM/YYYY
  const formatDate = (isoDate: string): string => {
    if (!isoDate) return '';
    if (isoDate.includes('/')) return isoDate; // Already formatted
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Transform prizes from API format to our format
  const transformPremiacoes = (premiacao: any): any[] => {
    if (!premiacao) return [];
    
    // Handle array format (already correct)
    if (Array.isArray(premiacao)) {
      return premiacao.map((p: any, index: number) => ({
        descricao: p.descricao || p.nome || `Faixa ${index + 1}`,
        faixa: p.faixa || index + 1,
        ganhadores: p.ganhadores || p.quantidade_ganhadores || 0,
        valorPremio: p.valorPremio || p.valor_total || 0,
      }));
    }
    
    // Handle single object format from API
    if (premiacao.faixas && Array.isArray(premiacao.faixas)) {
      return premiacao.faixas.map((p: any, index: number) => ({
        descricao: p.nome || p.descricao || `Faixa ${index + 1}`,
        faixa: index + 1,
        ganhadores: p.quantidade_ganhadores || p.ganhadores || 0,
        valorPremio: p.valor_total || p.valorPremio || 0,
      }));
    }
    
    return [];
  };

  return {
    loteria: slug,
    concurso: apiData.concurso || apiData.numero_concurso || 0,
    data: formatDate(apiData.data || apiData.data_concurso || ''),
    local: apiData.local || apiData.local_sorteio || '',
    dezenasOrdemSorteio: apiData.dezenasOrdemSorteio || apiData.dezenas_ordem_sorteio || apiData.dezenas || [],
    dezenas: apiData.dezenas || [],
    trevos: apiData.trevos || apiData.trevosSorteados || undefined,
    mesSorte: apiData.mesSorte || apiData.nome_mes_sorte || undefined,
    premiacoes: transformPremiacoes(apiData.premiacoes || apiData.premiacao),
    estadosPremiados: apiData.estadosPremiados || apiData.estados_premiados || undefined,
    observacao: apiData.observacao || apiData.nome_time_coracao || undefined,
    acumulou: apiData.acumulou ?? (apiData.premiacoes?.[0]?.ganhadores === 0 || apiData.premiacao?.faixas?.[0]?.quantidade_ganhadores === 0),
    proximoConcurso: apiData.proximoConcurso || apiData.concurso_proximo || 0,
    dataProximoConcurso: formatDate(apiData.dataProximoConcurso || apiData.data_proximo_concurso || ''),
    valorEstimadoProximoConcurso: apiData.valorEstimadoProximoConcurso || apiData.valor_estimado_proximo_concurso || 0,
  };
}

function buildUrl(endpoint: string): string {
  const separator = endpoint.includes('?') ? '&' : '?';
  const cacheBuster = Date.now();
  return `${API_URL}${endpoint}${separator}token=${API_TOKEN}&_=${cacheBuster}`;
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const url = buildUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn(`API error: ${response.status} - ${url}`);
      throw new LotteryApiError(
        `Erro ao buscar dados: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    
    // Transform API response to our expected format
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return transformApiResponse(data) as T;
    }
    
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

  return await fetchApi<LotteryResult>(`/resultado?loteria=${lottery}`);
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

  return await fetchApi<LotteryResult>(`/resultado?loteria=${lottery}&concurso=${contest}`);
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
    'loteca',
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
