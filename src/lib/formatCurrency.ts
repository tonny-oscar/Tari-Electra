export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-KE');
}

export function formatPrice(price: number): string {
  return `KES ${formatCurrency(price)}`;
}