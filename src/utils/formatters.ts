export const formatCurrencyBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '—';
  
  // If already in dd/mm/yyyy format, return as-is
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    return dateString;
  }
  
  // Try to parse yyyy-mm-dd format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
  
  // Fallback: return original string to avoid errors
  return dateString;
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};
