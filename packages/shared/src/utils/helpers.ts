export function generateNumber(prefix: string, sequence: number): string {
  const paddedSequence = String(sequence).padStart(6, '0');
  return `${prefix}-${paddedSequence}`;
}

export function generateRFQNumber(sequence: number): string {
  return generateNumber('RFQ', sequence);
}

export function generateQuotationNumber(sequence: number): string {
  return generateNumber('QT', sequence);
}

export function generatePONumber(sequence: number): string {
  return generateNumber('PO', sequence);
}

export function generateInvoiceNumber(sequence: number): string {
  return generateNumber('INV', sequence);
}

export function calculateDeliveryScore(deliveryDays: number, maxDays: number = 30): number {
  // Lower delivery days = higher score
  if (deliveryDays <= 7) return 100;
  if (deliveryDays <= 14) return 90;
  if (deliveryDays <= maxDays) return 80 - ((deliveryDays - 14) / (maxDays - 14)) * 20;
  return 0;
}

export function calculatePriceScore(price: number, minPrice: number): number {
  // Lower price = higher score (max 100)
  if (price <= minPrice) return 100;
  const priceRatio = price / minPrice;
  return Math.max(0, 100 - (priceRatio - 1) * 50);
}

export function calculateRatingScore(rating: number): number {
  // Rating out of 5, convert to 0-100
  return (rating / 5) * 100;
}

export function calculateVendorScore(
  priceScore: number,
  deliveryScore: number,
  ratingScore: number,
  weights = { price: 0.5, delivery: 0.3, rating: 0.2 }
): number {
  return (
    priceScore * weights.price +
    deliveryScore * weights.delivery +
    ratingScore * weights.rating
  );
}
