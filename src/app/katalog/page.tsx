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

export default function KatalogPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductData[]>(ALL_PRODUCTS);
  const [activeChip, setActiveChip] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(2);

  useEffect(() => {
    fetchProductsFromDb().then(setProducts);
    fetchCartCountFromDb().then(setCartCount);
  }, []);

  const orderedIds = [
    "vans-sk8-low-classic",
    "vans-sk8-low-contrast",
    "vans-old-skool-classic",
    "vans-authentic-black",
    "vans-authentic-red",
    "vans-realm-backpack",
  ];
  const orderedProducts = orderedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is ProductData => Boolean(p));

  const filtered = orderedProducts.filter((item) => {
    const matchCategory =
      activeChip === "semua" ||
      activeChip === "best" ||
      activeChip === "ready" ||
      (activeChip === "sepatu" && item.categoryType === "sepatu") ||
      (activeChip === "gear" && item.categoryType === "backpack");
    const matchSearch =
      searchQuery.trim() === "" ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleQuickAdd = async (item: ProductData) => {
    const defaultSize = item.sizes[item.defaultSizeIndex] || item.sizes[0];
    const newCount = await addToCartInDb({
      productId: item.id,
      sizeIndex: item.defaultSizeIndex,
      sizeLabel: defaultSize.fullLabel,
      quantity: 1,
    });
    setCartCount(newCount);
    router.push(`/produk/${item.id}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0E0E0E] flex flex-col pb-[96px] md:pb-0">
      {/* Top Header */}
      <header className="w-full h-16 bg-[#131313]/95 backdrop-blur-md border-b border-[#444748] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link href="/beranda" className="flex items-center gap-2.5">
              <img
                src="/images/sixtynine-logo-7ba055.png"
                alt="SIXTYNINE Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain block"
              />
              <span className="font-space font-bold text-2xl tracking-tight uppercase text-white">
                SIXTYNINE
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-[#201F1F] text-[#8E9192] text-[10px] font-space font-bold tracking-wider rounded uppercase">
              KATALOG
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-space font-bold tracking-wider text-[#C4C7C8]">
            <Link href="/beranda" className="hover:text-white transition-colors">
              BERANDA
            </Link>
            <Link
              href="/katalog"
              className="text-white border-b-2 border-white pb-0.5"
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

          {/* Cart */}
          <Link
            href="/checkout"
            aria-label="Keranjang Belanja"
            className="relative w-10 h-10 flex items-center justify-center rounded-sm hover:bg-white/5 transition-colors"
          >
            <img
              src="/images/icon-cart-header.svg"
              alt="Keranjang"
              className="w-4 h-5 block"
            />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#CC003C] border border-[#131313] flex items-center justify-center font-space font-bold text-[10px] leading-none text-white">
              {cartCount}
            </span>
          </Link>
        </div>
      </header>

      {/* Urgency Ticker / Drop Marquee */}
      <div className="w-full bg-[#1C1B1B] border-b border-[#444748]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs w-full">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CC003C] block animate-pulse" />
            <span className="font-space font-bold text-[10px] sm:text-[11px] tracking-wider uppercase text-white">
              FLASH DROP YOGYAKARTA • 100% ORIGINAL BNIB
            </span>
          </div>
          <span className="font-space font-bold text-[10px] sm:text-[11px] tracking-wider uppercase text-[#8E9192]">
            GARANSI UANG KEMBALI 2X LIPAT
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6">
        {/* Search & Quick Filter Section */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 h-11 flex items-center">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-[#8E9192]">
                <img
                  src="/images/icon-search.svg"
                  alt=""
                  className="w-4 h-4 block"
                />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Vans Sk8-Low, Old Skool, Authentic, atau Backpack..."
                className="w-full h-11 bg-[#1C1B1B] border border-[#444748] rounded-sm pl-11 pr-4 font-inter text-xs text-white placeholder:text-[#8E9192] focus:outline-none focus:border-white/70 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between gap-3 text-xs font-space font-bold text-[#8E9192]">
              <span>MENAMPILKAN {filtered.length} DARI {products.length} ITEM</span>
            </div>
          </div>

          {/* Filter Chips Horizontal Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "semua", label: "SEMUA PRODUK" },
              { id: "sepatu", label: "SNEAKERS VANS" },
              { id: "gear", label: "BACKPACK & GEAR" },
              { id: "best", label: "BEST SELLER" },
              { id: "ready", label: "READY STOCK JOGJA" },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveChip(chip.id)}
                className={`h-8 px-4 rounded-sm inline-flex items-center justify-center font-space font-bold text-[11px] tracking-wider uppercase whitespace-nowrap transition-colors ${
                  activeChip === chip.id
                    ? "bg-white text-[#0E0E0E] border border-white"
                    : "bg-[#1C1B1B] border border-[#444748]/60 text-[#C4C7C8] hover:text-white"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="bg-[#1C1B1B] border border-[#444748]/60 rounded-sm flex flex-col justify-between overflow-hidden hover:border-white/50 hover:shadow-xl transition-all group"
            >
              {/* Image Block */}
              <div className="relative w-full h-[190px] sm:h-[220px] bg-[#201F1F] overflow-hidden">
                <Link
                  href={`/produk/${item.id}`}
                  className="block w-full h-full"
                >
                  <img
                    src={item.image}
                    alt={item.fullName}
                    className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Top-Left Badge */}
                <div
                  className={`pointer-events-none absolute left-2 top-2 px-2 py-0.5 rounded-sm inline-flex items-center justify-center shadow-md ${
                    item.katalogBadgeStyle === "red"
                      ? "bg-[#CC003C] text-white"
                      : item.katalogBadgeStyle === "white"
                      ? "bg-white text-[#0E0E0E]"
                      : "bg-[#131313]/90 border border-[#444748] text-[#E5E2E1]"
                  }`}
                >
                  <span className="font-space font-bold text-[9px] tracking-wider uppercase">
                    {item.katalogBadge}
                  </span>
                </div>

                {/* Bottom-Right Add (+) Button */}
                <button
                  type="button"
                  onClick={() => handleQuickAdd(item)}
                  aria-label={`Buka Detail ${item.fullName}`}
                  className="absolute right-2 bottom-2 w-8 h-8 bg-white text-[#0E0E0E] rounded-sm shadow-md flex items-center justify-center hover:bg-white/90 active:scale-95 transition-all"
                  title="Lihat Detail & Beli"
                >
                  <span className="font-space font-bold text-lg leading-none">
                    +
                  </span>
                </button>
              </div>

              {/* Card Body */}
              <Link
                href={`/produk/${item.id}`}
                className="p-3.5 flex-1 flex flex-col justify-between gap-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-space font-bold text-[10px] tracking-wider uppercase text-[#8E9192]">
                    {item.katalogBrandTag}
                  </span>
                  <h3 className="font-space font-bold text-sm sm:text-base leading-snug text-white line-clamp-2">
                    {item.fullName}
                  </h3>
                </div>

                <div className="pt-2 border-t border-[#444748]/40 flex items-baseline justify-between gap-2">
                  <span className="font-space font-bold text-base sm:text-lg text-white">
                    {item.priceFormatted}
                  </span>
                  <span className="font-inter text-[11px] text-[#C4C7C8]">
                    {item.katalogMeta.split("|")[0]}
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </section>

        {/* Trust Banner */}
        <section className="pt-4">
          <div className="p-6 bg-[#161616] border border-[#444748] rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/icon-verified-badge.svg"
                alt=""
                className="w-8 h-8 block shrink-0"
              />
              <div className="flex flex-col">
                <h4 className="font-space font-bold text-sm sm:text-base uppercase text-white">
                  SIXTYNINE STORE GUARANTEE
                </h4>
                <p className="font-inter text-xs text-[#8E9192]">
                  Semua produk 100% Original BNIB dengan double box shipping &amp; garansi tukar size.
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/6285725548466"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-[#25D366] text-black font-space font-bold text-xs uppercase rounded-sm hover:brightness-105 transition-all shrink-0"
            >
              KONSULTASI SIZE VIA WA
            </a>
          </div>
        </section>
      </main>

      {/* Shared Desktop Footer */}
      <Footer />

      {/* Shared Bottom Navigation (Mobile Only) */}
      <BottomNav />
    </div>
  );
}
