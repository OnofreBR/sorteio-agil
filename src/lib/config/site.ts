const DEFAULT_SITE_URL = 'https://sorteioagil.com.br';

const normalizeUrl = (value: string | undefined | null): string => {
  if (!value) return DEFAULT_SITE_URL;
  try {
    const trimmed = value.trim();
    if (!trimmed) return DEFAULT_SITE_URL;
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    return url.origin.replace(/\/$/, '');
  } catch (error) {
    console.warn('[config] SITE_URL inválida, utilizando padrão', error);
    return DEFAULT_SITE_URL;
  }
};

export const getSiteUrl = (): string =>
  normalizeUrl(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL);

export const buildUrl = (path = ''): string => {
  const base = getSiteUrl();
  if (!path || path === '/') return `${base}/`;
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleaned}`.replace(/([^:]\/)(\/)+/g, '$1$2');
};
