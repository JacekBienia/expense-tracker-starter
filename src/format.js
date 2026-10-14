const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatCurrency = (value) => currency.format(value);

const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

// Dates are stored as "YYYY-MM-DD"; build a local date so the day never shifts by timezone.
export const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return shortDate.format(new Date(year, month - 1, day));
};
