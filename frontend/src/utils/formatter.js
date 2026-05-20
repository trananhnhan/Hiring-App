export const formatMoney = (amount) => {
  if (!amount && amount !== 0) return null;
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const formatSalaryDisplay = (min, max) => {
  const minStr = formatMoney(min);
  const maxStr = formatMoney(max);
  if (minStr && maxStr) return `${minStr} - ${maxStr}`;
  if (minStr) return `${minStr} trở lên`;
  return "Thỏa thuận";
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};
