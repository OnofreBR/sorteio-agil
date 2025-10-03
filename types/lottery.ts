export interface LotteryResult {
  loteria: string;
  concurso: number;
  data: string;
  local: string;
  dezenasOrdemSorteio: number[];
  dezenas: number[];
  trevos?: number[];
  mesSorte?: string;
  premiacoes: Prize[];
  estadosPremiados?: string[];
  observacao?: string;
  acumulou: boolean;
  proximoConcurso: number;
  dataProximoConcurso: string;
  valorEstimadoProximoConcurso: number;
}

export interface Prize {
  descricao: string;
  faixa: number;
  ganhadores: number;
  valorPremio: number;
}

export interface LotteryInfo {
  name: string;
  slug: string;
  color: string;
  description: string;
  drawDays: string[];
  minNumber: number;
  maxNumber: number;
  numbersDrawn: number;
}

// ADIÇÃO DOS TIPOS QUE FALTAVAM
export interface Contest {
  id: number;
  lottery_id: number;
  contest_number: number;
  draw_date: string;
  drawn_numbers: number[];
  total_collected: number;
  next_contest_prize: number | null;
}

export interface Lottery {
  id: number;
  name: string;
  display_name: string;
}
// FIM DA ADIÇÃO

export const LOTTERY_MAP: Record<string, LotteryInfo> = {
  megasena: {
    name: 'Mega-Sena',
    slug: 'megasena',
    color: 'lottery-megasena',
    description: 'A Mega-Sena é a maior loteria do Brasil, com sorteios às quartas e sábados.',
    drawDays: ['Quarta-feira', 'Sábado'],
    minNumber: 1,
    maxNumber: 60,
    numbersDrawn: 6,
  },
  quina: {
    name: 'Quina',
    slug: 'quina',
    color: 'lottery-quina',
    description: 'A Quina tem sorteios diários de segunda a sábado.',
    drawDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    minNumber: 1,
    maxNumber: 80,
    numbersDrawn: 5,
  },
  lotofacil: {
    name: 'Lotofácil',
    slug: 'lotofacil',
    color: 'lottery-lotofacil',
    description: 'A Lotofácil tem sorteios diários de segunda a sábado.',
    drawDays: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    minNumber: 1,
    maxNumber: 25,
    numbersDrawn: 15,
  },
  lotomania: {
    name: 'Lotomania',
    slug: 'lotomania',
    color: 'lottery-lotomania',
    description: 'A Lotomania tem sorteios às terças, quintas e sábados.',
    drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
    minNumber: 0,
    maxNumber: 99,
    numbersDrawn: 20,
  },
  duplasena: {
    name: 'Dupla Sena',
    slug: 'duplasena',
    color: 'lottery-dupla',
    description: 'A Dupla Sena tem dois sorteios por concurso às terças, quintas e sábados.',
    drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
    minNumber: 1,
    maxNumber: 50,
    numbersDrawn: 6,
  },
  federal: {
    name: 'Federal',
    slug: 'federal',
    color: 'lottery-federal',
    description: 'A Federal tem sorteios aos sábados.',
    drawDays: ['Sábado'],
    minNumber: 0,
    maxNumber: 99999,
    numbersDrawn: 5,
  },
  timemania: {
    name: 'Timemania',
    slug: 'timemania',
    color: 'lottery-timemania',
    description: 'A Timemania tem sorteios às terças, quintas e sábados.',
    drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
    minNumber: 1,
    maxNumber: 80,
    numbersDrawn: 7,
  },
  diadesorte: {
    name: 'Dia de Sorte',
    slug: 'diadesorte',
    color: 'lottery-diadesorte',
    description: 'O Dia de Sorte tem sorteios às terças, quintas e sábados.',
    drawDays: ['Terça-feira', 'Quinta-feira', 'Sábado'],
    minNumber: 1,
    maxNumber: 31,
    numbersDrawn: 7,
  },
  supersete: {
    name: 'Super Sete',
    slug: 'supersete',
    color: 'lottery-supersete',
    description: 'A Super Sete tem sorteios às segundas, quartas e sextas.',
    drawDays: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'],
    minNumber: 0,
    maxNumber: 9,
    numbersDrawn: 7,
  },
  maismilionaria: {
    name: '+Milionária',
    slug: 'maismilionaria',
    color: 'lottery-maismilionaria',
    description: 'A +Milionária tem sorteios aos sábados.',
    drawDays: ['Sábado'],
    minNumber: 1,
    maxNumber: 50,
    numbersDrawn: 6,
  },
  loteca: {
    name: 'Loteca',
    slug: 'loteca',
    color: 'lottery-federal',
    description: 'A Loteca tem sorteios aos sábados.',
    drawDays: ['Sábado'],
    minNumber: 1,
    maxNumber: 14,
    numbersDrawn: 14,
  },
};
