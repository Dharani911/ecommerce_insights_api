-- 0003: views for simple, debuggable analytics

CREATE OR REPLACE VIEW vw_sales_by_day AS
WITH item_units AS (
  SELECT oi.order_id, SUM(oi.quantity) AS units
  FROM order_items oi
  GROUP BY oi.order_id
)
SELECT
  o.order_date AS day,
  COALESCE(SUM(o.grand_total),0)::numeric AS revenue,
  COUNT(o.id)::bigint                     AS orders,
  COALESCE(SUM(item_units.units),0)::bigint AS units
FROM orders o
LEFT JOIN item_units ON item_units.order_id = o.id
WHERE o.status = 'PAID'
GROUP BY o.order_date;

-- Helpful index if not already present
-- (we already created idx_orders_date in 0001; keeping this as doc)
-- CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
