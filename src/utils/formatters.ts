export const formatCurrencyBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '—';
  // If already in dd/mm/yyyy, return as-is
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateString)) {
    return dateString;
  }
  // Try to parse ISO or yyyy-mm-dd
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    // Simple safety: ensure numeric
    const y = Number(year), m = Number(month), d = Number(day);
    if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
      return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    }
  }
  // Fallback to Date parsing
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};
