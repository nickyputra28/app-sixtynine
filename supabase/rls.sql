-- ============================================================================
-- SIXTYNINE — ROW LEVEL SECURITY (jalankan SETELAH schema.sql)
-- Supabase Dashboard -> SQL Editor -> New query -> Run
--
-- PRASYARAT: aktifkan login anonim agar pengunjung tanpa akun tetap punya
-- identitas: Authentication -> Sign In / Providers -> "Allow anonymous sign-ins" = ON
-- ============================================================================

-- Hapus policy lama yang terlalu longgar (USING true)
DROP POLICY IF EXISTS "Anyone can manage cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Anyone can create and view orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view order tracking logs" ON public.order_tracking_logs;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Public profiles readable by owner" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking_logs ENABLE ROW LEVEL SECURITY;

-- 1. PRODUCTS: dibaca semua pengunjung, tidak bisa diubah dari aplikasi
CREATE POLICY "products_select_public" ON public.products
  FOR SELECT TO anon, authenticated USING (true);

-- 2. PROFILES: hanya pemilik
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 3. CART_ITEMS: hanya pemilik (lihat, tambah, ubah, hapus)
CREATE POLICY "cart_select_own" ON public.cart_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "cart_insert_own" ON public.cart_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_update_own" ON public.cart_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_delete_own" ON public.cart_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. ORDERS: pemilik boleh melihat & membuat; tidak bisa ubah/hapus
--    (status pembayaran/logistik hanya diubah admin lewat service role)
CREATE POLICY "orders_select_own" ON public.orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 5. ORDER_TRACKING_LOGS: hanya baca, hanya untuk pesanan miliknya
--    (baris dibuat oleh trigger SECURITY DEFINER)
CREATE POLICY "tracking_select_own" ON public.order_tracking_logs
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_tracking_logs.order_id AND o.user_id = auth.uid()
    )
  );
