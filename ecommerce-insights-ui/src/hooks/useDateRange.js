import { useState } from "react";

/**
 * Manages a start/end ISO date range. Defaults to last 30 days.
 * @returns {{start: string, end: string, setStart: (s:string)=>void, setEnd:(s:string)=>void, setLastNDays:(n:number)=>void}}
 */
export default function useDateRange() {
  const today = new Date();
  const endISO = today.toISOString().slice(0, 10);
  const startISO = new Date(today.getTime() - 29 * 86400000).toISOString().slice(0, 10);
  const [start, setStart] = useState(startISO);
  const [end, setEnd] = useState(endISO);
  function setLastNDays(n) {
    const now = new Date();
    const s = new Date(now.getTime() - (n - 1) * 86400000).toISOString().slice(0, 10);
    const e = now.toISOString().slice(0, 10);
    setStart(s); setEnd(e);
  }
  return { start, end, setStart, setEnd, setLastNDays };
}
