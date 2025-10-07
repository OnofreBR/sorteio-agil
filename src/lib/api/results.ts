import { LotteryResult, LotterySlug, NextContestInfo, PrizeTier, WinnerLocale } from '@/src/types/lottery';

const PRIMARY_URL = process.env.RESULTS_API_URL;
const SECONDARY_URL = process.env.RESULTS_API_BACKUP_URL;
const API_TOKEN = process.env.RESULTS_API_TOKEN;

const API_HOSTS = [PRIMARY_URL, SECONDARY_URL].filter((value): value is string => Boolean(value));

const LOTTERIES: LotterySlug[] = [
  'megasena',
  'quina',
  'lotofacil',
  'lotomania',
  'duplasena',
  'timemania',
  'diadesorte',
  'supersete',
  'maismilionaria',
  'federal',
  'loteca',
];

type ApiPayload = Record<string, any>;

const toNumber = (value: any): number | null => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const toBoolean = (value: any): boolean => Boolean(value);

const toStringArray = (value: any): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).padStart(2, '0'));
};

const buildPrizeTier = (raw: any): PrizeTier => ({
  name: raw?.nome ?? raw?.descricao ?? 'Premiação',
  hits: toNumber(raw?.acertos),
  winners: toNumber(raw?.quantidade_ganhadores),
  amount: toNumber(raw?.valor_total),
});

const buildWinnerLocale = (raw: any): WinnerLocale => ({
  description: raw?.local ?? null,
  city: raw?.cidade ?? null,
  state: raw?.uf ?? null,
  winners: toNumber(raw?.quantidade_ganhadores),
  isElectronic: Boolean(raw?.canal_eletronico),
});

const pickMainPrize = (tiers: PrizeTier[]): { amount: number | null; winners: number | null } => {
  if (!tiers.length) return { amount: null, winners: null };
  return {
    amount: tiers[0]?.amount ?? null,
    winners: tiers[0]?.winners ?? null,
  };
};

const normalizeNumbers = (payload: ApiPayload): { primary: string[]; secondary?: string[] } => {
  const primary = toStringArray(payload.dezenas ?? payload.dezenas_1 ?? payload.bolas ?? []);
  let secondary: string[] | undefined;

  if (Array.isArray(payload.dezenas_2)) {
    secondary = toStringArray(payload.dezenas_2);
  }

  return { primary, secondary };
};

export const normalizeApi = (payload: ApiPayload, lottery: LotterySlug): LotteryResult => {
  const { primary, secondary } = normalizeNumbers(payload);

  const prizeTiers: PrizeTier[] = [];
  if (Array.isArray(payload.premiacao)) {
    payload.premiacao.forEach((tier: any) => prizeTiers.push(buildPrizeTier(tier)));
  }
  if (Array.isArray(payload.premiacao_2)) {
    payload.premiacao_2.forEach((tier: any) => prizeTiers.push(buildPrizeTier(tier)));
  }

  const winnerLocales: WinnerLocale[] = Array.isArray(payload.local_ganhadores)
    ? payload.local_ganhadores.map((item: any) => buildWinnerLocale(item))
    : [];

  const mainPrizeInfo = pickMainPrize(prizeTiers);

  const nextContest: NextContestInfo = {
    number: toNumber(payload?.numero_final_concurso_acumulado) ?? toNumber(payload?.proximo_concurso),
    date: payload?.data_proximo_concurso ?? null,
    dateMillis: toNumber(payload?.data_proximo_concurso_milliseconds),
    estimatedPrize: toNumber(payload?.valor_estimado_proximo_concurso),
    accumulatedFinalZero: toNumber(payload?.valor_final_concurso_acumulado),
    finalZeroContestNumber: toNumber(payload?.numero_final_concurso_acumulado),
    specialAccumulated: toNumber(payload?.valor_acumulado_especial),
    specialName: payload?.nome_acumulado_especial ?? null,
  };

  return {
    lotterySlug: lottery,
    lotteryName: payload?.nome ?? lottery,
    contestNumber: toNumber(payload?.numero_concurso) ?? 0,
    contestDate: payload?.data_concurso ?? '',
    contestDateMillis: toNumber(payload?.data_concurso_milliseconds),
    location: payload?.local_realizacao ?? null,
    accumulated: toBoolean(payload?.acumulou),
    accumulatedValue: toNumber(payload?.valor_acumulado),
    numbers: primary,
    secondDrawNumbers: secondary,
    totalCollected: toNumber(payload?.arrecadacao_total),
    prizeTiers,
    mainPrize: mainPrizeInfo.amount,
    mainWinners: mainPrizeInfo.winners,
    nextContest,
    winnerLocales,
    rateioEmProcessamento: Boolean(payload?.rateio_processamento),
    // Campos legados
    loteria: payload?.nome ?? lottery,
    concurso: toNumber(payload?.numero_concurso) ?? 0,
    data: payload?.data_concurso ?? null,
    dezenasOrdemSorteio: Array.isArray(payload?.dezenasOrdemSorteio)
      ? payload.dezenasOrdemSorteio
      : undefined,
    dezenas: primary.map((value) => Number(value)),
    trevos: Array.isArray(payload?.trevos) ? payload.trevos : undefined,
    premiacoes: payload?.premiacao,
    estadosPremiados: Array.isArray(payload?.estadosPremiados) ? payload.estadosPremiados : undefined,
    observacao: payload?.observacao ?? undefined,
    proximoConcurso: toNumber(payload?.proximo_concurso) ?? undefined,
    dataProximoConcurso: payload?.data_proximo_concurso ?? undefined,
    valorEstimadoProximoConcurso: toNumber(payload?.valor_estimado_proximo_concurso) ?? undefined,
  };
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const requestLottery = async (
  lottery: LotterySlug,
  contestNumber?: number | string | null,
  attempt = 0,
): Promise<ApiPayload> => {
  if (API_HOSTS.length === 0) {
    throw new Error('RESULTS_API_URL não configurado. Configure as variáveis de ambiente do servidor.');
  }
  if (!API_TOKEN) {
    throw new Error('RESULTS_API_TOKEN não configurado. Configure as variáveis de ambiente do servidor.');
  }

  const params = new URLSearchParams({ loteria: lottery, token: API_TOKEN! });
  if (contestNumber) {
    params.set('concurso', String(contestNumber));
  }

  const lastHostIndex = API_HOSTS.length - 1;
  let lastError: Error | null = null;

  for (let hostIndex = 0; hostIndex < API_HOSTS.length; hostIndex += 1) {
    const base = API_HOSTS[hostIndex];
    const url = `${base.replace(/\/$/, '')}/resultado?${params.toString()}`;

    try {
      const response = await fetch(url, { next: { revalidate: 60 } });

      if (!response.ok) {
        throw new Error(`(${response.status}) ${response.statusText}`);
      }

      const json = await response.json();
      if (!json || typeof json !== 'object') {
        throw new Error('Formato inválido retornado pela API');
      }
      return json as ApiPayload;
    } catch (error: any) {
      lastError = error instanceof Error ? error : new Error(String(error));

      const shouldRetryHost = hostIndex < lastHostIndex;
      if (shouldRetryHost) {
        continue;
      }

      const shouldRetryAttempt = attempt < 1; // tenta apenas mais uma vez
      if (shouldRetryAttempt) {
        await wait(150);
        return requestLottery(lottery, contestNumber, attempt + 1);
      }
    }
  }

  throw lastError ?? new Error('Erro desconhecido ao consultar a API de resultados');
};

export const getLatestByLottery = async (lottery: LotterySlug): Promise<LotteryResult> => {
  const payload = await requestLottery(lottery);
  return normalizeApi(payload, lottery);
};

export const getContest = async (
  lottery: LotterySlug,
  contestNumber: number,
): Promise<LotteryResult> => {
  const payload = await requestLottery(lottery, contestNumber);
  return normalizeApi(payload, lottery);
};

export const getNextInfo = async (lottery: LotterySlug): Promise<NextContestInfo> => {
  const latest = await getLatestByLottery(lottery);
  return latest.nextContest;
};

export const getLatestForAll = async (): Promise<LotteryResult[]> => {
  const results = await Promise.allSettled(LOTTERIES.map((slug) => getLatestByLottery(slug)));

  return results
    .map((entry, index) => {
      if (entry.status === 'fulfilled') {
        return entry.value;
      }
      console.error(`[${LOTTERIES[index]}] Falha ao buscar resultado:`, entry.reason);
      return null;
    })
    .filter((item): item is LotteryResult => Boolean(item));
};

export const LOTTERY_SLUGS = LOTTERIES;
