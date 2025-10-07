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
