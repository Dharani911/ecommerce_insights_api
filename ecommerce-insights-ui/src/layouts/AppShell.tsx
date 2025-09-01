import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, LayoutDashboard, Upload, Search } from "lucide-react";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-12">
      <aside className="col-span-12 md:col-span-2 border-r border-neutral-200 bg-white">
        <div className="p-4 text-xl font-semibold">Ecommerce Insights</div>
        <nav className="px-2 space-y-1 text-sm">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={18} />}>Dashboard</NavItem>
          <NavItem to="/analytics" icon={<BarChart3 size={18} />}>Analytics</NavItem>
          <NavItem to="/ingest" icon={<Upload size={18} />}>Ingest</NavItem>
          <NavItem to="/references" icon={<Search size={18} />}>References</NavItem>
        </nav>
      </aside>
      <main className="col-span-12 md:col-span-10">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-neutral-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <span className="font-medium text-neutral-600">Ecommerce Insights UI</span>

          </div>
        </header>
        <div className="max-w-6xl mx-auto p-4">{children}</div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode; }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-neutral-100 ${isActive ? "bg-neutral-100 font-medium" : "text-neutral-700"}`
      }
    >
      {icon}{children}
    </NavLink>
  );
}
