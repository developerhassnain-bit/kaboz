// Returns discount % (rounded) if originalPrice is genuinely higher than price, else null
export const getDiscountPercent = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};