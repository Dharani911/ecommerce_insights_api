import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ingestOrders, searchCustomers, searchProducts,
  createCustomer, createProduct,
  ProductRefDto, CustomerRefDto
} from "../lib/api";
import { formatCurrency } from "../lib/date";

const todayISO = () => new Date().toISOString().slice(0, 10);
const statuses = ["PAID", "PENDING", "CANCELLED", "REFUNDED"] as const;
type Status = typeof statuses[number];

type LineItem = {
  id: string;
  product: ProductRefDto | null;
  quantity: number;
  unitPrice: number;
  productText: string;
};

export default function Ingest() {
  const [orderDate, setOrderDate] = useState(todayISO());
  const [status, setStatus] = useState<Status>("PAID");
  const [currency, setCurrency] = useState("EUR");

  // customer lookup
  const [customerText, setCustomerText] = useState("");
  const [customer, setCustomer] = useState<CustomerRefDto | null>(null);
  const [customerOptions, setCustomerOptions] = useState<CustomerRefDto[]>([]);
  const [customerOpen, setCustomerOpen] = useState(false);
  const customerInputRef = useRef<HTMLInputElement | null>(null);

  // create customer modal
  const [showNewCustomer, setShowNewCustomer] = useState(false);

  // items
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), product: null, quantity: 1, unitPrice: 0, productText: "" }
  ]);

  // create product modal (for a specific line)
  const [newProdForLine, setNewProdForLine] = useState<string | null>(null);
  const currentLine = items.find(i => i.id === newProdForLine) || null;

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0),
    [items]
  );

  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [discount, setDiscount] = useState(0);
  const grandTotal = Math.max(0, subtotal + (tax || 0) + (shipping || 0) - (discount || 0));

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // debounced customer search
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const q = customerText.trim();
        const res = await searchCustomers(q || undefined, 10);
        setCustomerOptions(res.data);
      } catch { /* ignore */ }
    }, 250);
    return () => clearTimeout(t);
  }, [customerText]);

  async function searchProductsQ(q: string) {
    try {
      const res = await searchProducts(q || undefined, 10);
      return res.data;
    } catch { return []; }
  }

  function addItem() {
    setItems((p) => [...p, { id: crypto.randomUUID(), product: null, quantity: 1, unitPrice: 0, productText: "" }]);
  }
  function removeItem(id: string) { setItems((p) => p.filter((x) => x.id !== id)); }
  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function validate(): string[] {
    const errs: string[] = [];
    if (!customer?.id) errs.push("Customer is required.");
    if (!orderDate) errs.push("Order date is required.");
    if (!status) errs.push("Status is required.");
    if (!currency) errs.push("Currency is required.");
    const validItems = items.filter((it) => it.product?.id && it.quantity > 0 && it.unitPrice >= 0);
    if (validItems.length === 0) errs.push("At least one valid line item is required.");
    if (grandTotal < 0) errs.push("Grand total cannot be negative.");
    return errs;
  }

  async function submit() {
    setErrors([]); setToast(null);
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }

    const payload = {
      customerId: customer!.id,
      orderDate, status, currency,
      subtotal: round2(subtotal), tax: round2(tax), shipping: round2(shipping), discount: round2(discount),
      grandTotal: round2(grandTotal),
      items: items.filter((it) => it.product?.id).map((it) => ({
        productId: it.product!.id,
        quantity: Number(it.quantity),
        unitPrice: round2(it.unitPrice),
        currency
      }))
    };

    setBusy(true);
    try {
      const res = await ingestOrders(payload);
      if (res.status === 202) {
        setToast({ ok: true, msg: "Order accepted (202)." });
        resetForm();
      } else {
        setToast({ ok: false, msg: `HTTP ${res.status}: ${typeof res.data === "string" ? res.data : JSON.stringify(res.data)}` });
      }
    } catch (e: any) {
      setToast({ ok: false, msg: e?.message ?? "Request failed" });
    } finally { setBusy(false); }
  }

  function resetForm() {
    setOrderDate(todayISO());
    setStatus("PAID"); setCurrency("EUR");
    setCustomer(null); setCustomerText(""); setCustomerOpen(false);
    setItems([{ id: crypto.randomUUID(), product: null, quantity: 1, unitPrice: 0, productText: "" }]);
    setTax(0); setShipping(0); setDiscount(0);
  }

  // close customer dropdown on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!customerInputRef.current) return;
      if (!customerInputRef.current.contains(target)) setCustomerOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <section className="space-y-6">
      <div className="card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">Create Order</div>
          <button className="px-3 py-1 rounded-xl border hover:bg-neutral-100" onClick={() => setShowNewCustomer(true)}>
            + New Customer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Customer lookup */}
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-600">Customer</label>
            <div className="relative" ref={customerInputRef}>
              <input
                className="w-full px-3 py-2 rounded-xl border"
                placeholder="Search name or email…"
                value={customer ? `${customer.name ?? ""} <${customer.email}>` : customerText}
                onChange={(e) => { setCustomer(null); setCustomerText(e.target.value); setCustomerOpen(true); }}
                onFocus={() => setCustomerOpen(true)}
              />
              {customerOpen && (customerText || !customer) && (
                <div className="absolute z-50 mt-1 w-full rounded-xl border bg-white shadow-soft max-h-56 overflow-auto">
                  {customerOptions.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-neutral-500">No matches</div>
                  ) : customerOptions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setCustomer(c); setCustomerOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-50"
                    >
                      <div className="font-medium">{c.name || "(no name)"}</div>
                      <div className="text-xs text-neutral-500">{c.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-600">Order Date</label>
            <input type="date" className="w-full px-3 py-2 rounded-xl border" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-neutral-600">Status</label>
            <select className="w-full px-3 py-2 rounded-xl border" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-neutral-600">Currency</label>
            <select className="w-full px-3 py-2 rounded-xl border" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option>EUR</option><option>USD</option><option>GBP</option>
            </select>
            <p className="text-[11px] text-neutral-500 mt-1">Items will use this currency.</p>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium">Line Items</div>
          <button type="button" onClick={addItem} className="px-3 py-1 rounded-xl border hover:bg-neutral-100">+ Add item</button>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500">
                <th className="py-2">Product</th>
                <th className="py-2 w-28">Qty</th>
                <th className="py-2 w-40">Unit Price</th>
                <th className="py-2 w-40">Line Total</th>
                <th className="py-2 w-28"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <ItemRow
                  key={it.id}
                  item={it}
                  currency={currency}
                  onChange={(patch) => updateItem(it.id, patch)}
                  onRemove={() => removeItem(it.id)}
                  onNewProduct={() => setNewProdForLine(it.id)}
                  productSearch={searchProductsQ}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4">
          <div className="font-medium mb-2">Charges</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SmoothCurrencyInput label="Tax" value={tax} onCommit={setTax} />
            <SmoothCurrencyInput label="Shipping" value={shipping} onCommit={setShipping} />
            <SmoothCurrencyInput label="Discount" value={discount} onCommit={setDiscount} />
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">Grand total = subtotal + tax + shipping − discount</p>
        </div>

        <div className="card p-4">
          <div className="font-medium mb-2">Summary</div>
          <div className="space-y-1 text-sm">
            <Row label="Subtotal" value={formatCurrency(subtotal, currency)} />
            <Row label="Tax" value={formatCurrency(tax, currency)} />
            <Row label="Shipping" value={formatCurrency(shipping, currency)} />
            <Row label="Discount" value={formatCurrency(discount, currency)} />
            <div className="border-t my-2" />
            <Row label="Grand Total" value={formatCurrency(grandTotal, currency)} bold />
          </div>

          {errors.length > 0 && (
            <div className="mt-3 text-sm px-3 py-2 rounded-xl bg-red-50 text-red-700">
              <ul className="list-disc ml-4">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </div>
          )}

          {toast && (
            <div className={`mt-3 text-sm px-3 py-2 rounded-xl ${toast.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {toast.msg}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button onClick={submit} disabled={busy} className="px-4 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50">
              {busy ? "Submitting…" : "Submit Order"}
            </button>
            <button onClick={resetForm} className="px-4 py-2 rounded-xl border hover:bg-neutral-100">Reset</button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <NewCustomerModal
        open={showNewCustomer}
        onClose={() => setShowNewCustomer(false)}
        onCreated={(c) => { setCustomer(c); setCustomerText(""); setShowNewCustomer(false); }}
      />

      <NewProductModal
        open={!!newProdForLine}
        defaultCurrency={currency}
        defaultName={(currentLine?.productText || "").trim()}
        onClose={() => setNewProdForLine(null)}
        onCreated={(p) => {
          if (!newProdForLine) return;
          // set product & autofill price on the target line
          setItems((prev) => prev.map(li => {
            if (li.id !== newProdForLine) return li;
            const price = Number(p.unitPrice ?? 0);
            return { ...li, product: p, productText: `${p.name}${p.sku ? ` (${p.sku})` : ""}`, unitPrice: li.unitPrice > 0 ? li.unitPrice : round2(price) };
          }));
          setNewProdForLine(null);
        }}
      />
    </section>
  );
}

/* ---------- Product row with PORTAL dropdown + "New Product" button ---------- */

function ItemRow({
  item, currency, onChange, onRemove, onNewProduct, productSearch
}: {
  item: LineItem;
  currency: string;
  onChange: (p: Partial<LineItem>) => void;
  onRemove: () => void;
  onNewProduct: () => void;
  productSearch: (q: string) => Promise<ProductRefDto[]>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ProductRefDto[]>([]);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!open) return;
      const res = await productSearch(item.productText);
      setOptions(res);
      position();
    }, 200);
    return () => clearTimeout(t);
  }, [open, item.productText]);

  useEffect(() => {
    function onScrollOrResize() { if (open) position(); }
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (inputRef.current && !inputRef.current.contains(target)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function position() {
    if (!inputRef.current) return;
    setRect(inputRef.current.getBoundingClientRect());
  }

  const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
  const labelFor = (p: ProductRefDto) => `${p.name}${p.sku ? ` (${p.sku})` : ""}`;

  return (
    <tr className="border-t">
      <td className="py-2">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            className="w-full px-3 py-2 rounded-xl border"
            placeholder="Search product name / SKU…"
            value={item.product ? labelFor(item.product) : item.productText}
            onChange={(e) => {
              onChange({ product: null, productText: e.target.value });
              setOpen(true);
            }}
            onFocus={() => { setOpen(true); position(); }}
          />
          <button type="button" onClick={onNewProduct} className="px-2 py-2 rounded-xl border hover:bg-neutral-100 whitespace-nowrap">
            New
          </button>
        </div>
        {open && !item.product && rect && createPortal(
          <div
            style={{ position: "fixed", top: rect.bottom + 6, left: rect.left, width: rect.width, zIndex: 1000 }}
            className="rounded-xl border bg-white shadow-soft max-h-72 overflow-auto"
          >
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-neutral-500">No matches</div>
            ) : options.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  const price = Number(p.unitPrice ?? 0);
                  onChange({ product: p, productText: labelFor(p), unitPrice: item.unitPrice > 0 ? item.unitPrice : round2(price) });
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-neutral-50"
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-neutral-500">
                  {p.sku ? `SKU: ${p.sku} · ` : ""}ID: {p.id}
                  {typeof p.unitPrice !== "undefined" ? ` · Price: ${formatCurrency(Number(p.unitPrice || 0))}` : ""}
                </div>
              </button>
            ))}
          </div>,
          document.body
        )}
      </td>
      <td className="py-2">
        <input
          type="number" min={1}
          className="w-24 px-3 py-2 rounded-xl border"
          value={item.quantity}
          onChange={(e) => onChange({ quantity: clampInt(e.target.value, 1) })}
        />
      </td>
      <td className="py-2">
        <input
          type="number" min={0} step="0.01"
          className="w-36 px-3 py-2 rounded-xl border"
          value={Number.isNaN(item.unitPrice) ? "" : item.unitPrice}
          onChange={(e) => onChange({ unitPrice: clampMoney(e.target.value) })}
        />
      </td>
      <td className="py-2 tabular-nums">{formatCurrency(lineTotal, currency)}</td>
      <td className="py-2">
        <button onClick={onRemove} className="px-3 py-1 rounded-xl border hover:bg-neutral-100">Remove</button>
      </td>
    </tr>
  );
}

/* ---- Create NEW Customer modal ---- */

function NewCustomerModal({
  open, onClose, onCreated
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (c: CustomerRefDto) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { if (open) { setEmail(""); setName(""); setErr(null); setBusy(false); }}, [open]);

  async function submit() {
    setErr(null);
    if (!email.trim()) { setErr("Email is required."); return; }
    setBusy(true);
    try {
      const res = await createCustomer({ email: email.trim(), name: name.trim() || undefined });
      onCreated(res.data);
    } catch (e: any) {
      setErr(e?.response?.data || e?.message || "Failed to create customer.");
    } finally { setBusy(false); }
  }

  if (!open) return null;
  return createPortal(
    <Modal title="New Customer" onClose={onClose}>
      <div className="space-y-3">
        <label className="block text-sm">
          <span className="text-neutral-600 text-xs">Email</span>
          <input className="w-full px-3 py-2 rounded-xl border" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-600 text-xs">Name (optional)</span>
          <input className="w-full px-3 py-2 rounded-xl border" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </label>
        {err && <div className="text-sm px-3 py-2 rounded-xl bg-red-50 text-red-700">{String(err)}</div>}
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 rounded-xl border" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded-xl bg-neutral-900 text-white disabled:opacity-50" onClick={submit} disabled={busy}>
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </Modal>,
    document.body
  );
}

/* ---- Create NEW Product modal ---- */

function NewProductModal({
  open, defaultCurrency, defaultName, onClose, onCreated
}: {
  open: boolean;
  defaultCurrency: string;
  defaultName?: string;
  onClose: () => void;
  onCreated: (p: ProductRefDto) => void;
}) {
  const [name, setName] = useState(defaultName || "");
  const [sku, setSku] = useState("");
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [currency, setCurrency] = useState(defaultCurrency || "EUR");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(defaultName || "");
      setSku("");
      setUnitPrice("");
      setCurrency(defaultCurrency || "EUR");
      setBusy(false); setErr(null);
    }
  }, [open, defaultCurrency, defaultName]);

  async function submit() {
    setErr(null);
    if (!name.trim()) { setErr("Name is required."); return; }
    const priceNum = unitPrice.trim() === "" ? undefined : Number(unitPrice);
    if (priceNum !== undefined && (Number.isNaN(priceNum) || priceNum < 0)) {
      setErr("Unit price must be a non-negative number.");
      return;
    }
    setBusy(true);
    try {
      const res = await createProduct({
        name: name.trim(),
        sku: sku.trim() || undefined,
        unitPrice: priceNum,
        currency
      });
      onCreated(res.data);
    } catch (e: any) {
      setErr(e?.response?.data || e?.message || "Failed to create product.");
    } finally { setBusy(false); }
  }

  if (!open) return null;
  return createPortal(
    <Modal title="New Product" onClose={onClose}>
      <div className="space-y-3">
        <label className="block text-sm">
          <span className="text-neutral-600 text-xs">Name</span>
          <input className="w-full px-3 py-2 rounded-xl border" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="block text-sm md:col-span-1">
            <span className="text-neutral-600 text-xs">SKU (optional)</span>
            <input className="w-full px-3 py-2 rounded-xl border" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-001" />
          </label>
          <label className="block text-sm md:col-span-1">
            <span className="text-neutral-600 text-xs">Unit Price (optional)</span>
            <input className="w-full px-3 py-2 rounded-xl border" inputMode="decimal" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0.00" />
          </label>
          <label className="block text-sm md:col-span-1">
            <span className="text-neutral-600 text-xs">Currency</span>
            <select className="w-full px-3 py-2 rounded-xl border" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option>EUR</option><option>USD</option><option>GBP</option>
            </select>
          </label>
        </div>
        {err && <div className="text-sm px-3 py-2 rounded-xl bg-red-50 text-red-700">{String(err)}</div>}
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 rounded-xl border" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 rounded-xl bg-neutral-900 text-white disabled:opacity-50" onClick={submit} disabled={busy}>
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </Modal>,
    document.body
  );
}

/* ---- Generic Modal ---- */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[1100]">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="absolute left-1/2 top-16 -translate-x-1/2 w-[95%] max-w-xl">
        <div className="rounded-2xl bg-white shadow-soft border">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-medium">{title}</div>
            <button onClick={onClose} className="px-2 py-1 rounded-lg hover:bg-neutral-100">✕</button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---- Charges inputs that allow blank while typing, commit on blur ---- */

function SmoothCurrencyInput({
  label, value, onCommit
}: { label: string; value: number; onCommit: (n: number) => void }) {
  const [raw, setRaw] = useState<string>(String(value ?? 0));
  const [focused, setFocused] = useState(false);
  useEffect(() => { if (!focused) setRaw(String(value ?? 0)); }, [value, focused]);

  function commit() {
    const n = parseFloat(raw);
    if (Number.isNaN(n)) onCommit(0); else onCommit(round2(n));
  }

  return (
    <label className="block">
      <div className="text-xs text-neutral-600">{label}</div>
      <input
        inputMode="decimal"
        className="w-full px-3 py-2 rounded-xl border"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={() => { setFocused(false); commit(); }}
        onFocus={() => setFocused(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { (e.target as HTMLInputElement).blur(); }
          if (e.key === "Escape") { setRaw(String(value ?? 0)); (e.target as HTMLInputElement).blur(); }
        }}
      />
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold" : ""}`}>
      <span className="text-neutral-600">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function clampMoney(v: string): number {
  const n = Number(v);
  if (Number.isNaN(n) || n < 0) return 0;
  return round2(n);
}
function clampInt(v: string, min: number): number {
  const n = Math.floor(Number(v));
  if (Number.isNaN(n)) return min;
  return Math.max(min, n);
}
function round2(n: number) { return Math.round(n * 100) / 100; }
