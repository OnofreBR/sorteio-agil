/**
 * Normalização dos campos recebidos da API (documentação nas imagens "APILoterias-*.png"):
 * - "nome" → lotteryName
 * - "numero_concurso" → contestNumber
 * - "data_concurso" / "data_concurso_milliseconds" → contestDate / contestDateMillis
 * - "local_realizacao" → location
 * - "acumulou" → accumulated
 * - "valor_acumulado" → accumulatedValue
 * - "dezenas", "dezenas_2" (Dupla Sena) → numbers / numbersSecondDraw
 * - "premiacao" ( + "premiacao_2" ) → prizeTiers
 *   • subcampos: nome, quantidade_ganhadores, valor_total, acertos
 * - "local_ganhadores" → winnerLocales (local, cidade, uf, quantidade_ganhadores, canal_eletronico)
 * - "arrecadacao_total" → totalCollected
 * - "data_proximo_concurso" / "data_proximo_concurso_milliseconds" → nextContest.date / nextContest.dateMillis
 * - "valor_estimado_proximo_concurso" → nextContest.estimatedPrize
 * - "valor_final_concurso_acumulado" → nextContest.accumulatedFinalZero
 * - "numero_final_concurso_acumulado" → nextContest.finalZeroContestNumber
 * - "valor_acumulado_especial" → nextContest.specialAccumulated
 * - "nome_acumulado_especial" → nextContest.specialName
 */

export interface PrizeTier {
  name: string;
  hits: number | null;
  winners: number | null;
  amount: number | null;
}

export interface WinnerLocale {
  description: string | null;
  city: string | null;
  state: string | null;
  winners: number | null;
  isElectronic: boolean;
}

export interface NextContestInfo {
  number?: number | null;
  date?: string | null; // ISO string
  dateMillis?: number | null;
  estimatedPrize?: number | null;
  accumulatedFinalZero?: number | null;
  finalZeroContestNumber?: number | null;
  specialAccumulated?: number | null;
  specialName?: string | null;
}

export interface LotteryResult {
  lotterySlug: string;
  lotteryName: string;
  contestNumber: number;
  contestDate: string; // ISO
  contestDateMillis: number | null;
  location: string | null;
  accumulated: boolean;
  accumulatedValue: number | null;
  numbers: string[];
  secondDrawNumbers?: string[]; // Dupla Sena segundo sorteio
  trevos?: string[]; // +Milionária (trevos da sorte) - normalizado como strings
  mesSorte?: string | null; // Dia de Sorte (nome do mês)
  totalCollected: number | null;
  prizeTiers: PrizeTier[];
  mainPrize: number | null;
  mainWinners: number | null;
  nextContest: NextContestInfo;
  winnerLocales: WinnerLocale[];
  rateioEmProcessamento: boolean;

  /**
   * Campos legados mantidos como opcionais para compatibilidade com módulos antigos.
   * Novas implementações devem utilizar apenas as chaves padronizadas acima.
   */
  loteria?: string;
  concurso?: number;
  data?: string;
  dezenasOrdemSorteio?: number[];
  dezenas?: number[];
  trevos?: number[];
  premiacoes?: any;
  estadosPremiados?: string[];
  observacao?: string;
  proximoConcurso?: number;
  dataProximoConcurso?: string;
  valorEstimadoProximoConcurso?: number;
}

export interface LotterySummary extends LotteryResult {
  // alias para clareza sem campos extras
}

export type LotterySlug =
  | 'megasena'
  | 'quina'
  | 'lotofacil'
  | 'lotomania'
  | 'duplasena'
  | 'timemania'
  | 'diadesorte'
  | 'supersete'
  | 'maismilionaria'
  | 'federal'
  | 'loteca';

export interface ContestNavigationInfo {
  previousContest?: number | null;
  nextContest?: number | null;
}

export interface LotteryInfo {
  name: string;
  slug: string;
  color: string;
  hexColor: string;
  description: string;
  drawDays: string[];
  minNumber: number;
  maxNumber: number;
  numbersDrawn: number;
}

export const LOTTERY_MAP: Record<string, LotteryInfo> = {
  megasena: {
    name: 'Mega-Sena',
    slug: 'megasena',
    color: 'lottery-megasena',
    hexColor: '#209869',
    description: 'Sorteios às quartas e sábados.',
    drawDays: ['Quarta-feira', 'Sábado'],
    minNumber: 1,
    maxNumber: 60,
    numbersDrawn: 6,
  },
  quina: {
    name: 'Quina',
    slug: 'quina',
    color: 'lottery-quina',
    hexColor: '#260085',
    description: 'Sorteios de segunda a sábado.',
    drawDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    minNumber: 1,
    maxNumber: 80,
    numbersDrawn: 5,
  },
  lotofacil: {
    name: 'Lotofácil',
    slug: 'lotofacil',
    color: 'lottery-lotofacil',
    hexColor: '#930089',
    description: 'Sorteios de segunda a sábado.',
    drawDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    minNumber: 1,
    maxNumber: 25,
    numbersDrawn: 15,
  },
  lotomania: {
    name: 'Lotomania',
    slug: 'lotomania',
    color: 'lottery-lotomania',
    hexColor: '#F78100',
    description: 'Sorteios às terças, quintas e sábados.',
    drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
    minNumber: 0,
    maxNumber: 99,
    numbersDrawn: 20,
  },
  duplasena: {
    name: 'Dupla Sena',
    slug: 'duplasena',
    color: 'lottery-dupla',
    hexColor: '#B70027',
    description: 'Dois sorteios às terças, quintas e sábados.',
    drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
    minNumber: 1,
    maxNumber: 50,
    numbersDrawn: 6,
  },
  federal: {
    name: 'Loteria Federal',
    slug: 'federal',
    color: 'lottery-federal',
    hexColor: '#2B388F',
    description: 'Tradicional loteria de bilhetes, sorteios aos sábados.',
    drawDays: ['Sábado'],
    minNumber: 0,
    maxNumber: 99999,
    numbersDrawn: 5,
  },
  timemania: {
    name: 'Timemania',
    slug: 'timemania',
    color: 'lottery-timemania',
    hexColor: '#006600',
    description: 'Sorteios às terças, quintas e sábados.',
    drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
    minNumber: 1,
    maxNumber: 80,
    numbersDrawn: 7,
  },
  diadesorte: {
    name: 'Dia de Sorte',
    slug: 'diadesorte',
    color: 'lottery-diadesorte',
    hexColor: '#DF9B10',
    description: 'Inclui o Mês da Sorte, sorteios às terças, quintas e sábados.',
    drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
    minNumber: 1,
    maxNumber: 31,
    numbersDrawn: 7,
  },
  supersete: {
    name: 'Super Sete',
    slug: 'supersete',
    color: 'lottery-supersete',
    hexColor: '#E56C17',
    description: 'Sorteios às segundas, quartas e sextas.',
    drawDays: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'],
    minNumber: 0,
    maxNumber: 9,
    numbersDrawn: 7,
  },
  maismilionaria: {
    name: '+Milionária',
    slug: 'maismilionaria',
    color: 'lottery-maismilionaria',
    hexColor: '#00703C',
    description: 'Inclui trevos da sorte; sorteios aos sábados.',
    drawDays: ['Sábado'],
    minNumber: 1,
    maxNumber: 50,
    numbersDrawn: 6,
  },
  loteca: {
    name: 'Loteca',
    slug: 'loteca',
    color: 'lottery-federal',
    hexColor: '#2B388F',
    description: 'Apostas esportivas com 14 jogos.',
    drawDays: ['Sábado'],
    minNumber: 1,
    maxNumber: 14,
    numbersDrawn: 14,
  },
};
