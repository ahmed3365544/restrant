/*
  # Menu Management Schema

  1. New Tables
    - `categories` - Food categories
    - `menu_items` - Menu items with prices and images
    - `orders` - Customer orders
    - `order_items` - Items in each order

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  menu_item_id INTEGER REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Allow public read access to categories"
  ON categories
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow authenticated users to manage categories"
  ON categories
  USING (auth.role() = 'authenticated');

-- Create policies for menu_items
CREATE POLICY "Allow public read access to menu_items"
  ON menu_items
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow authenticated users to manage menu_items"
  ON menu_items
  USING (auth.role() = 'authenticated');

-- Create policies for orders
CREATE POLICY "Allow authenticated users to manage orders"
  ON orders
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to create orders"
  ON orders
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

-- Create policies for order_items
CREATE POLICY "Allow authenticated users to manage order_items"
  ON order_items
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to create order_items"
  ON order_items
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);