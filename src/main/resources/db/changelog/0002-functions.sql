-- 0002: analytics functions (PostgreSQL, hybrid approach)
-- Note: rerunnable / idempotent via CREATE OR REPLACE

CREATE OR REPLACE FUNCTION fn_summary(p_start date, p_end date)
RETURNS TABLE (
  revenue numeric,
  orders bigint,
  units bigint,
  aov numeric,
  new_customers bigint,
  returning_customers bigint,
  returning_rate double precision
) AS $$
BEGIN
  IF p_start IS NULL OR p_end IS NULL OR p_end < p_start THEN
    RAISE EXCEPTION 'fn_summary: invalid date range: % -> %', p_start, p_end
      USING ERRCODE = '22007';
  END IF;

  RETURN QUERY
  WITH
  r AS (
    SELECT COALESCE(SUM(o.grand_total),0)::numeric AS revenue,
           COUNT(o.id)::bigint                   AS orders
    FROM orders o
    WHERE o.order_date BETWEEN p_start AND p_end
      AND o.status = 'PAID'
  ),
  u AS (
    SELECT COALESCE(SUM(oi.quantity),0)::bigint AS units
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.order_date BETWEEN p_start AND p_end
      AND o.status = 'PAID'
  ),
  firsts AS (
    SELECT customer_id, MIN(order_date) AS first_date
    FROM orders
    WHERE status IN ('PAID','PENDING','REFUNDED','CANCELLED')
    GROUP BY customer_id
  ),
  in_window AS (
    SELECT DISTINCT o.customer_id
    FROM orders o
    WHERE o.order_date BETWEEN p_start AND p_end
  ),
  nr AS (
    SELECT
      (SELECT COUNT(*) FROM in_window iw JOIN firsts f ON f.customer_id = iw.customer_id
        WHERE f.first_date BETWEEN p_start AND p_end)::bigint AS new_customers,
      (SELECT COUNT(*) FROM in_window iw JOIN firsts f ON f.customer_id = iw.customer_id
        WHERE f.first_date < p_start)::bigint AS returning_customers
  )
  SELECT
    r.revenue,
    r.orders,
    u.units,
    CASE WHEN r.orders > 0 THEN ROUND(r.revenue / r.orders, 2) ELSE 0 END AS aov,
    nr.new_customers,
    nr.returning_customers,
    CASE WHEN (nr.new_customers + nr.returning_customers) > 0
         THEN nr.returning_customers::double precision / (nr.new_customers + nr.returning_customers)
         ELSE 0 END AS returning_rate
  FROM r, u, nr;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'fn_summary failed: % (start=%, end=%)', SQLERRM, p_start, p_end
      USING ERRCODE = 'XX000';
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION fn_top_products(p_start date, p_end date, p_limit int DEFAULT 10)
RETURNS TABLE (
  product_id bigint,
  name text,
  units bigint,
  revenue numeric
) AS $$
BEGIN
  IF p_start IS NULL OR p_end IS NULL OR p_end < p_start THEN
    RAISE EXCEPTION 'fn_top_products: invalid date range: % -> %', p_start, p_end
      USING ERRCODE = '22007';
  END IF;

  RETURN QUERY
  SELECT p.id, p.name,
         COALESCE(SUM(oi.quantity),0)::bigint      AS units,
         COALESCE(SUM(oi.line_total),0)::numeric   AS revenue
  FROM order_items oi
  JOIN orders o   ON o.id = oi.order_id AND o.status = 'PAID'
  JOIN products p ON p.id = oi.product_id
  WHERE o.order_date BETWEEN p_start AND p_end
  GROUP BY p.id, p.name
  ORDER BY revenue DESC, units DESC
  LIMIT COALESCE(p_limit,10);

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'fn_top_products failed: % (start=%, end=%)', SQLERRM, p_start, p_end
      USING ERRCODE = 'XX000';
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION fn_top_categories(p_start date, p_end date, p_limit int DEFAULT 10)
RETURNS TABLE (
  category_id bigint,
  name text,
  units bigint,
  revenue numeric
) AS $$
BEGIN
  IF p_start IS NULL OR p_end IS NULL OR p_end < p_start THEN
    RAISE EXCEPTION 'fn_top_categories: invalid date range: % -> %', p_start, p_end
      USING ERRCODE = '22007';
  END IF;

  RETURN QUERY
  SELECT c.id, c.name,
         COALESCE(SUM(oi.quantity),0)::bigint      AS units,
         COALESCE(SUM(oi.line_total),0)::numeric   AS revenue
  FROM order_items oi
  JOIN orders o      ON o.id = oi.order_id AND o.status = 'PAID'
  JOIN products p    ON p.id = oi.product_id
  JOIN product_categories pc ON pc.product_id = p.id
  JOIN categories c   ON c.id = pc.category_id
  WHERE o.order_date BETWEEN p_start AND p_end
  GROUP BY c.id, c.name
  ORDER BY revenue DESC, units DESC
  LIMIT COALESCE(p_limit,10);

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'fn_top_categories failed: % (start=%, end=%)', SQLERRM, p_start, p_end
      USING ERRCODE = 'XX000';
END;
$$ LANGUAGE plpgsql STABLE;


CREATE OR REPLACE FUNCTION fn_top_customers(p_start date, p_end date, p_limit int DEFAULT 10)
RETURNS TABLE (
  customer_id bigint,
  name_or_email text,
  orders bigint,
  revenue numeric,
  last_order date
) AS $$
BEGIN
  IF p_start IS NULL OR p_end IS NULL OR p_end < p_start THEN
    RAISE EXCEPTION 'fn_top_customers: invalid date range: % -> %', p_start, p_end
      USING ERRCODE = '22007';
  END IF;

  RETURN QUERY
  SELECT c.id,
         COALESCE(NULLIF(c.name, ''), c.email)     AS name_or_email,
         COUNT(o.id)::bigint                       AS orders,
         COALESCE(SUM(o.grand_total),0)::numeric  AS revenue,
         MAX(o.order_date)::date                   AS last_order
  FROM orders o
  JOIN customers c ON c.id = o.customer_id
  WHERE o.order_date BETWEEN p_start AND p_end
    AND o.status = 'PAID'
  GROUP BY c.id, name_or_email
  ORDER BY revenue DESC, orders DESC
  LIMIT COALESCE(p_limit,10);

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'fn_top_customers failed: % (start=%, end=%)', SQLERRM, p_start, p_end
      USING ERRCODE = 'XX000';
END;
$$ LANGUAGE plpgsql STABLE;
