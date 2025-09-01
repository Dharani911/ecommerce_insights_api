import TopList from "../components/TopList";
import useDateRange from "../hooks/useDateRange";
import { useTopCategoriesQ, useTopCustomersQ, useTopProductsQ } from "../hooks/useAnalytics";

export default function Analytics() {
  const { start, end, setStart, setEnd, setLastNDays } = useDateRange();
  const topProducts = useTopProductsQ({ start, end, limit: 15 });
  const topCategories = useTopCategoriesQ({ start, end, limit: 15 });
  const topCustomers = useTopCustomersQ({ start, end, limit: 15 });

  return (
    <section className="space-y-6">
      <Header start={start} end={end} setStart={setStart} setEnd={setEnd} setLastNDays={setLastNDays} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TopList title="Top Products (Revenue)" loading={topProducts.isLoading}
                 rows={(topProducts.data ?? []).map((p) => ({ name: p.name, value: p.revenue, sub: `Units: ${p.units}` }))}/>
        <TopList title="Top Categories (Revenue)" loading={topCategories.isLoading}
                 rows={(topCategories.data ?? []).map((c) => ({ name: c.name, value: c.revenue, sub: `Units: ${c.units}` }))}/>
        <TopList title="Top Customers (Revenue)" loading={topCustomers.isLoading}
                 rows={(topCustomers.data ?? []).map((c) => ({ name: c.nameOrEmail, value: c.revenue, sub: `Orders: ${c.orders}` }))}/>
      </div>
    </section>
  );
}

function Header({ start, end, setStart, setEnd, setLastNDays }:{
  start: string; end: string; setStart:(s:string)=>void; setEnd:(s:string)=>void; setLastNDays:(n:number)=>void;
}) {
  return (
    <div className="card p-4 flex flex-wrap items-center gap-3">
      <div className="font-medium">Date Range</div>
      <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="px-2 py-1 rounded border border-neutral-300"/>
      <span>to</span>
      <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="px-2 py-1 rounded border border-neutral-300"/>
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
