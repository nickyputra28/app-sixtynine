"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { getProductById, ProductData } from "@/data/products";
import {
  addToCartInDb,
  fetchCartCountFromDb,
  fetchProductByIdFromDb,
} from "@/lib/supabase";

export default function ProductDetailClient({
  productId: initialProductId,
}: {
  productId?: string;
}) {
  const params = useParams();
  const router = useRouter();
  const productId =
    initialProductId ||
    (typeof params?.id === "string" ? params.id : "vans-sk8-low-classic");

  const [product, setProduct] = useState<ProductData>(() =>
    getProductById(productId)
  );
  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(
    product.defaultSizeIndex
  );
  const [cartCount, setCartCount] = useState(2);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    fetchProductByIdFromDb(productId).then((dbProd) => {
      setProduct(dbProd);
      setSelectedSizeIdx(dbProd.defaultSizeIndex);
    });
    fetchCartCountFromDb().then(setCartCount);
  }, [productId]);

  const selectedSize = product.sizes[selectedSizeIdx] || product.sizes[0];

  const getCleanImgSrc = (src?: string) => {
    if (!src) return "";
    return src.includes("?") ? src : `${src}?v=9`;
  };

  const handleAddToCart = async () => {
    const newCount = await addToCartInDb({
      productId: product.id,
      sizeIndex: selectedSizeIdx,
      sizeLabel: selectedSize.fullLabel,
      quantity: 1,
    });
    setCartCount(newCount);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const handleBuyNow = async () => {
    await addToCartInDb({
      productId: product.id,
      sizeIndex: selectedSizeIdx,
      sizeLabel: selectedSize.fullLabel,
      quantity: 1,
    });
    router.push(`/checkout?product=${product.id}&size=${selectedSizeIdx}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#131313] flex flex-col pb-[104px] lg:pb-0">
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
            <span>Garansi Tukar Size 3 Hari</span>
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

      {/* Header - TOP BAR (Responsive Task & Brand Navigation) */}
      <header className="w-full h-[64px] bg-[#131313]/95 backdrop-blur-md border-b border-[#444748]/40 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Kembali"
              className="w-10 h-10 flex items-center justify-center rounded-[4px] hover:bg-white/5 active:scale-95 transition-all text-white"
            >
              <img
                src="/images/icon-back.svg"
                alt="Kembali"
                className="w-[14px] h-[14px] block"
              />
            </button>

            <Link href="/beranda" className="flex items-center gap-2.5">
              <img
                src="/images/sixtynine-logo-7ba055.png"
                alt="SIXTYNINE Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-space font-bold text-xl sm:text-2xl tracking-tight uppercase text-white">
                SIXTYNINE
              </span>
            </Link>

            {/* Desktop Breadcrumbs */}
            <nav className="hidden md:flex items-center gap-2 ml-4 text-xs font-space text-[#8E9192]">
              <span>/</span>
              <Link href="/katalog" className="hover:text-white transition-colors">
                KATALOG
              </Link>
              <span>/</span>
              <span className="text-white uppercase truncate max-w-[260px]">
                {product.fullName}
              </span>
            </nav>
          </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-space font-bold tracking-wider text-[#C4C7C8]">
          <Link href="/beranda" className="hover:text-white transition-colors">
            BERANDA
          </Link>
          <Link href="/katalog" className="hover:text-white transition-colors">
            KATALOG PRODUK
          </Link>
          <Link href="/lacak" className="hover:text-white transition-colors">
            LACAK PESANAN
          </Link>
          <Link href="/login" className="hover:text-white transition-colors">
            AKUN MEMBER
          </Link>
        </div>

        {/* Action icons (Share & Cart) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Bagikan"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.fullName,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link produk berhasil disalin!");
              }
            }}
            className="w-10 h-10 flex items-center justify-center rounded-[4px] hover:bg-white/5 transition-colors"
            title="Bagikan Link Produk"
          >
            <img
              src="/images/icon-pdp-share.svg"
              alt="Bagikan"
              className="w-4 h-4 block"
            />
          </button>

          <Link
            href={`/checkout?product=${product.id}&size=${selectedSizeIdx}`}
            aria-label="Keranjang Belanja"
            className="relative w-10 h-10 flex items-center justify-center rounded-[4px] hover:bg-white/5 transition-colors"
            title="Buka Keranjang Belanja"
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
    </header>

      {/* Main Content: Responsive 2-Column Grid on Desktop */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex-1">
        {/* Left Column (Hero Gallery & Info Details) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Display Frame */}
          <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[500px] bg-[#1E1E1E] border border-[#444748]/40 rounded-sm overflow-hidden flex items-center justify-center group">
            <img
              src={getCleanImgSrc(
                product.thumbnails[activeThumb]?.image || product.image
              )}
              alt={product.fullName}
              className="w-full h-full object-cover block shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-[1.02]"
            />

            {/* Floating Authentic Pill */}
            <div className="absolute left-3 top-3 flex items-center gap-2 z-10">
              <div className="px-2.5 py-1 bg-[#0E0E0E]/90 backdrop-blur-sm border border-[#444748]/60 rounded-sm inline-flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#34D399] block animate-ping" />
                <span className="font-space font-bold text-[10px] leading-[12px] tracking-wider uppercase text-white">
                  100% ORIGINAL BNIB
                </span>
              </div>
              <div className="px-2.5 py-1 bg-[#CC003C] rounded-sm inline-flex items-center justify-center shadow-md">
                <span className="font-space font-bold text-[10px] leading-[12px] tracking-wider uppercase text-white">
                  OFFICIAL
                </span>
              </div>
            </div>

            {/* Pagination Bar Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
              {product.thumbnails.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    activeThumb === idx
                      ? "w-6 bg-white"
                      : "w-2 bg-[#8E9192]/80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails Selector */}
          <div className="grid grid-cols-4 gap-3">
            {product.thumbnails.map((thumb, idx) => {
              const isSelected = activeThumb === idx;
              return (
                <button
                  key={thumb.label}
                  type="button"
                  onClick={() => setActiveThumb(idx)}
                  className={`relative h-[88px] sm:h-[104px] p-1 bg-[#201F1F] rounded-sm overflow-hidden transition-all text-left ${
                    isSelected
                      ? "ring-2 ring-white scale-[1.02] shadow-lg"
                      : "border border-[#444748]/40 opacity-75 hover:opacity-100 hover:border-white/40"
                  }`}
                >
                  <img
                    src={getCleanImgSrc(thumb.image)}
                    alt={thumb.label}
                    className="w-full h-full object-cover block rounded-[2px]"
                  />
                  <div className="absolute inset-x-1 bottom-1 py-1 bg-[#0E0E0E]/95 backdrop-blur-sm flex items-center justify-center border-t border-white/10">
                    <span
                      className={`font-space font-bold text-[9px] sm:text-[10px] leading-tight uppercase tracking-wider ${
                        isSelected ? "text-white" : "text-[#C4C7C8]"
                      }`}
                    >
                      {thumb.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Product Description & Technical Specs (Desktop view positioned cleanly) */}
          <div className="hidden lg:flex flex-col gap-6 pt-4 border-t border-[#444748]/30">
            <div className="flex flex-col gap-2">
              <h2 className="font-space font-bold text-lg uppercase tracking-tight text-white">
                DESKRIPSI LENGKAP
              </h2>
              <p className="font-inter text-sm leading-relaxed text-[#C4C7C8]">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {product.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="p-3 bg-[#1C1B1B] border border-[#444748]/30 rounded-sm flex flex-col gap-1"
                >
                  <span className="font-space font-bold text-[10px] uppercase text-[#8E9192]">
                    {spec.label}
                  </span>
                  <span className="font-space font-bold text-xs text-white">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Jaminan Toko SixtyNine */}
            <div className="p-4 bg-[#1C1B1B] border border-[#444748]/30 rounded-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-white">
                <img
                  src="/images/icon-verified-badge.svg"
                  alt=""
                  className="w-4 h-4"
                />
                <span className="font-space font-bold text-xs uppercase">
                  JAMINAN KEASLIAN SIXTYNINE STORE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#E5E2E1]">
                <div className="flex items-center gap-2">
                  <span className="text-[#34D399]">✓</span>
                  <span>100% Brand New In Box (BNIB)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#34D399]">✓</span>
                  <span>Garansi Tukar Ukuran 3 Hari</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#34D399]">✓</span>
                  <span>Pengiriman Aman Double Box</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#34D399]">✓</span>
                  <span>Bisa Bayar Instan QRIS Semua Bank</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Product Buy Card & Selection Matrix) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="lg:sticky lg:top-[88px] flex flex-col gap-6 bg-[#161616] p-4 sm:p-6 border border-[#444748]/40 rounded-sm">
            {/* Header info */}
            <div className="flex flex-col gap-2 border-b border-[#444748]/30 pb-4">
              <div className="flex items-center justify-between">
                <span className="font-space font-bold text-[10px] tracking-widest uppercase text-[#8E9192]">
                  {product.archiveTag}
                </span>
                <div className="flex items-center gap-1.5">
                  <img
                    src="/images/icon-star.svg"
                    alt=""
                    className="w-3 h-3 block"
                  />
                  <span className="font-space font-bold text-xs text-[#E5E2E1]">
                    {product.rating}
                  </span>
                  <span className="font-inter text-xs text-[#8E9192]">
                    ({product.reviewsCount} ulasan pembeli)
                  </span>
                </div>
              </div>

              <h1 className="font-space font-bold text-2xl sm:text-3xl leading-tight uppercase text-white">
                {product.fullName}
              </h1>
              <p className="font-inter text-xs text-[#8E9192]">{product.subtitle}</p>

              {/* Price Row */}
              <div className="pt-2 flex items-center gap-3">
                <span className="font-space font-bold text-2xl sm:text-3xl text-white">
                  {product.priceFormatted}
                </span>
                <span className="font-inter text-sm line-through text-[#8E9192]">
                  {product.originalPriceFormatted}
                </span>
                <span className="px-2 py-0.5 bg-[#CC003C]/30 border border-[#CC003C] font-space font-bold text-xs text-[#FFB3B6]">
                  {product.discountBadge}
                </span>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2 text-[10px] font-space font-bold text-[#C4C7C8]">
              <span className="px-2.5 py-1 bg-[#201F1F] border border-[#444748]/40 rounded-sm inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                READY STOCK YOGYAKARTA
              </span>
              <span className="px-2.5 py-1 bg-[#201F1F] border border-[#444748]/40 rounded-sm inline-flex items-center gap-1.5">
                ✓ CICILAN 0% & QRIS
              </span>
              <span className="px-2.5 py-1 bg-[#201F1F] border border-[#444748]/40 rounded-sm inline-flex items-center gap-1.5">
                ⚡ {product.soldCount + 250}+ TERJUAL CEPAT
              </span>
            </div>

            {/* Size Selector */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-space font-bold text-xs uppercase text-white">
                    {product.categoryType === "backpack"
                      ? "PILIHAN UKURAN TAS"
                      : "PILIH UKURAN SEPATU"}
                  </span>
                  <span className="font-inter text-xs text-[#8E9192]">
                    Terpilih:{" "}
                    <strong className="text-white">{selectedSize.fullLabel}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Panduan Ukuran: Ukur telapak kaki dari tumit ke ujung jari terpanjang dalam CM. Silakan chat CS jika butuh saran.")}
                  className="font-space font-bold text-[10px] tracking-wider uppercase underline text-[#C4C7C8] hover:text-white"
                >
                  PANDUAN UKURAN
                </button>
              </div>

              <div
                className={`grid ${
                  product.sizes.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"
                } gap-2`}
              >
                {product.sizes.map((sz, idx) => {
                  const isSelected = selectedSizeIdx === idx;
                  return (
                    <button
                      key={sz.us}
                      type="button"
                      onClick={() => setSelectedSizeIdx(idx)}
                      className={`p-2.5 flex flex-col justify-center items-start text-left rounded-sm transition-all ${
                        isSelected
                          ? "bg-white border-2 border-white text-[#131313] font-bold shadow-md"
                          : "bg-[#201F1F] border border-[#444748]/40 text-white hover:border-white/50"
                      }`}
                    >
                      <span className="font-space text-xs">{sz.us}</span>
                      <span
                        className={`font-inter text-[10px] ${
                          isSelected ? "text-[#131313]" : "text-[#8E9192]"
                        }`}
                      >
                        {sz.eurCm}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Action Buttons (Always Visible on Desktop) */}
            <div className="hidden lg:flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-12 bg-white text-[#131313] font-space font-bold text-sm uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 hover:bg-[#F2F2F2] active:scale-[0.99] transition-all shadow-md"
              >
                <span>BELI SEKARANG (QRIS) • {product.priceFormatted}</span>
                <img
                  src="/images/icon-pdp-buyarrow.svg"
                  alt=""
                  className="w-3.5 h-3.5"
                />
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="h-11 bg-[#201F1F] border border-[#444748] text-white font-space font-bold text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 hover:bg-[#2A2A2A] transition-colors"
                >
                  <img
                    src="/images/icon-pdp-addcart.svg"
                    alt=""
                    className="w-4 h-4"
                  />
                  <span>+ KERANJANG</span>
                </button>

                <a
                  href="https://wa.me/6285725548466"
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 bg-[#201F1F] border border-[#444748] text-[#C4C7C8] hover:text-white font-space font-bold text-xs uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 hover:bg-[#2A2A2A] transition-colors"
                >
                  <img
                    src="/images/icon-pdp-chat.svg"
                    alt=""
                    className="w-4 h-4"
                  />
                  <span>KONSULTASI CS</span>
                </a>
              </div>
            </div>

            {/* Mobile View: Description for small screens */}
            <div className="lg:hidden flex flex-col gap-4 pt-4 border-t border-[#444748]/30">
              <div className="flex flex-col gap-2">
                <h2 className="font-space font-bold text-base uppercase text-white">
                  DESKRIPSI PRODUK
                </h2>
                <p className="font-inter text-xs leading-relaxed text-[#C4C7C8]">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-2.5 bg-[#201F1F] border border-[#444748]/20 flex flex-col gap-1"
                  >
                    <span className="font-space font-bold text-[9px] uppercase text-[#8E9192]">
                      {spec.label}
                    </span>
                    <span className="font-space font-bold text-xs text-white">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Shared Desktop Footer */}
      <Footer />

      {/* Toast Feedback */}
      {addedToast && (
        <div className="fixed bottom-24 lg:bottom-8 right-1/2 translate-x-1/2 lg:right-8 lg:translate-x-0 px-4 py-2.5 bg-[#25D366] text-black font-space font-bold text-xs uppercase tracking-wider rounded-sm shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>Produk berhasil ditambahkan ke Keranjang!</span>
        </div>
      )}

      {/* Aside - STICKY BOTTOM ACTION BAR (FOR MOBILE & TABLET ONLY) */}
      <aside className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[540px] px-4 py-3 bg-[#0E0E0E]/95 backdrop-blur-md border-t border-[#444748] flex items-center gap-2 z-50 shadow-2xl">
        <a
          href="https://wa.me/6285725548466"
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 bg-[#201F1F] border border-[#444748]/40 flex flex-col items-center justify-center gap-0.5 shrink-0 hover:bg-[#2A2A2A] rounded-sm transition-colors"
          title="Chat WhatsApp"
        >
          <img
            src="/images/icon-pdp-chat.svg"
            alt=""
            className="w-4 h-4 block"
          />
          <span className="font-space font-bold text-[8px] uppercase text-[#C4C7C8]">
            CS CHAT
          </span>
        </a>

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-12 h-12 bg-[#201F1F] border border-[#444748]/40 flex flex-col items-center justify-center gap-0.5 shrink-0 hover:bg-[#2A2A2A] active:scale-95 rounded-sm transition-all"
          title="Tambah ke Keranjang"
        >
          <img
            src="/images/icon-pdp-addcart.svg"
            alt=""
            className="w-4 h-4 block"
          />
          <span className="font-space font-bold text-[8px] uppercase text-[#E5E2E1]">
            +BAG
          </span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 h-12 px-3 bg-white text-[#131313] font-space font-bold text-xs uppercase tracking-tight rounded-sm flex items-center justify-center gap-2 hover:bg-white/95 active:scale-[0.99] transition-all shadow-md"
        >
          <span className="truncate">
            BELI SEKARANG (QRIS) • {product.priceFormatted}
          </span>
          <img
            src="/images/icon-pdp-buyarrow.svg"
            alt=""
            className="w-3.5 h-3.5 block shrink-0"
          />
        </button>
      </aside>
    </div>
  );
}
