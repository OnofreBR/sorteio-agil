export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(value: string | undefined | null): string {
  if (!value) return '';
  // If already in DD/MM/YYYY format, return as is
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;
  // Try to parse as ISO-like date
  const date = new Date(value);
  if (isNaN(date.getTime())) return value; // Invalid date, return original
  // Format to DD/MM/YYYY
  return new Intl.DateTimeFormat('pt-BR').format(date);
}
