import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Ingest from "./pages/Ingest";
import References from "./pages/References";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ingest" element={<Ingest />} />
        <Route path="/references" element={<References />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}
