import { formatCurrency, formatNumber, pct } from "../lib/date";

type Props = {
  currency?: string;
  data?: {
    revenue: number; orders: number; units: number; aov: number;
    newCustomers: number; returningCustomers: number; returningRate: number;
  };
  loading?: boolean;
};

export default function KpiCards({ data, loading, currency = "EUR" }: Props) {
  const items = [
    { label: "Revenue", value: data?.revenue, fmt: (n: number) => formatCurrency(n, currency) },
    { label: "Orders", value: data?.orders, fmt: formatNumber },
    { label: "Units", value: data?.units, fmt: formatNumber },
    { label: "Avg Order Value", value: data?.aov, fmt: (n: number) => formatCurrency(n, currency) },
    { label: "New Customers", value: data?.newCustomers, fmt: formatNumber },
    { label: "Returning Customers", value: data?.returningCustomers, fmt: formatNumber },
    { label: "Returning Rate", value: data?.returningRate, fmt: (n: number) => pct(n ?? 0) }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((k) => (
        <div key={k.label} className="card p-4">
          <div className="text-xs uppercase text-neutral-500">{k.label}</div>
          <div className="text-2xl font-semibold mt-1">
            {loading ? <Skeleton /> : k.fmt(k.value ?? 0)}
          </div>
        </div>
      ))}
    </div>
  );
}

function Skeleton() {
  return <div className="h-7 w-28 animate-pulse bg-neutral-200 rounded"></div>;
}
