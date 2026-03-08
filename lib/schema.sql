-- Mercenary E-Commerce Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product variants: one row per (product, size) with its own stock count
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  UNIQUE(product_id, size)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  reply TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Product variants: anyone can read
DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON product_variants;
CREATE POLICY "Product variants are viewable by everyone"
  ON product_variants FOR SELECT
  USING (true);

-- Messages: authenticated users can insert their own
DROP POLICY IF EXISTS "Users can insert their own messages" ON messages;
CREATE POLICY "Users can insert their own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Messages: users can view their own messages
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = user_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products updated_at
DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Optional: seed some sample products with per-size stock
WITH inserted AS (
  INSERT INTO products (name, description, price, image_url) VALUES
    ('Mercenary Shadow Tee', 'Minimal black tactical shirt designed for everyday wear.', 850, ''),
    ('Mercenary Phantom Hoodie', 'Stealth-style hoodie with clean lines and muted branding.', 1450, ''),
    ('Mercenary Vanguard Tee', 'Premium cotton tee with subtle chest graphic.', 950, ''),
    ('Mercenary Ops Longline', 'Extended cut tee for a modern silhouette.', 1050, '')
  RETURNING id, name
)
INSERT INTO product_variants (product_id, size, stock)
SELECT id, size, stock FROM inserted
CROSS JOIN (VALUES ('S', 10), ('M', 15), ('L', 12), ('XL', 8)) AS v(size, stock)
WHERE name IN ('Mercenary Shadow Tee', 'Mercenary Phantom Hoodie', 'Mercenary Vanguard Tee')
UNION ALL
SELECT id, size, stock FROM inserted
CROSS JOIN (VALUES ('M', 10), ('L', 8), ('XL', 5)) AS v(size, stock)
WHERE name = 'Mercenary Ops Longline';

-- ============================================================
-- Supabase Storage – product-images bucket
-- Run this AFTER the tables above.
-- ============================================================

-- Create a public bucket for product images (5 MB limit, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read (public bucket)
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Service role uploads bypass RLS automatically — no extra policy needed for writes.
