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

export const getSortedWorkDays = (workDaysArray) => {
  if (!workDaysArray || !Array.isArray(workDaysArray)) return [];
  const dayOrder = { 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5, 'SAT': 6, 'SUN': 7 };
  return [...workDaysArray].sort((a, b) => (dayOrder[a.day_of_week] || 9) - (dayOrder[b.day_of_week] || 9));
};


export const translateDay = (dayKey) => {
  const dayTranslation = { 
    'MON': 'Thứ 2', 
    'TUE': 'Thứ 3', 
    'WED': 'Thứ 4', 
    'THU': 'Thứ 5', 
    'FRI': 'Thứ 6', 
    'SAT': 'Thứ 7', 
    'SUN': 'Chủ Nhật' 
  };
  return dayTranslation[dayKey] || dayKey;
};

export const formatTime = (timeString) => {
  if (!timeString) return '--:--';
  return timeString.slice(0, 5);
};


export const formatArea = (addressObj) => {
  if (!addressObj) return 'Chưa cập nhật khu vực';
  const components = [
    addressObj.ward?.name,
    addressObj.district?.name,
    addressObj.province?.name
  ].filter(Boolean);
  return components.join(', ') || 'Chưa cập nhật khu vực';
};