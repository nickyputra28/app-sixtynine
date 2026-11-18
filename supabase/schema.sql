-- ============================================================================
-- SIXTYNINE SKATE STORE YOGYAKARTA — SUPABASE DATABASE SCHEMA & SEED SQL
-- Jalankan seluruh script ini di Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================================

-- Aktifkan ekstensi UUID jika belum aktif
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TABEL PROFILES (Terhubung ke Supabase Auth `auth.users`)
-- Menyimpan data profil member dari form Login / Register & alamat default
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone_whatsapp TEXT,
  full_name TEXT DEFAULT 'Skater Member',
  default_province TEXT DEFAULT 'DKI Jakarta',
  default_city TEXT DEFAULT 'Jakarta Selatan',
  default_district TEXT DEFAULT 'Kebayoran Baru',
  default_postal_code TEXT DEFAULT '12180',
  default_address TEXT DEFAULT 'Jl. Senopati No. 42B, RT 04 / RW 02, Kebayoran Baru, Jakarta Selatan',
  member_discount_eligible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger otomatis membuat baris di `public.profiles` saat user baru daftar di `auth.users`
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone_whatsapp, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone_whatsapp', NEW.phone),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, 'Skater'), '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. TABEL PRODUCTS (Katalog Sepatu Vans & Backpack)
-- Menyimpan seluruh informasi produk untuk Beranda, Katalog, dan Detail Produk
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY, -- slug produk, misal: 'vans-sk8-low-classic'
  beranda_name TEXT NOT NULL,
  katalog_lines JSONB NOT NULL DEFAULT '[]'::jsonb,
  full_name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category_tag TEXT NOT NULL,
  katalog_brand_tag TEXT NOT NULL,
  archive_tag TEXT NOT NULL,
  category_type TEXT NOT NULL CHECK (category_type IN ('sepatu', 'backpack')),
  price_number INTEGER NOT NULL,
  price_formatted TEXT NOT NULL,
  original_price_formatted TEXT NOT NULL,
  discount_badge TEXT NOT NULL,
  rating TEXT NOT NULL DEFAULT '5.0',
  sold_count INTEGER NOT NULL DEFAULT 0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  beranda_badge TEXT NOT NULL,
  beranda_badge_variant TEXT NOT NULL CHECK (beranda_badge_variant IN ('red', 'white')),
  katalog_badge TEXT NOT NULL,
  katalog_badge_style TEXT NOT NULL CHECK (katalog_badge_style IN ('red', 'white', 'dark')),
  katalog_meta TEXT NOT NULL,
  image TEXT NOT NULL,
  thumbnails JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  default_size_index INTEGER NOT NULL DEFAULT 8,
  stock INTEGER NOT NULL DEFAULT 25,
  order_number_template TEXT NOT NULL,
  resi_number_template TEXT NOT NULL,
  invoice_number_template TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. TABEL CART_ITEMS (Keranjang Belanja Member / Guest Session)
-- Menyimpan item yang dimasukkan ke keranjang dari Beranda, Katalog, atau PDP
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  selected_size_index INTEGER NOT NULL DEFAULT 8,
  selected_size_label TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_session ON public.cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);

-- ============================================================================
-- 4. TABEL ORDERS (Transaksi Checkout, Alamat Pengiriman & Pembayaran QRIS)
-- Menyimpan seluruh input form dari halaman Checkout & Pembayaran QRIS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,   -- contoh: '#SXN-SC-8824'
  invoice_number TEXT NOT NULL,        -- contoh: '#69-202410-02'
  resi_number TEXT NOT NULL,           -- contoh: 'JT882910482910'
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  selected_size_index INTEGER NOT NULL DEFAULT 8,
  selected_size_label TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  -- Data Alamat Tujuan Pelanggan (Form Checkout)
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  full_address TEXT NOT NULL,
  -- Data Ekspedisi & Kalkulasi Biaya
  courier_code TEXT NOT NULL CHECK (courier_code IN ('ez', 'super')),
  courier_service_name TEXT NOT NULL,
  estimated_delivery TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER NOT NULL,
  discount_amount INTEGER NOT NULL DEFAULT 15000,
  service_fee INTEGER NOT NULL DEFAULT 0,
  grand_total INTEGER NOT NULL,
  -- Status Pembayaran & Logistik
  payment_method TEXT NOT NULL DEFAULT 'QRIS_DINAMIS',
  qris_nmid TEXT NOT NULL DEFAULT 'ID1024889218903',
  payment_status TEXT NOT NULL DEFAULT 'PAID_VERIFIED',
  current_logistics_status TEXT NOT NULL DEFAULT 'Paket Sedang Transit di Gateway Sortir J&T',
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_session ON public.orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);

-- ============================================================================
-- 5. TABEL ORDER_TRACKING_LOGS (Timeline Histori Perjalanan Logistik J&T)
-- Menyimpan tahapan pelacakan resi pada halaman Status Pesanan & Lacak Resi
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_tracking_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  status_title TEXT NOT NULL,
  badge_text TEXT,
  description TEXT NOT NULL,
  time_label TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_order_id ON public.order_tracking_logs(order_id);

-- Trigger otomatis membuat 4 histori perjalanan logistik saat pesanan baru dibuat
CREATE OR REPLACE FUNCTION public.seed_order_tracking_logs()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.order_tracking_logs (order_id, step_order, status_title, badge_text, description, time_label, is_active)
  VALUES
    (NEW.id, 1, 'TRANSIT GATEWAY SORTIR J&T', 'TERBARU', 'Paket telah tiba di pusat sortir transit logistik [Gateway Kulon Progo / Jogja Interchange].', '14:55 WIB // HARI INI', TRUE),
    (NEW.id, 2, 'DROP POINT J&T YOGYAKARTA', NULL, 'Paket diserahkan oleh tim dispatch SIXTYNINE Warehouse ke J&T Express.', '14:10 WIB // HARI INI', FALSE),
    (NEW.id, 3, 'QUALITY CHECK & DOUBLE-BOX PACKAGING', NULL, 'Produk lulus sertifikasi QC skate shop & disegel bubble wrap tebal.', '13:45 WIB // HARI INI', FALSE),
    (NEW.id, 4, 'PESANAN DIBUAT & TERKONFIRMASI QRIS', NULL, 'Pembayaran lunas via QRIS Instant Settlement.', '13:30 WIB // HARI INI', FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_created_seed_tracking ON public.orders;
CREATE TRIGGER on_order_created_seed_tracking
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.seed_order_tracking_logs();

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- Mengizinkan akses baca publik pada katalog & akses baca/tulis pada keranjang/order
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking_logs ENABLE ROW LEVEL SECURITY;

-- Policies untuk profiles
DROP POLICY IF EXISTS "Public profiles readable by owner" ON public.profiles;
CREATE POLICY "Public profiles readable by owner" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies untuk products (Semua pengunjung bisa melihat produk)
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

-- Policies untuk cart_items (Mendukung Guest Session maupun Authenticated User)
DROP POLICY IF EXISTS "Anyone can manage cart items" ON public.cart_items;
CREATE POLICY "Anyone can manage cart items" ON public.cart_items
  FOR ALL USING (true) WITH CHECK (true);

-- Policies untuk orders (Mendukung Guest Checkout maupun Authenticated Member)
DROP POLICY IF EXISTS "Anyone can create and view orders" ON public.orders;
CREATE POLICY "Anyone can create and view orders" ON public.orders
  FOR ALL USING (true) WITH CHECK (true);

-- Policies untuk order_tracking_logs
DROP POLICY IF EXISTS "Anyone can view order tracking logs" ON public.order_tracking_logs;
CREATE POLICY "Anyone can view order tracking logs" ON public.order_tracking_logs
  FOR SELECT USING (true);

-- ============================================================================
-- 7. SEED DATA: 6 PRODUK RESMI SIXTYNINE YOGYAKARTA (SESUAI DESAIN FIGMA)
-- ============================================================================
INSERT INTO public.products (
  id, beranda_name, katalog_lines, full_name, subtitle,
  category_tag, katalog_brand_tag, archive_tag, category_type,
  price_number, price_formatted, original_price_formatted, discount_badge,
  rating, sold_count, reviews_count,
  beranda_badge, beranda_badge_variant, katalog_badge, katalog_badge_style, katalog_meta,
  image, thumbnails, description, specs, sizes, default_size_index,
  order_number_template, resi_number_template, invoice_number_template
) VALUES
(
  'vans-sk8-low-contrast',
  'Vans Sk8-Low…',
  '["Vans Sk8-Low", "Contrast Black"]'::jsonb,
  'VANS SK8-LOW CONTRAST BLACK',
  'Contrast Black / White Stitch Original',
  'SKATE LOW',
  'VANS SKATE',
  'SKATE ARCHIVE // VANS CONTRAST',
  'sepatu',
  650000, 'Rp 650.000', 'Rp 999.000', '-35%',
  '4.9', 48, 94,
  '100% ORIGINAL', 'red', 'NEW DROP', 'white', 'Size 40 - 44 | BNIB',
  '/images/prod-sk8low-contrast-176857.png',
  '[{"label":"SAMPING","image":"/images/prod-sk8low-contrast-176857.png"},{"label":"DETAIL","image":"/images/sk8low-contrast-detail.png"},{"label":"OUTSOLE","image":"/images/sk8low-contrast-outsole.jpg"},{"label":"BOX ASLI","image":"/images/sk8low-contrast-box.jpg"}]'::jsonb,
  'Edisi spesial Vans Sk8-Low dengan jahitan kontras putih di atas suede dan kanvas hitam pekat. Memberikan tampilan tegas khas skena skate jalanan dengan daya tahan ekstra pada area ollie dan konstruksi sol vulkanisir.',
  '[{"label":"UPPER MATERIAL","value":"Heavy Suede & Canvas"},{"label":"OUTSOLE","value":"Signature Waffle Sole"},{"label":"KONSTRUKSI","value":"Contrast Stitch Pro"},{"label":"SKU / SERI","value":"VN0A4UUK187"}]'::jsonb,
  '[{"us":"US 4.5","eurCm":"EUR 36 • 22.5cm","fullLabel":"US 4.5 // EUR 36 (22.5 cm)"},{"us":"US 5","eurCm":"EUR 36.5 • 23cm","fullLabel":"US 5 // EUR 36.5 (23 cm)"},{"us":"US 5.5","eurCm":"EUR 37 • 23.5cm","fullLabel":"US 5.5 // EUR 37 (23.5 cm)"},{"us":"US 6","eurCm":"EUR 38 • 24cm","fullLabel":"US 6 // EUR 38 (24 cm)"},{"us":"US 6.5","eurCm":"EUR 38.5 • 24.5cm","fullLabel":"US 6.5 // EUR 38.5 (24.5 cm)"},{"us":"US 7","eurCm":"EUR 39 • 25cm","fullLabel":"US 7 // EUR 39 (25 cm)"},{"us":"US 7.5","eurCm":"EUR 40 • 25.5cm","fullLabel":"US 7.5 // EUR 40 (25.5 cm)"},{"us":"US 8","eurCm":"EUR 40.5 • 26cm","fullLabel":"US 8 // EUR 40.5 (26 cm)"},{"us":"US 8.5","eurCm":"EUR 41 • 26.5cm","fullLabel":"US 8.5 // EUR 41 (26.5 cm)"},{"us":"US 9","eurCm":"EUR 42 • 27cm","fullLabel":"US 9 // EUR 42 (27 cm)"},{"us":"US 9.5","eurCm":"EUR 42.5 • 27.5cm","fullLabel":"US 9.5 // EUR 42.5 (27.5 cm)"},{"us":"US 10","eurCm":"EUR 43 • 28cm","fullLabel":"US 10 // EUR 43 (28 cm)"},{"us":"US 10.5","eurCm":"EUR 44 • 28.5cm","fullLabel":"US 10.5 // EUR 44 (28.5 cm)"},{"us":"US 11","eurCm":"EUR 44.5 • 29cm","fullLabel":"US 11 // EUR 44.5 (29 cm)"}]'::jsonb,
  8, '#SXN-SL-8812', 'JT882910481102', '#69-202410-01'
),
(
  'vans-sk8-low-classic',
  'Vans Sk8-Low Classic',
  '["Vans Sk8-Low Classic", "Black White"]'::jsonb,
  'VANS SK8-LOW CLASSIC BLACK WHITE',
  'Black / True White Original',
  'SKATE LOW',
  'VANS SKATE',
  'SKATE ARCHIVE // VANS CORE',
  'sepatu',
  650000, 'Rp 650.000', 'Rp 999.000', '-35%',
  '5.0', 89, 128,
  'HOT DROP', 'white', 'BEST SELLER', 'red', 'Size 39 - 44 | BNIB',
  '/images/prod-sk8low-classic-176857.png',
  '[{"label":"SAMPING","image":"/images/prod-sk8low-classic-176857.png"},{"label":"DETAIL","image":"/images/sk8low-classic-detail.jpg"},{"label":"OUTSOLE","image":"/images/sk8low-classic-outsole.jpg"},{"label":"BOX ASLI","image":"/images/sk8low-classic-box.jpg"}]'::jsonb,
  'Siluet legendaris Sk8-Hi dalam versi low-top yang fleksibel. Dibuat dengan kanvas premium dan suede kokoh, sol waffle karet vulkanisir khas Vans untuk cengkeraman papan skate maksimal. Dilengkapi kerah berlapis empuk untuk kenyamanan sepanjang hari di jalanan maupun arena skate.',
  '[{"label":"UPPER MATERIAL","value":"Canvas & Suede Kokoh"},{"label":"OUTSOLE","value":"Signature Waffle Sole"},{"label":"KONSTRUKSI","value":"Vulcanized Boardfeel"},{"label":"SKU / SERI","value":"VN0A4UUKBKA"}]'::jsonb,
  '[{"us":"US 4.5","eurCm":"EUR 36 • 22.5cm","fullLabel":"US 4.5 // EUR 36 (22.5 cm)"},{"us":"US 5","eurCm":"EUR 36.5 • 23cm","fullLabel":"US 5 // EUR 36.5 (23 cm)"},{"us":"US 5.5","eurCm":"EUR 37 • 23.5cm","fullLabel":"US 5.5 // EUR 37 (23.5 cm)"},{"us":"US 6","eurCm":"EUR 38 • 24cm","fullLabel":"US 6 // EUR 38 (24 cm)"},{"us":"US 6.5","eurCm":"EUR 38.5 • 24.5cm","fullLabel":"US 6.5 // EUR 38.5 (24.5 cm)"},{"us":"US 7","eurCm":"EUR 39 • 25cm","fullLabel":"US 7 // EUR 39 (25 cm)"},{"us":"US 7.5","eurCm":"EUR 40 • 25.5cm","fullLabel":"US 7.5 // EUR 40 (25.5 cm)"},{"us":"US 8","eurCm":"EUR 40.5 • 26cm","fullLabel":"US 8 // EUR 40.5 (26 cm)"},{"us":"US 8.5","eurCm":"EUR 41 • 26.5cm","fullLabel":"US 8.5 // EUR 41 (26.5 cm)"},{"us":"US 9","eurCm":"EUR 42 • 27cm","fullLabel":"US 9 // EUR 42 (27 cm)"},{"us":"US 9.5","eurCm":"EUR 42.5 • 27.5cm","fullLabel":"US 9.5 // EUR 42.5 (27.5 cm)"},{"us":"US 10","eurCm":"EUR 43 • 28cm","fullLabel":"US 10 // EUR 43 (28 cm)"},{"us":"US 10.5","eurCm":"EUR 44 • 28.5cm","fullLabel":"US 10.5 // EUR 44 (28.5 cm)"},{"us":"US 11","eurCm":"EUR 44.5 • 29cm","fullLabel":"US 11 // EUR 44.5 (29 cm)"}]'::jsonb,
  8, '#SXN-SC-8824', 'JT882910482409', '#69-202410-02'
),
(
  'vans-old-skool-classic',
  'Vans Old Skool Classic',
  '["Vans Old Skool Classic"]'::jsonb,
  'VANS OLD SKOOL CLASSIC BLACK WHITE',
  'Black White // Canvas & Suede',
  'HERITAGE OLD SKOOL',
  'VANS CLASSIC',
  'HERITAGE ARCHIVE // OLD SKOOL',
  'sepatu',
  600000, 'Rp 600.000', 'Rp 899.000', '-33%',
  '4.9', 142, 215,
  '100% ORIGINAL', 'red', 'ICONIC', 'dark', 'Size 38 - 43 | BNIB',
  '/images/prod-oldskool-classic-176857.png',
  '[{"label":"SAMPING","image":"/images/prod-oldskool-classic-176857.png"},{"label":"DETAIL","image":"/images/oldskool-classic-detail.jpg"},{"label":"OUTSOLE","image":"/images/oldskool-classic-outsole.jpg"},{"label":"BOX ASLI","image":"/images/oldskool-classic-box.jpg"}]'::jsonb,
  'Sepatu skate klasik pertama yang menampilkan Sidestripe ikonik Vans. Menggabungkan upper suede dan kanvas tahan lama dengan toe cap yang diperkuat untuk menahan gesekan griptape berulang.',
  '[{"label":"UPPER MATERIAL","value":"Suede & 10oz Canvas"},{"label":"OUTSOLE","value":"Gum Rubber Waffle"},{"label":"KONSTRUKSI","value":"Reinforced Toe Cap"},{"label":"SKU / SERI","value":"VN000D3HY28"}]'::jsonb,
  '[{"us":"US 4.5","eurCm":"EUR 36 • 22.5cm","fullLabel":"US 4.5 // EUR 36 (22.5 cm)"},{"us":"US 5","eurCm":"EUR 36.5 • 23cm","fullLabel":"US 5 // EUR 36.5 (23 cm)"},{"us":"US 5.5","eurCm":"EUR 37 • 23.5cm","fullLabel":"US 5.5 // EUR 37 (23.5 cm)"},{"us":"US 6","eurCm":"EUR 38 • 24cm","fullLabel":"US 6 // EUR 38 (24 cm)"},{"us":"US 6.5","eurCm":"EUR 38.5 • 24.5cm","fullLabel":"US 6.5 // EUR 38.5 (24.5 cm)"},{"us":"US 7","eurCm":"EUR 39 • 25cm","fullLabel":"US 7 // EUR 39 (25 cm)"},{"us":"US 7.5","eurCm":"EUR 40 • 25.5cm","fullLabel":"US 7.5 // EUR 40 (25.5 cm)"},{"us":"US 8","eurCm":"EUR 40.5 • 26cm","fullLabel":"US 8 // EUR 40.5 (26 cm)"},{"us":"US 8.5","eurCm":"EUR 41 • 26.5cm","fullLabel":"US 8.5 // EUR 41 (26.5 cm)"},{"us":"US 9","eurCm":"EUR 42 • 27cm","fullLabel":"US 9 // EUR 42 (27 cm)"},{"us":"US 9.5","eurCm":"EUR 42.5 • 27.5cm","fullLabel":"US 9.5 // EUR 42.5 (27.5 cm)"},{"us":"US 10","eurCm":"EUR 43 • 28cm","fullLabel":"US 10 // EUR 43 (28 cm)"},{"us":"US 10.5","eurCm":"EUR 44 • 28.5cm","fullLabel":"US 10.5 // EUR 44 (28.5 cm)"},{"us":"US 11","eurCm":"EUR 44.5 • 29cm","fullLabel":"US 11 // EUR 44.5 (29 cm)"}]'::jsonb,
  8, '#SXN-OS-8831', 'JT882910482910', '#69-202410-03'
),
(
  'vans-authentic-red',
  'Vans Authentic Red',
  '["Vans Authentic Red"]'::jsonb,
  'VANS AUTHENTIC RACING RED WHITE',
  'Racing Red / True White Canvas',
  'CLASSIC AUTHENTIC',
  'VANS HERITAGE',
  'ANAHEIM HERITAGE // AUTHENTIC 66',
  'sepatu',
  550000, 'Rp 550.000', 'Rp 799.000', '-31%',
  '4.8', 36, 64,
  '100% ORIGINAL', 'red', 'SPECIAL', 'red', 'Size 40 - 42 | BNIB',
  '/images/prod-authentic-red-176857.png',
  '[{"label":"SAMPING","image":"/images/prod-authentic-red-176857.png"},{"label":"DETAIL","image":"/images/authentic-red-detail.jpg"},{"label":"OUTSOLE","image":"/images/authentic-red-outsole.jpg"},{"label":"BOX ASLI","image":"/images/authentic-red-box.png"}]'::jsonb,
  'Lahir di Anaheim pada tahun 1966, Vans Authentic adalah siluet orisinal yang memulai segalanya. Warna Racing Red ikonik dengan kanvas kokoh, eyelet logam, dan sol waffle khas.',
  '[{"label":"UPPER MATERIAL","value":"Sturdy Woven Canvas"},{"label":"OUTSOLE","value":"Original Waffle Sole"},{"label":"KONSTRUKSI","value":"Low-Top Lace-Up"},{"label":"SKU / SERI","value":"VN000EE3RED"}]'::jsonb,
  '[{"us":"US 4.5","eurCm":"EUR 36 • 22.5cm","fullLabel":"US 4.5 // EUR 36 (22.5 cm)"},{"us":"US 5","eurCm":"EUR 36.5 • 23cm","fullLabel":"US 5 // EUR 36.5 (23 cm)"},{"us":"US 5.5","eurCm":"EUR 37 • 23.5cm","fullLabel":"US 5.5 // EUR 37 (23.5 cm)"},{"us":"US 6","eurCm":"EUR 38 • 24cm","fullLabel":"US 6 // EUR 38 (24 cm)"},{"us":"US 6.5","eurCm":"EUR 38.5 • 24.5cm","fullLabel":"US 6.5 // EUR 38.5 (24.5 cm)"},{"us":"US 7","eurCm":"EUR 39 • 25cm","fullLabel":"US 7 // EUR 39 (25 cm)"},{"us":"US 7.5","eurCm":"EUR 40 • 25.5cm","fullLabel":"US 7.5 // EUR 40 (25.5 cm)"},{"us":"US 8","eurCm":"EUR 40.5 • 26cm","fullLabel":"US 8 // EUR 40.5 (26 cm)"},{"us":"US 8.5","eurCm":"EUR 41 • 26.5cm","fullLabel":"US 8.5 // EUR 41 (26.5 cm)"},{"us":"US 9","eurCm":"EUR 42 • 27cm","fullLabel":"US 9 // EUR 42 (27 cm)"},{"us":"US 9.5","eurCm":"EUR 42.5 • 27.5cm","fullLabel":"US 9.5 // EUR 42.5 (27.5 cm)"},{"us":"US 10","eurCm":"EUR 43 • 28cm","fullLabel":"US 10 // EUR 43 (28 cm)"},{"us":"US 10.5","eurCm":"EUR 44 • 28.5cm","fullLabel":"US 10.5 // EUR 44 (28.5 cm)"},{"us":"US 11","eurCm":"EUR 44.5 • 29cm","fullLabel":"US 11 // EUR 44.5 (29 cm)"}]'::jsonb,
  8, '#SXN-AR-8845', 'JT882910484519', '#69-202410-04'
),
(
  'vans-authentic-black',
  'Vans Authentic Black',
  '["Vans Authentic Black", "White"]'::jsonb,
  'VANS AUTHENTIC CLASSIC BLACK WHITE',
  'Black / True White Core Canvas',
  'CLASSIC AUTHENTIC',
  'VANS CORE',
  'ANAHEIM HERITAGE // CORE BLACK',
  'sepatu',
  500000, 'Rp 500.000', 'Rp 749.000', '-33%',
  '5.0', 98, 156,
  '100% ORIGINAL', 'red', 'ESSENTIAL', 'white', 'Size 39 - 43 | BNIB',
  '/images/prod-authentic-black-176857.png',
  '[{"label":"SAMPING","image":"/images/prod-authentic-black-176857.png"},{"label":"DETAIL","image":"/images/authentic-black-detail.jpg"},{"label":"OUTSOLE","image":"/images/authentic-black-outsole.jpg"},{"label":"BOX ASLI","image":"/images/authentic-black-box.jpg"}]'::jsonb,
  'Siluet esensial harian dari keluarga Vans. Kanvas hitam klasik dengan midsole putih bersih dan cengkeraman waffle karet yang sudah teruji di kultur skateboard dunia.',
  '[{"label":"UPPER MATERIAL","value":"100% Heavyweight Canvas"},{"label":"OUTSOLE","value":"Signature Waffle Sole"},{"label":"KONSTRUKSI","value":"Heritage Vulcanized"},{"label":"SKU / SERI","value":"VN000EE3BLK"}]'::jsonb,
  '[{"us":"US 4.5","eurCm":"EUR 36 • 22.5cm","fullLabel":"US 4.5 // EUR 36 (22.5 cm)"},{"us":"US 5","eurCm":"EUR 36.5 • 23cm","fullLabel":"US 5 // EUR 36.5 (23 cm)"},{"us":"US 5.5","eurCm":"EUR 37 • 23.5cm","fullLabel":"US 5.5 // EUR 37 (23.5 cm)"},{"us":"US 6","eurCm":"EUR 38 • 24cm","fullLabel":"US 6 // EUR 38 (24 cm)"},{"us":"US 6.5","eurCm":"EUR 38.5 • 24.5cm","fullLabel":"US 6.5 // EUR 38.5 (24.5 cm)"},{"us":"US 7","eurCm":"EUR 39 • 25cm","fullLabel":"US 7 // EUR 39 (25 cm)"},{"us":"US 7.5","eurCm":"EUR 40 • 25.5cm","fullLabel":"US 7.5 // EUR 40 (25.5 cm)"},{"us":"US 8","eurCm":"EUR 40.5 • 26cm","fullLabel":"US 8 // EUR 40.5 (26 cm)"},{"us":"US 8.5","eurCm":"EUR 41 • 26.5cm","fullLabel":"US 8.5 // EUR 41 (26.5 cm)"},{"us":"US 9","eurCm":"EUR 42 • 27cm","fullLabel":"US 9 // EUR 42 (27 cm)"},{"us":"US 9.5","eurCm":"EUR 42.5 • 27.5cm","fullLabel":"US 9.5 // EUR 42.5 (27.5 cm)"},{"us":"US 10","eurCm":"EUR 43 • 28cm","fullLabel":"US 10 // EUR 43 (28 cm)"},{"us":"US 10.5","eurCm":"EUR 44 • 28.5cm","fullLabel":"US 10.5 // EUR 44 (28.5 cm)"},{"us":"US 11","eurCm":"EUR 44.5 • 29cm","fullLabel":"US 11 // EUR 44.5 (29 cm)"}]'::jsonb,
  8, '#SXN-AB-8859', 'JT882910485901', '#69-202410-05'
),
(
  'vans-realm-backpack',
  'Vans Realm Backpack',
  '["Vans Realm Backpack"]'::jsonb,
  'VANS REALM CLASSIC BACKPACK BLACK',
  'Black / White Off The Wall Patch (22L)',
  'STREET BACKPACK',
  'ACCESSORIES',
  'STREET GEAR // VANS CARRY',
  'backpack',
  350000, 'Rp 350.000', 'Rp 549.000', '-36%',
  '4.9', 65, 82,
  '100% ORIGINAL', 'red', 'GEAR', 'dark', 'All Size (22L) | Original',
  '/images/prod-realm-backpack-176857.png',
  '[{"label":"DEPAN","image":"/images/prod-realm-backpack-176857.png"},{"label":"DETAIL","image":"/images/backpack-detail.png"},{"label":"MATERIAL","image":"/images/backpack-material.jpg"},{"label":"TAG ASLI","image":"/images/backpack-compartment.jpg"}]'::jsonb,
  'Tas ransel harian 22 liter dengan kompartemen utama luas, slot laptop berlapis pelindung hingga 15 inci, kantong depan beritsleting dengan organizer, serta strap bahu empuk yang nyaman untuk mobilitas harian.',
  '[{"label":"MATERIAL","value":"100% Polyester 600D"},{"label":"KAPASITAS","value":"22 Liter (Laptop 15\")"},{"label":"DIMENSI","value":"42.5 x 32.5 x 12.5 cm"},{"label":"SKU / SERI","value":"VN0A3UI6BLK"}]'::jsonb,
  '[{"us":"ALL SIZE","eurCm":"22 Liter • 42.5 x 32.5cm","fullLabel":"ALL SIZE // 22 LITER (ORIGINAL)"}]'::jsonb,
  0, '#SXN-RB-8870', 'JT882910487015', '#69-202410-06'
)
ON CONFLICT (id) DO UPDATE SET
  price_number = EXCLUDED.price_number,
  price_formatted = EXCLUDED.price_formatted,
  sold_count = EXCLUDED.sold_count;
