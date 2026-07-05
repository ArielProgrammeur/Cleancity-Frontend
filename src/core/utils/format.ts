const EUR_TO_XOF = 655.96;

export function formatPrice(euroPrice: number): string {
  const xof = Math.round(euroPrice * EUR_TO_XOF);
  return xof.toLocaleString('fr-FR') + ' F';
}

export function formatPricePerUnit(euroPrice: number, unit: string): string {
  return formatPrice(euroPrice) + '/' + unit;
}
