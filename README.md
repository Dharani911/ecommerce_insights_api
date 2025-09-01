# Ecommerce Insights UI

A polished **React + Vite** frontend for an ecommerce analytics stack. It connects to a **Spring Boot + PostgreSQL** backend to show KPIs, trends, and top lists, and includes a friendly **order ingest** flow (with inline creation of customers/products).

> Backend lives in a separate project (Spring Boot). This repo is the UI.

---

## 🚀 Highlights (for reviewers)

- **Clean UX:** left sidebar layout, responsive, keyboard-friendly, no dropdown clipping (portal).
- **Modern stack:** React 18, TypeScript, Tailwind, TanStack Query, Recharts, Axios, lucide-react.
- **Realistic flows:** create orders with multiple line items; search or **create** customers/products in-place.
- **Data layer:** cache-friendly hooks, optimistic UI touches, error panels, input smoothing (numbers allow backspace & partial typing, normalize on blur).
- **DB-driven analytics (via backend):** KPI summary, sales-by-day, top products/categories/customers.

---

## 🧭 UI Tour

- **Dashboard** – headline KPIs, sales-by-day chart, top products.
- **Analytics** – date-range views: Top Products / Categories / Customers.
- **Ingest** – create orders; search or **add new** product/customer on the fly.
- **References** – quick lookup for products & customers.


---

## 🧱 Tech Stack

- **UI:** React 18, TypeScript, Vite, Tailwind CSS
- **Charts:** Recharts
- **Data:** TanStack Query (fetching/caching), Axios
- **Icons:** lucide-react
- **Backend (separate repo):** Spring Boot, JPA, Liquibase, PostgreSQL

---

## ⚡ Quick Start (Local Dev)

**Prereqs**
- Node.js 18+  
- Backend running on `http://localhost:8081` (Spring Boot + Postgres)


