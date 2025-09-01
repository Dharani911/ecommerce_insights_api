import KpiCards from "../components/KpiCards";
import SalesByDayChart from "../components/SalesByDayChart";
import TopList from "../components/TopList";
import useDateRange from "../hooks/useDateRange";
import { useSummaryQ, useSalesByDayQ, useTopProductsQ } from "../hooks/useAnalytics";

export default function Dashboard() {
  const { start, end, setStart, setEnd, setLastNDays } = useDateRange();
  const summary = useSummaryQ({ start, end });
  const sales = useSalesByDayQ({ start, end });
  const topProducts = useTopProductsQ({ start, end, limit: 10 });

  return (
    <section className="space-y-6">
      <Header start={start} end={end} setStart={setStart} setEnd={setEnd} setLastNDays={setLastNDays} />
      <KpiCards data={summary.data} loading={summary.isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesByDayChart loading={sales.isLoading} data={(sales.data ?? []).map((d) => ({ date: d.date, revenue: d.revenue }))} />
        </div>
        <TopList
          title="Top Products (by revenue)"
          loading={topProducts.isLoading}
          rows={(topProducts.data ?? []).map((p) => ({ name: p.name, value: p.revenue, sub: `Units: ${p.units}` }))}
        />
      </div>
    </section>
  );
}

function Header({ start, end, setStart, setEnd, setLastNDays }:{
  start: string; end: string; setStart: (s:string)=>void; setEnd:(s:string)=>void; setLastNDays:(n:number)=>void;
}) {
  return (
    <div className="card p-4 flex flex-wrap items-center gap-3">
      <div className="font-medium">Date Range</div>
      <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="px-2 py-1 rounded border border-neutral-300" />
      <span>to</span>
      <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="px-2 py-1 rounded border border-neutral-300" />
      <div className="ml-auto flex gap-2">
        <QuickBtn onClick={() => setLastNDays(7)}>7d</QuickBtn>
        <QuickBtn onClick={() => setLastNDays(30)}>30d</QuickBtn>
        <QuickBtn onClick={() => setLastNDays(90)}>90d</QuickBtn>
      </div>
    </div>
  );
}
function QuickBtn({ onClick, children }:{ onClick:()=>void; children:any }) {
  return <button onClick={onClick} className="px-3 py-1 rounded-xl border border-neutral-200 hover:bg-neutral-100">{children}</button>;
}
