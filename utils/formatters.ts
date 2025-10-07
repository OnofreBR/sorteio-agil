const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

export const formatCurrency = (value: number): string => currencyFormatter.format(value);

export const formatCurrencyBRL = (value: number | null | undefined): string => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return currencyFormatter.format(Number(value));
};

export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('pt-BR').format(value);
};

export function formatDate(value: string | undefined | null): string {
  if (!value) return '';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return dateFormatter.format(date);
}

export const formatDateLong = (value: string | undefined | null): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return dateTimeFormatter.format(date);
};

export const toISODate = (value: string | undefined | null): string => {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
};
