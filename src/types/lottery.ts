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

export interface NextContest {
  contestNumber: number | null;
  date: string | null;
  dateMillis: number | null;
  estimatedPrize: number | null;
  accumulatedFinalZero: number | null;
  finalZeroContestNumber: number | null;
  specialAccumulated: number | null;
  specialName: string | null;
}

export type LotterySlug =
  | 'lotofacil'
  | 'megasena'
  | 'quina'
  | 'lotomania'
  | 'duplasena'
  | 'federal'
  | 'timemania'
  | 'diadesorte'
  | 'supersete'
  | 'maismilionaria'
  | 'loteca';

/**
 * Interface que unifica resultado de concurso passado + futuro estimado.
 * Engloba todos os campos retornados pela API real + campos planejados.
 */
export interface LotteryResult {
  lotteryName: string;
  lotterySlug: LotterySlug;
  contestNumber: number;
  contestDate: string | null;
  contestDateMillis: number | null;
  location: string | null;
  local?: string;
  accumulated: boolean | null;
  accumulatedValue: number | null;
  numbers: string[];
  numbersSecondDraw?: string[];
  prizeTiers: PrizeTier[];
  winnerLocales?: WinnerLocale[];
  totalCollected: number | null;
  nextContest?: NextContest;
  specialPrize?: number;
  favoriteTeam?: string;
  luckyMonth?: string;
  clovers?: string[];

  // Campos legados (podem ser removidos após migração)
  data?: string;
  local_realizacao?: string;
  valor_acumulado?: number;
  acumulou?: boolean;
  dezenas?: string[];
  dezenas_2?: string[];
  premiacao?: PrizeTier[];
  premiacao_2?: PrizeTier[];
  local_ganhadores?: WinnerLocale[];
  valor_estimado_proximo_concurso?: number;
}

export interface LotteryConfig {
  name: string;
  slug: LotterySlug;
  color: string;
  hexColor: string;
  description: string;
  drawDays: string[];
  minNumber: number;
  maxNumber: number;
  numbersDrawn: number;
}

export const lotteryConfigs: Record<LotterySlug, LotteryConfig> = {
  lotofacil: {
    name: 'Lotofácil',
    slug: 'lotofacil',
    color: 'lottery-lotofacil',
    hexColor: '#93268F',
    description: 'Sorteios às segundas, quartas e sextas.',
    drawDays: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'],
    minNumber: 1,
    maxNumber: 25,
    numbersDrawn: 15,
  },
  megasena: {
    name: 'Mega-Sena',
    slug: 'megasena',
    color: 'lottery-megasena',
    hexColor: '#00843D',
    description: 'Sorteios às terças, quintas e sábados.',
    drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
    minNumber: 1,
    maxNumber: 60,
    numbersDrawn: 6,
  },
  quina: {
    name: 'Quina',
    slug: 'quina',
    color: 'lottery-quina',
    hexColor: '#0050A2',
    description: 'Sorteios diários.',
    drawDays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    minNumber: 1,
    maxNumber: 80,
    numbersDrawn: 5,
  },
  lotomania: {
    name: 'Lotomania',
    slug: 'lotomania',
    color: 'lottery-lotomania',
    hexColor: '#F68321',
    description: 'Sorteios às terças e sextas.',
    drawDays: ['Terça-feira', 'Sexta-feira'],
    minNumber: 0,
    maxNumber: 99,
    numbersDrawn: 20,
  },
  duplasena: {
    name: 'Dupla Sena',
    slug: 'duplasena',
    color: 'lottery-duplasena',
    hexColor: '#A00F28',
    description: 'Dois sorteios por concurso, às terças, quintas e sábados.',
    drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
    minNumber: 1,
    maxNumber: 50,
    numbersDrawn: 6,
  },
  federal: {
    name: 'Federal',
    slug: 'federal',
    color: 'lottery-federal',
    hexColor: '#2B388F',
    description: 'Sorteios aos sábados.',
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
