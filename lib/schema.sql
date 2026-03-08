-- Mercenary E-Commerce Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL DEFAULT '',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
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
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Messages: authenticated users can insert their own
CREATE POLICY "Users can insert their own messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Messages: users can view their own messages
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
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Optional: seed some sample products
INSERT INTO products (name, description, price, stock, image_url, sizes) VALUES
  ('Mercenary Shadow Tee', 'Minimal black tactical shirt designed for everyday wear.', 850, 25, '', ARRAY['S', 'M', 'L', 'XL']),
  ('Mercenary Phantom Hoodie', 'Stealth-style hoodie with clean lines and muted branding.', 1450, 15, '', ARRAY['S', 'M', 'L', 'XL']),
  ('Mercenary Vanguard Tee', 'Premium cotton tee with subtle chest graphic.', 950, 30, '', ARRAY['S', 'M', 'L', 'XL']),
  ('Mercenary Ops Longline', 'Extended cut tee for a modern silhouette.', 1050, 20, '', ARRAY['M', 'L', 'XL']);
