/*
# Nogthy Store - Complete Database Schema

1. New Tables
- `categories`: Product categories (Streaming, Musica, Aplicativos)
  - id (uuid, PK), name, slug, icon, sort_order, created_at
- `products`: Digital subscription products
  - id, name, slug, category_id (FK), price, original_price, duration, description, 
    logo_color, logo_gradient, logo_icon, featured_content (jsonb), stock, active, sort_order, created_at, updated_at
- `orders`: Customer orders
  - id, product_id (FK), customer_name, customer_email, customer_phone, status, total, created_at, updated_at
- `payments`: Payment records
  - id, order_id (FK), provider, provider_payment_id, status, qr_code, qr_code_base64, pix_copia_cola, expires_at, paid_at, created_at, updated_at

2. Security
- RLS enabled on all tables
- Single-tenant (no auth) - public read/write for storefront operations

3. Notes
- Stock = -1 means unlimited inventory
- Logo fields stored inline for rendering without external dependencies
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL DEFAULT 0,
  original_price numeric(10,2),
  duration text NOT NULL DEFAULT '1 mês',
  description text NOT NULL DEFAULT '',
  logo_color text NOT NULL DEFAULT '#4B0082',
  logo_gradient text NOT NULL DEFAULT 'from-purple-700 to-purple-900',
  logo_icon text NOT NULL DEFAULT '?',
  featured_content jsonb NOT NULL DEFAULT '[]'::jsonb,
  stock integer NOT NULL DEFAULT -1,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'delivered', 'cancelled')),
  total numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'mercado_pago',
  provider_payment_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'refunded')),
  qr_code text,
  qr_code_base64 text,
  pix_copia_cola text,
  expires_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_all_categories" ON categories;
CREATE POLICY "public_all_categories" ON categories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_all_products" ON products;
CREATE POLICY "public_all_products" ON products FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_all_orders" ON orders;
CREATE POLICY "public_all_orders" ON orders FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_all_payments" ON payments;
CREATE POLICY "public_all_payments" ON payments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
