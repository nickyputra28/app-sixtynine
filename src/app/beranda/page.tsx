"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { ALL_PRODUCTS, ProductData } from "@/data/products";
import {
  addToCartInDb,
  fetchCartCountFromDb,
  fetchProductsFromDb,
} from "@/lib/supabase";

export default function BerandaPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductData[]>(ALL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<
    "semua" | "sepatu" | "backpack"
  >("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(2);

  useEffect(() => {
    fetchProductsFromDb().then(setProducts);
    fetchCartCountFromDb().then(setCartCount);
  }, []);

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === "semua" || item.categoryType === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickAdd = async (product: ProductData) => {
    const defaultSize =
      product.sizes[product.defaultSizeIndex] || product.sizes[0];
    const newCount = await addToCartInDb({
      productId: product.id,
      sizeIndex: product.defaultSizeIndex,
      sizeLabel: defaultSize.fullLabel,
      quantity: 1,
    });
    setCartCount(newCount);
    router.push(`/produk/${product.id}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#131313] flex flex-col pb-[72px] md:pb-0">
      {/* Top Store Notice Bar */}
      <aside className="w-full bg-[#CC003C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white block animate-pulse" />
            <span className="font-space font-bold text-[10px] sm:text-[11px] tracking-wider uppercase">
              YOGYAKARTA ORIGINAL SKATE STORE • 100% AUTHENTIC BNIB
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span>Free Ongkir Jawa - Bali (Kode: VANS69)</span>
            <a
              href="https://instagram.com/sixtynine.sco"
              target="_blank"
              rel="noreferrer"
              className="underline hover:opacity-80"
            >
              @sixtynine.sco
            </a>
          </div>
        </div>
      </aside>

      {/* Header - HEADER TOP APP BAR */}
      <header className="w-full bg-[#131313]/95 backdrop-blur-md border-b border-[#444748]/40 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/beranda"
              className="flex items-center gap-2.5 shrink-0"
              title="SIXTYNINE Skate Store"
            >
              <img
                src="/images/sixtynine-logo-7ba055.png"
                alt="SIXTYNINE Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain block"
              />
              <span className="font-space font-bold text-xl sm:text-2xl tracking-tight uppercase text-white">
                SIXTYNINE
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-space font-bold tracking-wider text-[#C4C7C8]">
              <Link
                href="/beranda"
                className="text-white border-b-2 border-white pb-0.5"
              >
                BERANDA
              </Link>
              <Link
                href="/katalog"
                className="hover:text-white transition-colors"
              >
                KATALOG PRODUK
              </Link>
              <Link href="/lacak" className="hover:text-white transition-colors">
                LACAK RESI
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                AKUN MEMBER
              </Link>
            </nav>

            {/* Search Bar on Desktop & Cart Action */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex relative w-[220px] lg:w-[320px] h-9 items-center">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#8E9192]">
                  <img
                    src="/images/icon-search.svg"
                    alt=""
                    className="w-3.5 h-3.5 block"
                  />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Vans atau backpack..."
                  className="w-full h-9 bg-[#201F1F] border border-[#444748]/50 rounded-sm pl-9 pr-4 font-inter text-xs text-white placeholder:text-[#8E9192] focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>

              <Link
                href="/checkout"
                aria-label="Keranjang Belanja & Checkout"
                className="relative w-10 h-10 flex items-center justify-center rounded-sm hover:bg-white/5 transition-colors"
                title="Buka Keranjang / Checkout"
              >
                <img
                  src="/images/icon-cart-header.svg"
                  alt="Keranjang"
                  className="w-[18px] h-[22px] block"
                />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#CC003C] border border-[#131313] flex items-center justify-center font-space font-bold text-[10px] leading-none text-white">
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar (Only shown on small screens) */}
          <div className="sm:hidden relative w-full h-[36px] flex items-center">
            <span className="pointer-events-none absolute left-[12px] top-1/2 -translate-y-1/2 flex items-center justify-center">
              <img
                src="/images/icon-search.svg"
                alt=""
                className="w-[14px] h-[14px] block"
              />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sepatu Vans atau backpack..."
              className="w-full h-[36px] bg-[#201F1F] border border-[#444748]/50 rounded-[2px] pl-[36px] pr-[16px] font-inter text-[12px] text-white placeholder:text-[#8E9192] focus:outline-none focus:border-white/60 transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col p-4 sm:p-6 lg:p-8 gap-6 sm:gap-8">
        {/* Section - Promo Utama (Responsive Banner) */}
        <section>
          <div
            onClick={() => router.push("/katalog")}
            className="relative p-6 sm:p-8 bg-[#1C1B1B] border border-[#444748]/60 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden cursor-pointer hover:border-white/50 transition-all group"
          >
            {/* Top-right Badge */}
            <div className="absolute right-4 top-4 px-2.5 py-1 bg-[#201F1F] border border-[#444748]/60 rounded-sm flex items-center justify-center">
              <span className="font-space font-bold text-[10px] tracking-wider uppercase text-white">
                ORIGINAL 100% BNIB
              </span>
            </div>

            {/* Subtle Red Glow Accent */}
            <div className="pointer-events-none absolute right-[-20px] bottom-[-20px] w-64 h-64 rounded-full bg-[#CC003C]/20 blur-[60px] group-hover:bg-[#CC003C]/30 transition-all" />

            {/* Hero Copy */}
            <div className="flex flex-col gap-2 max-w-lg items-start relative z-10">
              <div className="px-2 py-0.5 bg-white inline-flex items-center justify-center">
                <span className="font-space font-bold text-[10px] uppercase text-[#0E0E0E]">
                  RESTOCK &amp; OFFICIAL DROPS
                </span>
              </div>
              <h2 className="font-space font-bold text-3xl sm:text-4xl md:text-5xl leading-tight uppercase text-white">
                NEW DROPS &amp; RESTOCK
              </h2>
              <p className="font-inter text-xs sm:text-sm text-[#C4C7C8] leading-relaxed">
                Authentic Vans &amp; Street Essentials. Pengiriman langsung dari
                Gudang Yogyakarta dengan garansi tukar size dan double box.
              </p>
            </div>

            {/* Promo Action Strip */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 relative z-10 border-t md:border-t-0 md:border-l border-[#444748]/40 pt-4 md:pt-0 md:pl-6">
              <div className="flex items-center gap-2 text-white">
                <img
                  src="/images/icon-truck-promo.svg"
                  alt=""
                  className="w-4 h-4 block"
                />
                <span className="font-space font-bold text-xs">
                  FREE ONGKIR JAWA-BALI
                </span>
              </div>
              <span className="px-3 py-1 bg-[#CC003C] text-white font-space font-bold text-xs tracking-wider rounded-sm uppercase">
                KODE VOUCHER: VANS69
              </span>
              <span className="font-space font-bold text-xs uppercase text-white underline group-hover:translate-x-1 transition-transform">
                JELAJAHI KATALOG →
              </span>
            </div>
          </div>
        </section>

        {/* Section - Kategori Produk Tabs & Filters */}
        <section id="katalog-section" className="flex flex-col gap-4">
          <div className="pb-3 border-b border-[#444748]/30 flex flex-wrap items-center justify-between gap-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("semua")}
                className={`h-8 px-4 rounded-sm inline-flex items-center justify-center font-space font-bold text-xs tracking-wider uppercase whitespace-nowrap transition-colors ${
                  selectedCategory === "semua"
                    ? "bg-white text-[#0E0E0E] border border-white"
                    : "bg-[#201F1F] border border-[#444748]/40 text-[#C4C7C8] hover:text-white"
                }`}
              >
                SEMUA ({products.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("sepatu")}
                className={`h-8 px-4 rounded-sm inline-flex items-center justify-center font-space font-bold text-xs tracking-wider uppercase whitespace-nowrap transition-colors ${
                  selectedCategory === "sepatu"
                    ? "bg-white text-[#0E0E0E] border border-white"
                    : "bg-[#201F1F] border border-[#444748]/40 text-[#C4C7C8] hover:text-white"
                }`}
              >
                SEPATU VANS (5)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("backpack")}
                className={`h-8 px-4 rounded-sm inline-flex items-center justify-center font-space font-bold text-xs tracking-wider uppercase whitespace-nowrap transition-colors ${
                  selectedCategory === "backpack"
                    ? "bg-white text-[#0E0E0E] border border-white"
                    : "bg-[#201F1F] border border-[#444748]/40 text-[#C4C7C8] hover:text-white"
                }`}
              >
                BACKPACK (1)
              </button>
            </div>

            <span className="font-space font-bold text-xs uppercase text-[#8E9192]">
              {filteredProducts.length} PRODUK SIAP KIRIM
            </span>
          </div>
        </section>

        {/* Product Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="bg-[#1C1B1B] border border-[#444748]/50 rounded-sm flex flex-col justify-between overflow-hidden hover:border-white/50 hover:shadow-xl transition-all group"
            >
              <Link href={`/produk/${product.id}`} className="flex flex-col">
                {/* Hero Image */}
                <div className="relative w-full h-[180px] sm:h-[210px] p-2 bg-[#201F1F] flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.fullName}
                    className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    className={`absolute left-2 top-2 px-2 py-0.5 rounded-sm inline-flex items-center justify-center shadow-md ${
                      product.berandaBadgeVariant === "white"
                        ? "bg-white text-[#0E0E0E]"
                        : "bg-[#CC003C] text-white"
                    }`}
                  >
                    <span className="font-space font-bold text-[9px] tracking-wider uppercase">
                      {product.berandaBadge}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 flex flex-col gap-1">
                  <span className="font-space font-bold text-[10px] tracking-wider uppercase text-[#8E9192] truncate">
                    {product.categoryTag}
                  </span>
                  <h4 className="font-space font-bold text-sm sm:text-base text-white truncate group-hover:text-white transition-colors">
                    {product.berandaName}
                  </h4>

                  {/* Rating & Sold */}
                  <div className="flex items-center gap-1.5 text-xs pt-0.5">
                    <img
                      src="/images/icon-star.svg"
                      alt=""
                      className="w-3 h-3 block shrink-0"
                    />
                    <span className="font-space font-bold text-white text-[11px]">
                      {product.rating}
                    </span>
                    <span className="font-inter text-[#8E9192] text-[11px]">
                      ({product.soldCount} terjual)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="font-space font-bold text-base sm:text-lg text-white">
                      {product.priceFormatted}
                    </span>
                    <span className="font-inter text-xs line-through text-[#8E9192]">
                      {product.originalPriceFormatted}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Add to Bag CTA */}
              <div className="p-3 pt-0">
                <button
                  type="button"
                  onClick={() => handleQuickAdd(product)}
                  className="w-full h-8 bg-white text-[#0E0E0E] font-space font-bold text-[11px] tracking-wider uppercase rounded-sm flex items-center justify-center gap-2 hover:bg-[#F0F0F0] active:scale-[0.99] transition-all"
                >
                  <img
                    src="/images/icon-add-bag.svg"
                    alt=""
                    className="w-3.5 h-3.5 block"
                  />
                  <span>+ KERANJANG</span>
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Section - STORE GUARANTEE & COMMUNITY INFO (Responsive 3 Cards on Desktop) */}
        <section className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#1C1B1B] border border-[#444748]/40 rounded-sm flex items-start gap-3">
              <img
                src="/images/icon-verified-badge.svg"
                alt=""
                className="w-6 h-6 shrink-0 block mt-0.5"
              />
              <div className="flex flex-col gap-1">
                <h4 className="font-space font-bold text-xs uppercase text-white">
                  100% PRODUK ORIGINAL BNIB
                </h4>
                <p className="font-inter text-xs text-[#8E9192] leading-relaxed">
                  Garansi uang kembali 2x lipat jika barang terbukti fake / kw.
                </p>
              </div>
            </div>

            <div className="p-5 bg-[#1C1B1B] border border-[#444748]/40 rounded-sm flex items-start gap-3">
              <img
                src="/images/icon-shield.svg"
                alt=""
                className="w-5 h-5 shrink-0 block mt-0.5"
              />
              <div className="flex flex-col gap-1">
                <h4 className="font-space font-bold text-xs uppercase text-white">
                  GARANSI TUKAR UKURAN
                </h4>
                <p className="font-inter text-xs text-[#8E9192] leading-relaxed">
                  Bisa tukar size dalam 3 hari setelah barang sampai jika kekecilan / kebesaran.
                </p>
              </div>
            </div>

            <div className="p-5 bg-[#1C1B1B] border border-[#444748]/40 rounded-sm flex items-start gap-3">
              <img
                src="/images/icon-store.svg"
                alt=""
                className="w-5 h-5 shrink-0 block mt-0.5"
              />
              <div className="flex flex-col gap-1">
                <h4 className="font-space font-bold text-xs uppercase text-white">
                  STORE YOGYAKARTA
                </h4>
                <p className="font-inter text-xs text-[#8E9192] leading-relaxed">
                  Instagram: <a href="https://instagram.com/sixtynine.sco" target="_blank" rel="noreferrer" className="text-white underline">@sixtynine.sco</a> • Fast Shipping
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING WHATSAPP ADMIN BUTTON */}
      <div className="fixed bottom-[64px] md:bottom-8 right-4 sm:right-8 z-40">
        <a
          href="https://wa.me/6285725548466"
          target="_blank"
          rel="noreferrer"
          className="h-10 px-4 bg-[#25D366] text-black font-space font-bold text-xs uppercase rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <img
            src="/images/icon-wa-float.svg"
            alt="WhatsApp"
            className="w-4 h-4 block shrink-0"
          />
          <span className="hidden sm:inline">CHAT WA: 085725548466</span>
          <span className="sm:hidden">CHAT WA</span>
        </a>
      </div>

      {/* Shared Desktop Footer */}
      <Footer />

      {/* Shared Bottom Navigation (Mobile Only) */}
      <BottomNav />
    </div>
  );
}
