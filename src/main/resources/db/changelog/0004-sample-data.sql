-- Simple demo data (safe to re-run: uses ON CONFLICT where helpful)

-- Customers
INSERT INTO customers (id, email, name, created_at, active) VALUES
  (1001, 'alice@example.com', 'Alice', NOW() AT TIME ZONE 'UTC', true),
  (1002, 'bob@example.com',   'Bob',   NOW() AT TIME ZONE 'UTC', true),
  (1003, 'chris@example.com', 'Chris', NOW() AT TIME ZONE 'UTC', true)
ON CONFLICT DO NOTHING;

-- Categories
INSERT INTO categories (id, name) VALUES
  (2001, 'Accessories'),
  (2002, 'Apparel'),
  (2003, 'Electronics')
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO products (id, sku, name, unit_price, currency, active, created_at) VALUES
  (3001, 'ACC-001', 'Leather Wallet',     35.00, 'USD', true, NOW() AT TIME ZONE 'UTC'),
  (3002, 'APP-001', 'Graphic T-Shirt',    22.00, 'USD', true, NOW() AT TIME ZONE 'UTC'),
  (3003, 'ELE-001', 'Wireless Headphones',99.00, 'USD', true, NOW() AT TIME ZONE 'UTC'),
  (3004, 'APP-002', 'Hoodie',              55.00, 'USD', true, NOW() AT TIME ZONE 'UTC')
ON CONFLICT DO NOTHING;

-- Product ↔ Category
INSERT INTO product_categories (product_id, category_id) VALUES
  (3001, 2001),
  (3002, 2002),
  (3003, 2003),
  (3004, 2002)
ON CONFLICT DO NOTHING;

-- Orders (spread over last ~30 days)
-- Helper: choose dates relative to now for easy testing
DO $$
DECLARE
  d1 date := (CURRENT_DATE - INTERVAL '21 days')::date;
  d2 date := (CURRENT_DATE - INTERVAL '14 days')::date;
  d3 date := (CURRENT_DATE - INTERVAL '7 days')::date;
  d4 date := (CURRENT_DATE - INTERVAL '1 days')::date;
BEGIN
  -- Alice orders
  INSERT INTO orders (id, customer_id, order_date, status, subtotal, tax, shipping, discount, grand_total, currency, created_at)
  VALUES
    (4001, 1001, d1, 'PAID',  35.00, 3.50, 5.00, 0.00, 43.50, 'USD', NOW() AT TIME ZONE 'UTC'),
    (4002, 1001, d3, 'PAID',  77.00, 7.70, 0.00, 5.00, 79.70, 'USD', NOW() AT TIME ZONE 'UTC')
  ON CONFLICT DO NOTHING;

  -- Bob orders (one refunded to test filters)
  INSERT INTO orders (id, customer_id, order_date, status, subtotal, tax, shipping, discount, grand_total, currency, created_at)
  VALUES
    (4003, 1002, d2, 'PAID',      121.00, 12.10, 0.00, 0.00, 133.10, 'USD', NOW() AT TIME ZONE 'UTC'),
    (4004, 1002, d4, 'REFUNDED',   22.00,  2.20, 0.00, 0.00,  24.20, 'USD', NOW() AT TIME ZONE 'UTC')
  ON CONFLICT DO NOTHING;

  -- Chris order
  INSERT INTO orders (id, customer_id, order_date, status, subtotal, tax, shipping, discount, grand_total, currency, created_at)
  VALUES
    (4005, 1003, CURRENT_DATE, 'PAID', 99.00, 9.90, 0.00, 0.00, 108.90, 'USD', NOW() AT TIME ZONE 'UTC')
  ON CONFLICT DO NOTHING;

  -- Items
  INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, line_total, currency) VALUES
    (5001, 4001, 3001, 1, 35.00, 35.00, 'USD'),
    (5002, 4002, 3002, 1, 22.00, 22.00, 'USD'),
    (5003, 4002, 3004, 1, 55.00, 55.00, 'USD'),
    (5004, 4003, 3003, 1, 99.00, 99.00, 'USD'),
    (5005, 4003, 3001, 1, 22.00, 22.00, 'USD'),
    (5006, 4004, 3002, 1, 22.00, 22.00, 'USD'), -- refunded order; should NOT count in PAID analytics
    (5007, 4005, 3003, 1, 99.00, 99.00, 'USD')
  ON CONFLICT DO NOTHING;
END$$;
