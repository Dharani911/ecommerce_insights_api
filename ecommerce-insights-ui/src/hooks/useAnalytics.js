import { useQuery } from "@tanstack/react-query";
import {
  getSummary, getSalesByDay, getTopProducts, getTopCategories, getTopCustomers
} from "../lib/api";

/** @param {{start:string,end:string}} p */
export function useSummaryQ({ start, end }) {
  return useQuery({ queryKey: ["summary", start, end], queryFn: async () => (await getSummary(start, end)).data });
}
/** @param {{start:string,end:string}} p */
export function useSalesByDayQ({ start, end }) {
  return useQuery({ queryKey: ["salesByDay", start, end], queryFn: async () => (await getSalesByDay(start, end)).data });
}
/** @param {{start:string,end:string,limit?:number}} p */
export function useTopProductsQ({ start, end, limit = 10 }) {
  return useQuery({ queryKey: ["topProducts", start, end, limit], queryFn: async () => (await getTopProducts(start, end, limit)).data });
}
/** @param {{start:string,end:string,limit?:number}} p */
export function useTopCategoriesQ({ start, end, limit = 10 }) {
  return useQuery({ queryKey: ["topCategories", start, end, limit], queryFn: async () => (await getTopCategories(start, end, limit)).data });
}
/** @param {{start:string,end:string,limit?:number}} p */
export function useTopCustomersQ({ start, end, limit = 10 }) {
  return useQuery({ queryKey: ["topCustomers", start, end, limit], queryFn: async () => (await getTopCustomers(start, end, limit)).data });
}
