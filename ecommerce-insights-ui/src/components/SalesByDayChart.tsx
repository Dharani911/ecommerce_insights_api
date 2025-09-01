import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "../lib/date";

type P = {
  data: { date: string; revenue: number }[];
  loading?: boolean;
  currency?: string;
  title?: string;
};

export default function SalesByDayChart({ data, loading, currency = "EUR", title = "Revenue by Day" }: P) {
  return (
    <div className="card p-4">
      <div className="text-sm font-medium mb-3">{title}</div>
      {loading ? (
        <div className="h-64 animate-pulse bg-neutral-100 rounded-xl" />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="currentColor" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="currentColor" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => formatCurrency(v, currency)} />
              <Tooltip
                formatter={(v: any) => formatCurrency(Number(v), currency)}
                labelFormatter={(l) => `Date: ${l}`}
              />
              <Area type="monotone" dataKey="revenue" stroke="currentColor" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
