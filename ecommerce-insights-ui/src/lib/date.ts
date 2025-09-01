export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
export function daysAgoISO(n: number): string {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10);
}
export function formatCurrency(num: number, currency = "EUR"): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(num ?? 0);
}
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num ?? 0);
}
export function pct(n: number): string { return `${(n * 100).toFixed(1)}%`; }
