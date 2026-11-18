import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ALL_PRODUCTS, ProductData } from "@/data/products";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  "";

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes("YOUR_PROJECT_ID") &&
  !supabaseAnonKey.includes("YOUR_SUPABASE_ANON");

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// Helper: Session ID unik untuk Guest / Browser
// ============================================================================
const SESSION_KEY = "sixtynine_session_id";
const LOCAL_CART_KEY = "sixtynine_cart_items";
const LOCAL_ORDERS_KEY = "sixtynine_orders";
const LOCAL_USER_KEY = "sixtynine_member_user";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = "sxn_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// ============================================================================
// 1. AUTHENTICATION & MEMBER PROFILE (Login / Register / Google / WA OTP)
// ============================================================================
export interface MemberSessionUser {
  id: string;
  email: string;
  phone_whatsapp?: string;
  full_name: string;
}

export function getSavedMemberUser(): MemberSessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function authenticateMember(params: {
  mode: "login" | "register";
  identifier: string;
  password: string;
}): Promise<{ user: MemberSessionUser; source: "supabase" | "local"; error?: string }> {
  const cleanId = params.identifier.trim();
  const isEmail = cleanId.includes("@");
  const emailToUse = isEmail
    ? cleanId
    : `${cleanId.replace(/[^0-9a-zA-Z]/g, "")}@member.sixtynine.id`;

  if (supabase) {
    try {
      if (params.mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: emailToUse,
          password: params.password,
          options: {
            data: {
              phone_whatsapp: isEmail ? "" : cleanId,
              full_name: isEmail ? cleanId.split("@")[0] : `Skater ${cleanId}`,
            },
          },
        });
        if (error) throw error;
        if (data.user) {
          const member: MemberSessionUser = {
            id: data.user.id,
            email: data.user.email || emailToUse,
            phone_whatsapp: isEmail ? undefined : cleanId,
            full_name:
              data.user.user_metadata?.full_name ||
              (isEmail ? cleanId.split("@")[0] : cleanId),
          };
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(member));
          }
          return { user: member, source: "supabase" };
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToUse,
          password: params.password,
        });
        if (error) throw error;
        if (data.user) {
          const member: MemberSessionUser = {
            id: data.user.id,
            email: data.user.email || emailToUse,
            phone_whatsapp: data.user.user_metadata?.phone_whatsapp,
            full_name:
              data.user.user_metadata?.full_name ||
              (isEmail ? cleanId.split("@")[0] : cleanId),
          };
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(member));
          }
          return { user: member, source: "supabase" };
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal autentikasi ke Supabase";
      return {
        user: {
          id: "local_" + Date.now(),
          email: emailToUse,
          phone_whatsapp: isEmail ? undefined : cleanId,
          full_name: isEmail ? cleanId.split("@")[0] : cleanId,
        },
        source: "local",
        error: message,
      };
    }
  }

  // Fallback penyimpanan lokal jika .env.local belum dikonfigurasi
  const fallbackUser: MemberSessionUser = {
    id: "local_" + Date.now(),
    email: emailToUse,
    phone_whatsapp: isEmail ? undefined : cleanId,
    full_name: isEmail ? cleanId.split("@")[0] : `Skater ${cleanId}`,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(fallbackUser));
  }
  return { user: fallbackUser, source: "local" };
}

export async function signOutMember(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
}

// ============================================================================
// 2. PRODUCTS (Baca Katalog & Detail Produk dari Tabel `public.products`)
// ============================================================================
interface DbProductRow {
  id: string;
  beranda_name: string;
  katalog_lines: [string, string?];
  full_name: string;
  subtitle: string;
  category_tag: string;
  katalog_brand_tag: string;
  archive_tag: string;
  category_type: "sepatu" | "backpack";
  price_number: number;
  price_formatted: string;
  original_price_formatted: string;
  discount_badge: string;
  rating: string;
  sold_count: number;
  reviews_count: number;
  beranda_badge: string;
  beranda_badge_variant: "red" | "white";
  katalog_badge: string;
  katalog_badge_style: "red" | "white" | "dark";
  katalog_meta: string;
  image: string;
  thumbnails: { label: string; image: string }[];
  description: string;
  specs: { label: string; value: string }[];
  sizes: { us: string; eurCm: string; fullLabel: string }[];
  default_size_index: number;
  order_number_template: string;
  resi_number_template: string;
  invoice_number_template: string;
}

function mapDbRowToProduct(row: DbProductRow): ProductData {
  const localDefault = ALL_PRODUCTS.find((p) => p.id === row.id);
  const thumbnails =
    localDefault?.thumbnails && localDefault.thumbnails.length > 0
      ? localDefault.thumbnails
      : row.thumbnails;

  return {
    id: row.id,
    berandaName: row.beranda_name,
    katalogLines: row.katalog_lines,
    fullName: row.full_name,
    subtitle: row.subtitle,
    categoryTag: row.category_tag,
    katalogBrandTag: row.katalog_brand_tag,
    archiveTag: row.archive_tag,
    categoryType: row.category_type,
    priceNumber: row.price_number,
    priceFormatted: row.price_formatted,
    originalPriceFormatted: row.original_price_formatted,
    discountBadge: row.discount_badge,
    rating: row.rating,
    soldCount: row.sold_count,
    reviewsCount: row.reviews_count,
    berandaBadge: row.beranda_badge,
    berandaBadgeVariant: row.beranda_badge_variant,
    katalogBadge: row.katalog_badge,
    katalogBadgeStyle: row.katalog_badge_style,
    katalogMeta: row.katalog_meta,
    image: row.image,
    thumbnails: thumbnails || row.thumbnails,
    description: row.description,
    specs: row.specs,
    sizes: row.sizes,
    defaultSizeIndex: row.default_size_index,
    orderNumber: row.order_number_template,
    resiNumber: row.resi_number_template,
    invoiceNumber: row.invoice_number_template,
  };
}

export async function fetchProductsFromDb(): Promise<ProductData[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data && data.length > 0) {
        return (data as DbProductRow[]).map(mapDbRowToProduct);
      }
    } catch {
      // Gunakan fallback statis jika tabel belum dibuat
    }
  }
  return ALL_PRODUCTS;
}

export async function fetchProductByIdFromDb(id: string): Promise<ProductData> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        return mapDbRowToProduct(data as DbProductRow);
      }
    } catch {
      // Gunakan fallback statis
    }
  }
  return ALL_PRODUCTS.find((p) => p.id === id) || ALL_PRODUCTS[1];
}

// ============================================================================
// 3. CART_ITEMS (Tambah & Baca Keranjang dari Tabel `public.cart_items`)
// ============================================================================
export interface CartItemRecord {
  id: string;
  product_id: string;
  selected_size_index: number;
  selected_size_label: string;
  quantity: number;
}

export async function fetchCartCountFromDb(): Promise<number> {
  const sessionId = getOrCreateSessionId();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("session_id", sessionId);
      if (!error && data) {
        const total = data.reduce((acc, item) => acc + (item.quantity || 1), 0);
        return total > 0 ? total : 2;
      }
    } catch {
      // Fallback ke localStorage
    }
  }

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_CART_KEY);
      if (raw) {
        const items: CartItemRecord[] = JSON.parse(raw);
        const total = items.reduce((acc, i) => acc + i.quantity, 0);
        return total > 0 ? total : 2;
      }
    } catch {
      // ignore
    }
  }
  return 2;
}

export async function addToCartInDb(params: {
  productId: string;
  sizeIndex: number;
  sizeLabel: string;
  quantity?: number;
}): Promise<number> {
  const sessionId = getOrCreateSessionId();
  const member = getSavedMemberUser();
  const qty = params.quantity || 1;

  if (supabase) {
    try {
      await supabase.from("cart_items").insert({
        user_id: member && !member.id.startsWith("local_") ? member.id : null,
        session_id: sessionId,
        product_id: params.productId,
        selected_size_index: params.sizeIndex,
        selected_size_label: params.sizeLabel,
        quantity: qty,
      });
    } catch {
      // Tetap simpan ke localStorage sebagai cadangan
    }
  }

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_CART_KEY);
      const items: CartItemRecord[] = raw ? JSON.parse(raw) : [];
      items.push({
        id: "cart_" + Date.now(),
        product_id: params.productId,
        selected_size_index: params.sizeIndex,
        selected_size_label: params.sizeLabel,
        quantity: qty,
      });
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
      return items.reduce((acc, i) => acc + i.quantity, 2);
    } catch {
      // ignore
    }
  }
  return 3;
}

// ============================================================================
// 4. ORDERS & TRACKING LOGS (Simpan Checkout & Baca Status Pesanan dari DB)
// ============================================================================
export interface OrderRecord {
  id: string;
  order_number: string;
  invoice_number: string;
  resi_number: string;
  product_id: string;
  selected_size_index: number;
  selected_size_label: string;
  quantity: number;
  recipient_name: string;
  recipient_phone: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  full_address: string;
  courier_code: "ez" | "super";
  courier_service_name: string;
  estimated_delivery: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  grand_total: number;
  paid_at: string;
}

export async function createOrderInDb(params: {
  product: ProductData;
  sizeIndex: number;
  sizeLabel: string;
  recipientName: string;
  recipientPhone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  fullAddress: string;
  courierCode: "ez" | "super";
  shippingCost: number;
  discountAmount: number;
  grandTotal: number;
}): Promise<OrderRecord> {
  const sessionId = getOrCreateSessionId();
  const member = getSavedMemberUser();
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  const orderNumber = `${params.product.orderNumber.slice(0, 8)}-${suffix}`;

  const newOrder: OrderRecord = {
    id: "ord_" + Date.now(),
    order_number: orderNumber,
    invoice_number: params.product.invoiceNumber,
    resi_number: params.product.resiNumber,
    product_id: params.product.id,
    selected_size_index: params.sizeIndex,
    selected_size_label: params.sizeLabel,
    quantity: 1,
    recipient_name: params.recipientName,
    recipient_phone: params.recipientPhone,
    province: params.province,
    city: params.city,
    district: params.district,
    postal_code: params.postalCode,
    full_address: params.fullAddress,
    courier_code: params.courierCode,
    courier_service_name:
      params.courierCode === "super" ? "J&T EXPRESS SUPER" : "J&T EXPRESS EZ",
    estimated_delivery:
      params.courierCode === "super" ? "1 Hari Kerja" : "2 - 3 Hari Kerja",
    subtotal: params.product.priceNumber,
    shipping_cost: params.shippingCost,
    discount_amount: params.discountAmount,
    grand_total: params.grandTotal,
    paid_at: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          order_number: newOrder.order_number,
          invoice_number: newOrder.invoice_number,
          resi_number: newOrder.resi_number,
          user_id:
            member && !member.id.startsWith("local_") ? member.id : null,
          session_id: sessionId,
          product_id: newOrder.product_id,
          selected_size_index: newOrder.selected_size_index,
          selected_size_label: newOrder.selected_size_label,
          quantity: 1,
          recipient_name: newOrder.recipient_name,
          recipient_phone: newOrder.recipient_phone,
          province: newOrder.province,
          city: newOrder.city,
          district: newOrder.district,
          postal_code: newOrder.postal_code,
          full_address: newOrder.full_address,
          courier_code: newOrder.courier_code,
          courier_service_name: newOrder.courier_service_name,
          estimated_delivery: newOrder.estimated_delivery,
          subtotal: newOrder.subtotal,
          shipping_cost: newOrder.shipping_cost,
          discount_amount: newOrder.discount_amount,
          grand_total: newOrder.grand_total,
        })
        .select("*")
        .single();

      if (!error && data) {
        newOrder.id = data.id;
      }
    } catch {
      // Tetap lanjut simpan ke localStorage
    }
  }

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
      const orders: OrderRecord[] = raw ? JSON.parse(raw) : [];
      orders.unshift(newOrder);
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }

  return newOrder;
}

export async function fetchOrderByIdOrLatestFromDb(
  orderId?: string | null,
  productId?: string | null
): Promise<OrderRecord | null> {
  const sessionId = getOrCreateSessionId();

  if (supabase) {
    try {
      let query = supabase.from("orders").select("*");
      if (orderId && !orderId.startsWith("ord_")) {
        query = query.eq("id", orderId);
      } else if (productId) {
        query = query.eq("session_id", sessionId).eq("product_id", productId);
      } else {
        query = query.eq("session_id", sessionId);
      }
      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const row = data[0];
        return {
          id: row.id,
          order_number: row.order_number,
          invoice_number: row.invoice_number,
          resi_number: row.resi_number,
          product_id: row.product_id,
          selected_size_index: row.selected_size_index,
          selected_size_label: row.selected_size_label,
          quantity: row.quantity,
          recipient_name: row.recipient_name,
          recipient_phone: row.recipient_phone,
          province: row.province,
          city: row.city,
          district: row.district,
          postal_code: row.postal_code,
          full_address: row.full_address,
          courier_code: row.courier_code,
          courier_service_name: row.courier_service_name,
          estimated_delivery: row.estimated_delivery,
          subtotal: row.subtotal,
          shipping_cost: row.shipping_cost,
          discount_amount: row.discount_amount,
          grand_total: row.grand_total,
          paid_at: new Date(row.paid_at || row.created_at).toLocaleTimeString(
            "id-ID",
            { hour: "2-digit", minute: "2-digit" }
          ),
        };
      }
    } catch {
      // Fallback ke localStorage
    }
  }

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
      if (raw) {
        const orders: OrderRecord[] = JSON.parse(raw);
        if (orderId) {
          const found = orders.find((o) => o.id === orderId);
          if (found) return found;
        }
        if (productId) {
          const found = orders.find((o) => o.product_id === productId);
          if (found) return found;
        }
        return orders[0] || null;
      }
    } catch {
      // ignore
    }
  }
  return null;
}
