const CURRENCY_FORMATTER = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number): string => {
  if (!Number.isFinite(value)) {
    return '0,00';
  }
  return CURRENCY_FORMATTER.format(value);
};
