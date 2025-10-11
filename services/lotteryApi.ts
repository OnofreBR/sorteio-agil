import { LotteryResult, Prize, CidadePremiada, RateioCidade } from '@/src/types/lottery';
import { getMockLotteryResult, getAllMockResults } from './mockData';

// Remove keys with undefined values recursively to satisfy Next.js JSON serialization
export function sanitizeForNext<T>(value: T): T {
  if (Array.isArray(value)) {
    // @ts-expect-error - Recursive type inference not supported
    return value.map((v) => sanitizeForNext(v)) as unknown as T;
  }

  if (value && typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value as Record<string, any>)) {
      if (v === undefined) continue;
      out[k] = sanitizeForNext(v);
    }
    return out as unknown as T;
  }

  // primitives (including null) returned as-is
  return value;
}

// Use server-side environment variables only (no NEXT_PUBLIC_)
const RESULTS_API_URL = process.env.RESULTS_API_URL;
const RESULTS_API_TOKEN = process.env.RESULTS_API_TOKEN;
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

// Map API response to LotteryResult type with proper field mapping
function mapApiResponseToLotteryResult(data: any, lottery: string): LotteryResult {
  // Map prize tiers (premiacoes/faixas) properly
  const premiacoes: Prize[] = [];
  
  if (data.premiacoes && Array.isArray(data.premiacoes)) {
    data.premiacoes.forEach((premio: any) => {
      premiacoes.push({
        descricao: premio.descricao || premio.nome || premio.faixa || '',
        faixa: premio.faixa || premio.nivel || 0,
        ganhadores: premio.ganhadores || premio.numero_ganhadores || 0,
        valorPremio: premio.valorPremio || premio.valor_premio || premio.premio || 0,
      });
    });
  } else if (data.faixas && Array.isArray(data.faixas)) {
    data.faixas.forEach((faixa: any) => {
      premiacoes.push({
        descricao: faixa.descricao || faixa.nome || faixa.faixa || '',
        faixa: faixa.faixa || faixa.nivel || 0,
        ganhadores: faixa.ganhadores || faixa.numero_ganhadores || 0,
        valorPremio: faixa.valorPremio || faixa.valor_premio || faixa.premio || 0,
      });
    });
  }

  // Map cidadesPremiadas if available
  const cidadesPremiadas: CidadePremiada[] =
    data.cidadesPremiadas && Array.isArray(data.cidadesPremiadas)
      ? data.cidadesPremiadas.map((cidade: any) => ({
          cidade: cidade.cidade || cidade.nome || '',
          uf: cidade.uf || cidade.estado || '',
          ganhadores: cidade.ganhadores || cidade.numero_ganhadores || 0,
          posicao: cidade.posicao || cidade.faixa || undefined,
        }))
      : [];

  // Map rateioCidades if available
  const rateioCidades: RateioCidade[] =
    data.rateioCidades && Array.isArray(data.rateioCidades)
      ? data.rateioCidades.map((rateio: any) => ({
          cidade: rateio.cidade || rateio.nome || '',
          uf: rateio.uf || rateio.estado || '',
          valor: rateio.valor || rateio.valorPremio || 0,
          ganhadores: rateio.ganhadores || rateio.numero_ganhadores || undefined,
        }))
      : [];

  // Build complete LotteryResult with all possible field mappings from API
  const result: LotteryResult = {
    loteria: getLotterySlugFromName(data.nome || data.loteria || lottery),
    concurso: data.concurso || data.numero_concurso || data.numero || 0,
    data: data.data || data.data_sorteio || data.dataSorteio || '',
    local: data.local || data.local_sorteio || data.localSorteio || '',
    dezenasOrdemSorteio: data.dezenasOrdemSorteio || data.dezenas_ordem_sorteio || data.ordemSorteio || data.dezenas || [],
    dezenas: data.dezenas || data.numeros || data.numerosSorteados || [],
    // Avoid undefined in optional array fields: use []
    trevos: Array.isArray(data.trevos || data.trevos_sorteados || data.trevosSorteados)
      ? (data.trevos || data.trevos_sorteados || data.trevosSorteados)
      : [],
    mesSorte: data.mesSorte || data.mes_sorte || data.mesDaSorte || undefined,
    premiacoes: premiacoes,
    estadosPremiados: Array.isArray(data.estadosPremiados || data.estados_premiados || data.estadosSorteados)
      ? (data.estadosPremiados || data.estados_premiados || data.estadosSorteados)
      : [],
    observacao: data.observacao || data.obs || data.time || data.time_coracao || data.timeCoracao || undefined,
    acumulou: data.acumulou || data.acumulado || false,
    proximoConcurso: data.proximoConcurso || data.proximo_concurso || data.numeroConcursoProximo || 0,
    dataProximoConcurso: data.dataProximoConcurso || data.data_proximo_concurso || data.dataProximoSorteio || '',
    valorEstimadoProximoConcurso: data.valorEstimadoProximoConcurso || data.valor_estimado_proximo_concurso || data.valorProximoConcurso || 0,
    // Additional fields from API
    valorAcumulado: data.valorAcumulado || data.valor_acumulado || undefined,
    acumuladoConcursoEspecial: data.acumuladoConcursoEspecial || data.acumulado_concurso_especial || undefined,
    valorAcumuladoConcursoEspecial: data.valorAcumuladoConcursoEspecial || data.valor_acumulado_concurso_especial || undefined,
    valorAcumuladoConcurso_0_5: data.valorAcumuladoConcurso_0_5 || data.valor_acumulado_concurso_0_5 || undefined,
    valorArrecadado: data.valorArrecadado || data.valor_arrecadado || data.arrecadacao || undefined,
    cidadesPremiadas: cidadesPremiadas,
    rateioCidades: rateioCidades,
    nome: data.nome || undefined,
    numeroConcursoProximo: data.numeroConcursoProximo || data.numero_concurso_proximo || undefined,
    numeroConcursoAnterior: data.numeroConcursoAnterior || data.numero_concurso_anterior || undefined,
    valorEstimado: data.valorEstimado || data.valor_estimado || undefined,
  };

  // Remove undefined keys deeply to satisfy Next.js serialization
  return sanitizeForNext(result);
}

export async function getLotteryResults(lottery: string, limit: number = 1): Promise<LotteryResult[]> {
  if (USE_MOCK_DATA) {
    const result = getMockLotteryResult(lottery);
    return result ? [result] : [];
  }

  if (!RESULTS_API_URL || !RESULTS_API_TOKEN) {
    throw new LotteryApiError('API configuration is missing. Please check server configuration.');
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

    // Map API response to proper LotteryResult type
    const result = mapApiResponseToLotteryResult(data, lottery);
    return [sanitizeForNext(result)];
  } catch (error) {
    if (error instanceof LotteryApiError) {
      throw error;
    }
    throw new LotteryApiError(
      `Error fetching lottery results: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function getResultByContest(lottery: string, contest: string): Promise<any | null> {
  if (!RESULTS_API_URL || !RESULTS_API_TOKEN) {
    throw new LotteryApiError('API configuration is missing. Please check server configuration.');
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

    // Return the full API response with all fields (premiacoes, cidadesPremiadas, rateioCidades, arrecadacao, acumulado, etc)
    return data;
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
    throw new LotteryApiError('API configuration is missing. Please check server configuration.');
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

  const merged = results
    .filter((result): result is PromiseFulfilledResult<LotteryResult[]> => result.status === 'fulfilled')
    .flatMap(result => result.value);

  return sanitizeForNext(merged);
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
