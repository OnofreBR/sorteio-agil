import { LOTTERY_MAP } from '@/src/types/lottery';
import type { LotteryResult } from '@/src/types/lottery';

const FUTURE_CONTESTS_COUNT = 20;

/**
 * Gera dados de concursos futuros para SEO
 * Cada página futura tem conteúdo rico (>500 palavras) para evitar soft 404
 */
export function generateFutureContests(
  lottery: string,
  latestContest: number,
  latestDate: string,
  estimatedPrize: number
): LotteryResult[] {
  const lotteryInfo = LOTTERY_MAP[lottery];
  if (!lotteryInfo) return [];

  const futureContests: LotteryResult[] = [];
  
  for (let i = 1; i <= FUTURE_CONTESTS_COUNT; i++) {
    const contestNumber = latestContest + i;
    const estimatedDate = estimateNextDrawDate(latestDate, i, lotteryInfo.drawDays);
    
    const isoDate = convertToISODate(estimatedDate);
    const nextDateBr = estimateNextDrawDate(estimatedDate, 1, lotteryInfo.drawDays);
    const nextDateIso = convertToISODate(nextDateBr);
    const projectedPrize = estimatedPrize * (1 + i * 0.1);

    const prizeTiers = [
      {
        name: `${lotteryInfo.numbersDrawn} acertos`,
        hits: lotteryInfo.numbersDrawn,
        winners: 0,
        amount: projectedPrize,
      },
    ];

    const futureResult: LotteryResult = {
      lotterySlug: lotteryInfo.slug,
      lotteryName: lotteryInfo.name,
      contestNumber,
      contestDate: isoDate,
      contestDateMillis: new Date(isoDate).getTime(),
      location: 'São Paulo, SP',
      accumulated: true,
      accumulatedValue: projectedPrize,
      numbers: [],
      secondDrawNumbers: [],
      trevos: [],
      mesSorte: null,
      totalCollected: null,
      prizeTiers,
      mainPrize: projectedPrize,
      mainWinners: 0,
      nextContest: {
        number: contestNumber + 1,
        date: nextDateIso,
        dateMillis: new Date(nextDateIso).getTime(),
        estimatedPrize: estimatedPrize * (1 + (i + 1) * 0.1),
        accumulatedFinalZero: null,
        finalZeroContestNumber: null,
        specialAccumulated: null,
        specialName: null,
      },
      winnerLocales: [],
      rateioEmProcessamento: false,
      // Compatibilidade legada
      loteria: lotteryInfo.name,
      concurso: contestNumber,
      data: estimatedDate,
      local: 'São Paulo, SP',
      dezenasOrdemSorteio: [],
      dezenas: [],
      trevos: [],
      premiacoes: prizeTiers.map((tier) => ({
        descricao: tier.name,
        faixa: 1,
        ganhadores: tier.winners ?? 0,
        valorPremio: tier.amount ?? 0,
      })),
      estadosPremiados: [],
      observacao: `Sorteio previsto para ${formatEstimatedDate(estimatedDate)}. Resultado será atualizado automaticamente após o sorteio.`,
      acumulou: true,
      proximoConcurso: contestNumber + 1,
      dataProximoConcurso: nextDateBr,
      valorEstimadoProximoConcurso: estimatedPrize * (1 + (i + 1) * 0.1),
    };

    futureContests.push(futureResult);
  }

  return futureContests;
}

/**
 * Estima a data do próximo sorteio baseado nos dias de sorteio
 */
function estimateNextDrawDate(currentDate: string, offset: number, drawDays: string[]): string {
  const [day, month, year] = currentDate.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  
  let daysAdded = 0;
  let currentOffset = 0;
  
  while (currentOffset < offset) {
    daysAdded++;
    date.setDate(date.getDate() + 1);
    
    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
    const normalizedDayName = normalizeDayName(dayName);
    
    if (drawDays.some(d => normalizeDayName(d.toLowerCase()) === normalizedDayName)) {
      currentOffset++;
    }
  }
  
  const estimatedDay = String(date.getDate()).padStart(2, '0');
  const estimatedMonth = String(date.getMonth() + 1).padStart(2, '0');
  const estimatedYear = date.getFullYear();
  
  return `${estimatedDay}/${estimatedMonth}/${estimatedYear}`;
}

function normalizeDayName(day: string): string {
  const dayMap: Record<string, string> = {
    'segunda': 'segunda-feira',
    'terça': 'terça-feira',
    'quarta': 'quarta-feira',
    'quinta': 'quinta-feira',
    'sexta': 'sexta-feira',
    'sábado': 'sábado',
    'domingo': 'domingo',
  };
  
  for (const [key, value] of Object.entries(dayMap)) {
    if (day.includes(key)) return value;
  }
  
  return day;
}

function formatEstimatedDate(dateStr: string): string {
  const [day, month, year] = dateStr.split('/');
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  
  return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
}

function convertToISODate(dateStr: string): string {
  const [day, month, year] = dateStr.split('/').map(Number);
  const iso = new Date(year, (month || 1) - 1, day || 1);
  return Number.isNaN(iso.getTime()) ? new Date().toISOString() : iso.toISOString();
}

/**
 * Gera conteúdo rico para página de concurso futuro (>500 palavras para SEO)
 */
export function generateFutureContestContent(lottery: string, contest: number): {
  title: string;
  description: string;
  content: string;
  howToPlay: string;
  statistics: string;
} {
  const lotteryInfo = LOTTERY_MAP[lottery];
  
  return {
    title: `${lotteryInfo.name} Concurso ${contest} - Aguarde o Resultado`,
    description: `Acompanhe o resultado do concurso ${contest} da ${lotteryInfo.name}. Sorteio previsto com estimativa de prêmio. Confira números sorteados, ganhadores e próximos concursos.`,
    content: `
      <h2>Sobre o Concurso ${contest} da ${lotteryInfo.name}</h2>
      <p>O sorteio do concurso ${contest} da ${lotteryInfo.name} está previsto para os próximos dias. 
      A ${lotteryInfo.name} é uma das loterias mais populares do Brasil, administrada pela Caixa Econômica Federal.</p>
      
      <p>${lotteryInfo.description}</p>
      
      <p>Os sorteios da ${lotteryInfo.name} acontecem ${lotteryInfo.drawDays.join(', ')}, sempre às 20h00 
      (horário de Brasília), em São Paulo, SP. O resultado é divulgado imediatamente após o sorteio e 
      atualizado automaticamente nesta página.</p>
      
      <h2>Informações do Sorteio</h2>
      <p>O concurso ${contest} da ${lotteryInfo.name} sorteará ${lotteryInfo.numbersDrawn} números 
      dentre ${lotteryInfo.maxNumber} disponíveis (de ${String(lotteryInfo.minNumber).padStart(2, '0')} 
      a ${String(lotteryInfo.maxNumber).padStart(2, '0')}). Para ganhar o prêmio principal, é necessário 
      acertar todos os ${lotteryInfo.numbersDrawn} números sorteados.</p>
      
      <p>Além do prêmio principal, há premiações para acertadores de outras faixas. Quanto mais números 
      você acertar, maior será o prêmio. Todos os prêmios são pagos em valores fixos, exceto o prêmio 
      principal que pode acumular caso não haja ganhadores.</p>
    `,
    howToPlay: `
      <h2>Como Funciona a ${lotteryInfo.name}</h2>
      <p>Para jogar na ${lotteryInfo.name}, você deve escolher ${lotteryInfo.numbersDrawn} números 
      em um volante que vai de ${String(lotteryInfo.minNumber).padStart(2, '0')} a 
      ${String(lotteryInfo.maxNumber).padStart(2, '0')}. Você pode escolher mais números 
      e fazer apostas múltiplas, aumentando suas chances de ganhar.</p>
      
      <h3>Tipos de Apostas</h3>
      <ul>
        <li><strong>Aposta Simples:</strong> Você escolhe ${lotteryInfo.numbersDrawn} números</li>
        <li><strong>Aposta Múltipla:</strong> Você escolhe mais de ${lotteryInfo.numbersDrawn} números 
        e o sistema faz todas as combinações possíveis</li>
        <li><strong>Surpresinha:</strong> O sistema escolhe os números aleatoriamente para você</li>
        <li><strong>Teimosinha:</strong> Você concorre com a mesma aposta por 2, 3, 4, 6 ou 8 concursos consecutivos</li>
      </ul>
      
      <h3>Onde Jogar</h3>
      <p>Você pode fazer suas apostas em qualquer lotérica autorizada em todo o Brasil ou pelo site/app 
      oficial da Caixa Econômica Federal. As apostas devem ser realizadas até 19h00 (horário de Brasília) 
      do dia do sorteio.</p>
      
      <h3>Faixas de Premiação</h3>
      <p>A ${lotteryInfo.name} premia acertadores de diferentes faixas. Quanto mais números você acertar, 
      maior será o prêmio. Todos os prêmios são livres de impostos e podem ser resgatados em até 90 dias 
      após o sorteio.</p>
    `,
    statistics: `
      <h2>Estatísticas e Números Mais Sorteados</h2>
      <p>Analisando o histórico de sorteios da ${lotteryInfo.name}, alguns números aparecem com mais 
      frequência que outros. No entanto, é importante lembrar que cada sorteio é independente e todos 
      os números têm a mesma probabilidade matemática de serem sorteados.</p>
      
      <h3>Curiosidades sobre a ${lotteryInfo.name}</h3>
      <ul>
        <li>A ${lotteryInfo.name} já distribuiu milhões de reais em prêmios desde sua criação</li>
        <li>Os sorteios são realizados em auditório público com transmissão ao vivo</li>
        <li>Parte da arrecadação é destinada a programas sociais do governo federal</li>
        <li>Você pode conferir todos os resultados históricos neste site</li>
      </ul>
      
      <p>Para aumentar suas chances de ganhar, muitos apostadores utilizam estratégias como desdobramentos, 
      fechamentos e análise de números quentes e frios. Consulte sempre os últimos resultados para fazer 
      suas escolhas de forma consciente.</p>
    `,
  };
}

/**
 * Verifica se um concurso é futuro baseado no último concurso disponível
 */
export function isFutureContest(lottery: string, contest: number, latestContest: number): boolean {
  return contest > latestContest;
}

/**
 * Lista todos os concursos futuros para geração de sitemap
 */
export function getAllFutureContests(): Array<{ lottery: string; contest: number }> {
  const futureContests: Array<{ lottery: string; contest: number }> = [];
  
  // Para cada loteria, assumimos concursos futuros baseados em um número base
  // Em produção, isso seria baseado nos últimos concursos reais da API
  Object.keys(LOTTERY_MAP).forEach(lottery => {
    const baseContest = 3000; // Número base aproximado (seria obtido da API)
    
    for (let i = 1; i <= FUTURE_CONTESTS_COUNT; i++) {
      futureContests.push({
        lottery,
        contest: baseContest + i,
      });
    }
  });
  
  return futureContests;
}
