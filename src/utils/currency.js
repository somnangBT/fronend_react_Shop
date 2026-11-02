// currency.js - Khmer Riel & USD Currency Utility

export const USD_TO_KHR_RATE = 4100;

/**
 * Format USD price, e.g. 3.5 -> "$3.50"
 */
export const formatUSD = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$0.00';
  return `$${num.toFixed(2)}`;
};

/**
 * Convert USD amount to Khmer Riel, rounded to nearest 100 Riels
 * e.g. 3.5 -> "14,400 ៛"
 */
export const formatKHR = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0 ៛';
  const riel = Math.round((num * USD_TO_KHR_RATE) / 100) * 100;
  return `${riel.toLocaleString()} ៛`;
};

/**
 * Calculate discounted price from original price and discount percentage
 */
export const calculateDiscount = (price, discountPercent) => {
  const original = parseFloat(price);
  const discount = parseFloat(discountPercent);
  if (isNaN(original) || isNaN(discount) || discount <= 0) return original;
  const discounted = original - (original * (discount / 100));
  return parseFloat(discounted.toFixed(2));
};
