import { formatCurrency, formatNumber } from "../lib/date";

type Row = { name: string; value: number; sub?: string };
type Props = {
  title: string;
  rows: Row[];
  currency?: string;
  kind?: "money" | "count";
  loading?: boolean;
  limit?: number;
};

export default function TopList({ title, rows, currency = "EUR", kind = "money", loading, limit = 10 }: Props) {
  const fmt = (n: number) => (kind === "money" ? formatCurrency(n, currency) : formatNumber(n));
  return (
    <div className="card p-4">
      <div className="text-sm font-medium mb-3">{title}</div>
      <ol className="space-y-2">
        {loading
          ? Array.from({ length: limit }).map((_, i) => (
              <li key={i} className="flex justify-between items-center">
                <div className="h-4 w-40 bg-neutral-100 rounded animate-pulse" />
                <div className="h-4 w-16 bg-neutral-100 rounded animate-pulse" />
              </li>
            ))
          : rows.slice(0, limit).map((r, i) => (
              <li key={i} className="flex justify-between items-center">
                <div className="truncate">
                  <span className="text-neutral-500 mr-2">{i + 1}.</span>
                  <span className="font-medium">{r.name}</span>
                  {r.sub ? <span className="ml-2 text-xs text-neutral-500">{r.sub}</span> : null}
                </div>
                <div className="tabular-nums">{fmt(r.value)}</div>
              </li>
            ))}
      </ol>
    </div>
  );
}
