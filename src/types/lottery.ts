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
  estimatedPrize: number | null;
}

export type NextContestInfo = NextContest;

/**
 * Retornado pelo serviço /api/results/[lottery] e /api/results/[lottery]/[contest]
 */
export interface LotteryResult {
  lottery: LotterySlug;
  contestNumber: number;
  date: string | null;

  // Dezenas principais (todos)
  numbers: string[];

  // Dezenas do segundo sorteio (Dupla Sena)
  duplaNumbers: string[];

  // Time do Coração (Timemania)
  timeCoracao: string | null;

  // Mês da Sorte (Dia de Sorte)
  mesSorte: string | null;

  // Trevos (Mais Milionária)
  trevos: string[];

  // Clovers (Mais Milionária) - deprecated, use trevos instead
  clovers?: string[];

  // Acumulação
  accumulated: boolean;
  accumulatedPrize: number | null;

  // Prêmios por faixa
  prizes: PrizeTier[];

  // Valor especial acumulado (ex: Mega da Virada)
  specialPrize: number | null;

  // Locais com ganhadores
  locales: WinnerLocale[];

  // Próximo concurso
  nextContest: NextContest;
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
