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

export const lotteries: Record<LotterySlug, { 
    name: string; 
    slug: LotterySlug;
    drawDays: string[];
    numbersDrawn: number;
    minNumber: number;
    maxNumber: number;
    description: string;
}> = {
  megasena: {
    name: 'Mega-Sena',
    slug: 'megasena',
    drawDays: ['quarta-feira', 'sábado'],
    numbersDrawn: 6,
    minNumber: 1,
    maxNumber: 60,
    description: 'A Mega-Sena é a loteria que paga milhões para o acertador dos 6 números sorteados.',
  },
  quina: {
    name: 'Quina',
    slug: 'quina',
    drawDays: ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
    numbersDrawn: 5,
    minNumber: 1,
    maxNumber: 80,
    description: 'Na Quina, você aposta de 5 a 15 números, entre os 80 disponíveis, e concorre a prêmios grandiosos.',
  },
  lotofacil: {
    name: 'Lotofácil',
    slug: 'lotofacil',
    drawDays: ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
    numbersDrawn: 15,
    minNumber: 1,
    maxNumber: 25,
    description: 'Com a Lotofácil, você marca entre 15 e 20 números, dentre os 25 disponíveis no volante, e fatura prêmio se acertar 11, 12, 13, 14 ou 15 números.',
  },
  lotomania: {
    name: 'Lotomania',
    slug: 'lotomania',
    drawDays: ['terça-feira', 'sexta-feira'],
    numbersDrawn: 20,
    minNumber: 1,
    maxNumber: 100,
    description: 'Na Lotomania, você escolhe 50 números e concorre a prêmios para acertos de 20, 19, 18, 17, 16, 15 ou nenhum número.',
  },
  duplasena: {
    name: 'Dupla Sena',
    slug: 'duplasena',
    drawDays: ['terça-feira', 'quinta-feira', 'sábado'],
    numbersDrawn: 6,
    minNumber: 1,
    maxNumber: 50,
    description: 'Com a Dupla Sena, com apenas um bilhete, você tem o dobro de chances de ganhar: são dois sorteios por concurso e ganha acertando 3, 4, 5 ou 6 números no primeiro e/ou segundo sorteios.',
  },
  timemania: {
    name: 'Timemania',
    slug: 'timemania',
    drawDays: ['terça-feira', 'quinta-feira', 'sábado'],
    numbersDrawn: 7,
    minNumber: 1,
    maxNumber: 80,
    description: 'Na Timemania, você escolhe 10 números entre os 80 disponíveis e um Time do Coração. São sorteados sete números e um Time do Coração por concurso. Se você tiver de três a sete acertos, ou acertar o time do coração, ganha.',
  },
  diadesorte: {
    name: 'Dia de Sorte',
    slug: 'diadesorte',
    drawDays: ['terça-feira', 'quinta-feira', 'sábado'],
    numbersDrawn: 7,
    minNumber: 1,
    maxNumber: 31,
    description: 'No Dia de Sorte, você escolhe de 7 a 15 números dentre os 31 disponíveis e mais 1 “Mês de Sorte”. São sorteados sete números e um “Mês de Sorte” por concurso.',
  },
  supersete: {
    name: 'Super Sete',
    slug: 'supersete',
    drawDays: ['segunda-feira', 'quarta-feira', 'sexta-feira'],
    numbersDrawn: 7,
    minNumber: 0,
    maxNumber: 9,
    description: 'O Super Sete é a loteria de prognósticos numéricos cujo volante contém 7 colunas com 10 números (de 0 a 9) em cada uma, de forma que o apostador deverá escolher um número por coluna.',
  },
  maismilionaria: {
    name: '+Milionária',
    slug: 'maismilionaria',
    drawDays: ['quarta-feira', 'sábado'],
    numbersDrawn: 6,
    minNumber: 1,
    maxNumber: 50,
    description: 'A +Milionária é uma loteria que oferece um prêmio principal milionário. Para jogar, você deve escolher 6 números na matriz de números de 1 a 50 e 2 trevos da sorte na matriz de trevos de 1 a 6.',
  },
  federal: {
    name: 'Federal',
    slug: 'federal',
    drawDays: ['quarta-feira', 'sábado'],
    numbersDrawn: 5,
    minNumber: 1,
    maxNumber: 99999,
    description: 'Na Loteria Federal, você escolhe um bilhete com um número de 5 dígitos e concorre a prêmios em dinheiro.',
  },
  loteca: {
    name: 'Loteca',
    slug: 'loteca',
    drawDays: ['sábado'],
    numbersDrawn: 14,
    minNumber: 1,
    maxNumber: 3,
    description: 'A Loteca é ideal para quem entende de futebol e gosta de dar palpites sobre os resultados das partidas.',
  },
};
