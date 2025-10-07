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

export interface LotteryResult {
  id: string;
  lotteryName: string;
  lotterySlug: LotterySlug;
  contestNumber: number;
  contestDate: string | null;
  contestDateMillis: number | null;
  location: string | null;
  accumulated: boolean;
  accumulatedValue: number | null;
  numbers: string[];
  numbersSecondDraw: string[] | null;
  prizeTiers: PrizeTier[];
  prizeSecondDraw: PrizeTier[] | null;
  winnerLocales: WinnerLocale[] | null;
  totalCollected: number | null;
  team: string | null;
  month: string | null;
  numbersClover: string[] | null;
  prizes: Record<string, number | null> | null;
  numbersMatch: string[] | null;
  matchDetails: string[] | null;
  nextContest: NextContest;
  observacao?: string | null;
  trevos?: string[] | null;
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

export const lotteries: Record<LotterySlug, { name: string; slug: LotterySlug }> = {
  megasena: {
    name: 'Mega-Sena',
    slug: 'megasena',
  },
  quina: {
    name: 'Quina',
    slug: 'quina',
  },
  lotofacil: {
    name: 'Lotofácil',
    slug: 'lotofacil',
  },
  lotomania: {
    name: 'Lotomania',
    slug: 'lotomania',
  },
  duplasena: {
    name: 'Dupla Sena',
    slug: 'duplasena',
  },
  timemania: {
    name: 'Timemania',
    slug: 'timemania',
  },
  diadesorte: {
    name: 'Dia de Sorte',
    slug: 'diadesorte',
  },
  supersete: {
    name: 'Super Sete',
    slug: 'supersete',
  },
  maismilionaria: {
    name: '+Milionária',
    slug: 'maismilionaria',
  },
  federal: {
    name: 'Federal',
    slug: 'federal',
  },
  loteca: {
    name: 'Loteca',
    slug: 'loteca',
  },
};
