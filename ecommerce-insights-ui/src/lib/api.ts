import axios from "axios";

const baseURL = import.meta.env.DEV
  ? ""                                // dev: same-origin so proxy picks it up
  : (import.meta.env.VITE_API_BASE_URL || "");

export const api = axios.create({
  baseURL,
  timeout: 20000
});

// DTOs (mirroring your backend)
export type SummaryResponse = {
  revenue: number; orders: number; units: number; aov: number;
  newCustomers: number; returningCustomers: number; returningRate: number;
};
export type SalesByDayRow = { date: string; revenue: number; orders: number; units: number; };
export type TopProductRow = { id: number; name: string; units: number; revenue: number; };
export type TopCategoryRow = { id: number; name: string; units: number; revenue: number; }; // hash id (TEXT)
export type TopCustomerRow = { id: number; nameOrEmail: string; orders: number; revenue: number; };
export type ProductRefDto = { id: number; name: string; sku: string; unitPrice?: number };
export type CustomerRefDto = { id: number; name: string; email: string };
export type CreateCustomerPayload = { email: string; name?: string };
export type CreateProductPayload = { name: string; sku?: string; unitPrice?: number; currency?: string };


// API calls
export const getSummary = (start: string, end: string) =>
  api.get<SummaryResponse>("/api/analytics/summary", { params: { start, end }});
export const getSalesByDay = (start: string, end: string) =>
  api.get<SalesByDayRow[]>("/api/analytics/sales-by-day", { params: { start, end }});
export const getTopProducts = (start: string, end: string, limit = 10) =>
  api.get<TopProductRow[]>("/api/analytics/top-products", { params: { start, end, limit }});
export const getTopCategories = (start: string, end: string, limit = 10) =>
  api.get<TopCategoryRow[]>("/api/analytics/top-categories", { params: { start, end, limit }});
export const getTopCustomers = (start: string, end: string, limit = 10) =>
  api.get<TopCustomerRow[]>("/api/analytics/top-customers", { params: { start, end, limit }});
export const searchProducts = (q?: string, limit = 20) =>
  api.get<ProductRefDto[]>("/api/ref/products", { params: { q, limit }});
export const searchCustomers = (q?: string, limit = 20) =>
  api.get<CustomerRefDto[]>("/api/ref/customers", { params: { q, limit }});
export const ingestOrders = (payload: unknown) =>
  api.post<void>("/api/ingest/orders", payload, { validateStatus: () => true });
  export function createCustomer(payload: CreateCustomerPayload) {
    return api.post<CustomerRefDto>("/api/ref/customers", payload);
  }
  export function createProduct(payload: CreateProductPayload) {
    return api.post<ProductRefDto>("/api/ref/products", payload);
  }
