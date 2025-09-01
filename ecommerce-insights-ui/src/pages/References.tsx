import { useEffect, useState } from "react";
import { searchCustomers, searchProducts } from "../lib/api";

export default function References() {
  const [pq, setPq] = useState("");
  const [cq, setCq] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const [pr, cr] = await Promise.all([
        searchProducts(pq).then((r) => r.data),
        searchCustomers(cq).then((r) => r.data)
      ]);
      setProducts(pr); setCustomers(cr);
    } finally { setLoading(false); }
  }

  useEffect(() => { run(); }, []);

  return (
    <section className="space-y-6">
      <div className="card p-4">
        <div className="font-medium mb-2">Reference Search</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex gap-2">
            <input className="flex-1 px-3 py-2 rounded-xl border" placeholder="Product q / sku" value={pq} onChange={(e) => setPq(e.target.value)} />
            <button onClick={run} className="px-3 py-2 rounded-xl border hover:bg-neutral-100">Search</button>
          </div>
          <div className="flex gap-2">
            <input className="flex-1 px-3 py-2 rounded-xl border" placeholder="Customer name / email" value={cq} onChange={(e) => setCq(e.target.value)} />
            <button onClick={run} className="px-3 py-2 rounded-xl border hover:bg-neutral-100">Search</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="font-medium mb-2">Products</div>
          {loading ? <div className="h-24 animate-pulse bg-neutral-100 rounded-xl" /> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-neutral-500"><th className="py-2">Name</th><th className="py-2">SKU</th><th className="py-2">ID</th></tr></thead>
              <tbody>{products.map((p) => (<tr key={p.id} className="border-t"><td className="py-2">{p.name}</td><td className="py-2">{p.sku}</td><td className="py-2">{p.id}</td></tr>))}</tbody>
            </table>
          )}
        </div>

        <div className="card p-4">
          <div className="font-medium mb-2">Customers</div>
          {loading ? <div className="h-24 animate-pulse bg-neutral-100 rounded-xl" /> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-neutral-500"><th className="py-2">Name</th><th className="py-2">Email</th><th className="py-2">ID</th></tr></thead>
              <tbody>{customers.map((c) => (<tr key={c.id} className="border-t"><td className="py-2">{c.name}</td><td className="py-2">{c.email}</td><td className="py-2">{c.id}</td></tr>))}</tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
