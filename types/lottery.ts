// Complete lottery result from API - used by all components
export interface LotteryResult {
  loteria: string;
  concurso: number;
  data: string;
  local: string;
  dezenasOrdemSorteio: number[];
  dezenas: number[];
  trevos?: number[]; // optional but treated as [] during serialization
  mesSorte?: string;
  premiacoes: Prize[];
  estadosPremiados?: string[]; // optional but treated as [] during serialization
  observacao?: string;
  acumulou: boolean;
  proximoConcurso: number;
  dataProximoConcurso: string;
  valorEstimadoProximoConcurso: number;
  // Additional fields from API for complete contest details
  valorAcumulado?: number;
  acumuladoConcursoEspecial?: number;
  valorAcumuladoConcursoEspecial?: number;
  valorAcumuladoConcurso_0_5?: number;
  valorArrecadado?: number;
  cidadesPremiadas?: CidadePremiada[];
  rateioCidades?: RateioCidade[];
  nome?: string;
  numeroConcursoProximo?: number;
  numeroConcursoAnterior?: number;
  valorEstimado?: number;
}

export interface Prize {
  descricao: string;
  faixa: number;
  ganhadores: number;
  valorPremio: number;
}

export interface CidadePremiada {
  cidade: string;
  uf: string;
  ganhadores: number;
  posicao?: number;
}

export interface RateioCidade {
  cidade: string;
  uf: string;
  valor: number;
  ganhadores?: number;
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
    hexColor: '#209869',
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
    hexColor: '#260085',
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
    hexColor: '#930089',
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
    hexColor: '#F78100',
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
    hexColor: '#B70027',
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
    hexColor: '#2B388F',
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
    hexColor: '#006600',
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
    hexColor: '#DF9B10',
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
    hexColor: '#E56C17',
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
    hexColor: '#00703C',
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
    hexColor: '#2B388F',
    description: 'A Loteca tem sorteios aos sábados.',
    drawDays: ['Sábado'],
    minNumber: 1,
    maxNumber: 14,
    numbersDrawn: 14,
  },
};
