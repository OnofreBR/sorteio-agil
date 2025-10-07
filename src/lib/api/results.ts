import { LotteryResult, LotterySlug, NextContestInfo, PrizeTier, WinnerLocale } from '@/src/types/lottery';

const PRIMARY_URL = process.env.RESULTS_API_URL;
const SECONDARY_URL = process.env.RESULTS_API_BACKUP_URL;
const API_TOKEN = process.env.RESULTS_API_TOKEN;

const API_HOSTS = [PRIMARY_URL, SECONDARY_URL].filter((value): value is string => Boolean(value));

const REQUEST_TIMEOUT_MS = Number(process.env.RESULTS_API_TIMEOUT ?? 5000);
const CACHE_TTL_MS = Number(process.env.RESULTS_API_CACHE_TTL ?? 60_000);
const MAX_ATTEMPTS = 2;
const BACKOFF_MS = [200, 750, 1500];

const responseCache = new Map<string, { expiresAt: number; payload: ApiPayload }>();

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

const toBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (value === null || value === undefined) return false;
  if (typeof value === 'number') return value !== 0;
  const normalized = String(value).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'no';
};

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

  // Trevos (Mais Milionária): pode vir como números ou strings
  const rawTrevos = Array.isArray(payload.trevos)
    ? payload.trevos
    : Array.isArray(payload.trevos_sorteados)
    ? payload.trevos_sorteados
    : Array.isArray(payload.trevosSorteados)
    ? payload.trevosSorteados
    : [];
  const trevos: string[] = Array.isArray(rawTrevos) ? rawTrevos.map((t: any) => String(t).padStart(2, '0')) : [];

  // Mês da Sorte (Dia de Sorte)
  const mesSorte: string | null = (payload.mes_sorte || payload.mesSorte || payload.mesDaSorte || null) ?? null;

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
    trevos,
    mesSorte,
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
    premiacoes: payload?.premiacao,
    estadosPremiados: Array.isArray(payload?.estadosPremiados) ? payload.estadosPremiados : undefined,
    observacao: payload?.observacao ?? undefined,
    proximoConcurso: toNumber(payload?.proximo_concurso) ?? undefined,
    dataProximoConcurso: payload?.data_proximo_concurso ?? undefined,
    valorEstimadoProximoConcurso: toNumber(payload?.valor_estimado_proximo_concurso) ?? undefined,
  };
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getCacheKey = (lottery: LotterySlug, contestNumber?: number | string | null) =>
  `${lottery}:${contestNumber ?? 'latest'}`;

const requestLottery = async (
  lottery: LotterySlug,
  contestNumber?: number | string | null,
): Promise<ApiPayload> => {
  if (API_HOSTS.length === 0) {
    throw new Error('RESULTS_API_URL não configurado. Configure as variáveis de ambiente do servidor.');
  }
  if (!API_TOKEN) {
    throw new Error('RESULTS_API_TOKEN não configurado. Configure as variáveis de ambiente do servidor.');
  }

  const cacheKey = getCacheKey(lottery, contestNumber);
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
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

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS + attempt * 250);

      try {
        const response = await fetch(url, {
          next: { revalidate: 60 },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`(${response.status}) ${response.statusText}`);
        }

        const json = await response.json();
        if (!json || typeof json !== 'object') {
          throw new Error('Formato inválido retornado pela API');
        }

        responseCache.set(cacheKey, { payload: json as ApiPayload, expiresAt: Date.now() + CACHE_TTL_MS });
        return json as ApiPayload;
      } catch (error: any) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `[api] Falha ao buscar ${lottery}${contestNumber ? ` concurso ${contestNumber}` : ''} em ${base} (tentativa ${attempt + 1}):`,
          lastError.message,
        );
        const backoff = BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)];
        await wait(backoff);
      } finally {
        clearTimeout(timeout);
      }
    }

    const shouldRetryHost = hostIndex < lastHostIndex;
    if (shouldRetryHost) {
      continue;
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
