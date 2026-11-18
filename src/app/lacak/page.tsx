"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { ALL_PRODUCTS, formatRupiah, getProductById } from "@/data/products";
import {
  fetchOrderByIdOrLatestFromDb,
  OrderRecord,
} from "@/lib/supabase";

function LacakResiContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const initialProductId =
    searchParams.get("product") || "vans-old-skool-classic";
  const initialSizeIdx = Number(searchParams.get("size") ?? "8");
  const courierParam = searchParams.get("courier") || "ez";

  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const [savedOrder, setSavedOrder] = useState<OrderRecord | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchOrderByIdOrLatestFromDb(orderIdParam, selectedProductId).then(
      (ord) => {
        if (ord) {
          setSavedOrder(ord);
          setSelectedProductId(ord.product_id);
        }
      }
    );
  }, [orderIdParam, selectedProductId]);

  const product = getProductById(selectedProductId);
  const safeSizeIdx =
    savedOrder && savedOrder.product_id === product.id
      ? savedOrder.selected_size_index
      : initialSizeIdx >= 0 && initialSizeIdx < product.sizes.length
      ? initialSizeIdx
      : product.defaultSizeIndex;
  const selectedSize = product.sizes[safeSizeIdx] || product.sizes[0];

  const activeOrderForProduct =
    savedOrder && savedOrder.product_id === product.id ? savedOrder : null;

  const activeCourier = activeOrderForProduct
    ? activeOrderForProduct.courier_code
    : courierParam;
  const shippingCost = activeOrderForProduct
    ? activeOrderForProduct.shipping_cost
    : activeCourier === "super"
    ? 38000
    : 24000;
  const totalPaid = activeOrderForProduct
    ? activeOrderForProduct.grand_total
    : product.priceNumber + shippingCost - 15000;
  const displayOrderNumber =
    activeOrderForProduct?.order_number || product.orderNumber;
  const displayResiNumber =
    activeOrderForProduct?.resi_number || product.resiNumber;
  const displayRecipientName =
    activeOrderForProduct?.recipient_name ||
    "Customer Verified (SIXTYNINE Account)";
  const displayRecipientPhone =
    activeOrderForProduct?.recipient_phone || "+62 812-****-9821";
  const displayFullAddress =
    activeOrderForProduct?.full_address ||
    "Alamat tersinkronisasi otomatis dengan profil pemesan.";

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(displayResiNumber);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#131313] flex flex-col pb-[96px] md:pb-0">
      {/* Header - TopAppBar Component */}
      <header className="w-full h-16 bg-[#131313]/95 backdrop-blur-md border-b border-[#444748] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between w-full">
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

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-space font-bold tracking-wider text-[#C4C7C8]">
            <Link href="/beranda" className="hover:text-white transition-colors">
              BERANDA
            </Link>
            <Link href="/katalog" className="hover:text-white transition-colors">
              KATALOG PRODUK
            </Link>
            <Link
              href="/lacak"
              className="text-white border-b-2 border-white pb-0.5"
            >
              LACAK RESI
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              AKUN MEMBER
            </Link>
          </nav>

          <Link
            href={`/checkout?product=${product.id}&size=${safeSizeIdx}`}
            aria-label="Shopping Bag"
            className="relative w-10 h-10 flex items-center justify-center rounded hover:bg-white/5 transition-colors"
          >
            <img
              src="/images/icon-cart-header.svg"
              alt="Keranjang"
              className="w-4 h-5 block"
            />
          </Link>
        </div>
      </header>

      {/* Section - Subheader Bar / Breadcrumb Label (#1:4025) */}
      <div className="w-full bg-[#0E0E0E] border-b border-[#444748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[12px] pb-[8px] flex items-center justify-between w-full">
          <div className="flex items-center gap-[8px]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#CC003C] block" />
            <h1 className="font-space font-bold text-[12px] leading-[16px] tracking-[0.05em] uppercase text-white">
              STATUS PESANAN &amp; RESI
            </h1>
          </div>
          <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.1em] uppercase text-[#C4C7C8]">
            LIVE TRACK
          </span>
        </div>
      </div>

      {/* Main (#1:4032) */}
      <main className="max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-6">
        {/* Section - Status Payment Verified Card (#1:4033) */}
        <section className="relative p-[16px] bg-[#1C1B1B] border border-[#444748] rounded-[2px] flex flex-col gap-[12px] overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-[4px] items-start">
              <div className="px-[6px] py-[2px] bg-white inline-flex items-center justify-center">
                <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#131313]">
                  PEMBAYARAN QRIS TERVERIFIKASI
                </span>
              </div>
              <h2 className="pt-[2px] font-space font-bold text-[22px] leading-[28px] tracking-[-0.025em] uppercase text-white">
                LUNAS OTOMATIS
              </h2>
              <p className="font-inter text-[12px] leading-[16px] text-[#8E9192]">
                No Pesanan:{" "}
                <strong className="text-white">{displayOrderNumber}</strong>
              </p>
            </div>

            <div className="w-[28px] h-[28px] rounded-full bg-white flex items-center justify-center shrink-0">
              <svg
                width="13"
                height="10"
                viewBox="0 0 13 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 5L4.8 8.3L11.5 1.5"
                  stroke="#131313"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </div>
          </div>

          <div className="pt-[10px] border-t border-[#444748]/40 flex items-center justify-between">
            <span className="font-inter text-[12px] leading-[16px] text-[#C4C7C8]">
              Waktu Transaksi
            </span>
            <span className="font-space font-bold text-[11px] leading-[15px] uppercase text-white">
              HARI INI, {activeOrderForProduct?.paid_at || "14:32"} WIB
            </span>
          </div>
        </section>

        {/* Section - J&T Resi Card (#1:4052) */}
        <section className="p-[16px] bg-[#201F1F] border border-[#444748] shadow-[0px_4px_0px_0px_#000000] flex flex-col gap-[12px]">
          <div className="pb-[8px] border-b border-[#444748]/60 flex items-start justify-between">
            <div className="flex flex-col gap-[4px]">
              <div className="flex items-center gap-[6px]">
                <span className="px-[6px] py-[2px] bg-[#CC003C] font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-white">
                  J&amp;T EXPRESS
                </span>
                <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
                  {activeCourier === "super" ? "NEXT DAY" : "REGULER"}
                </span>
              </div>
              <span className="font-inter text-[12px] leading-[16px] text-[#C4C7C8]">
                Drop Pusat Yogyakarta
              </span>
            </div>

            <div className="flex flex-col items-end gap-[4px]">
              <span className="font-space font-bold text-[9px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
                ESTIMASI SAMPAI
              </span>
              <span className="font-space font-bold text-[12px] leading-[16px] text-white">
                {activeCourier === "super"
                  ? "1 Hari Kerja"
                  : "2 - 3 Hari Kerja"}
              </span>
            </div>
          </div>

          {/* Waybill Number & Copy Action (#1:4066) */}
          <div className="p-[12px] bg-[#0E0E0E] border border-[#444748]/80 flex items-center justify-between">
            <div className="flex flex-col gap-[2px]">
              <span className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
                NOMOR RESI RESMI
              </span>
              <span className="font-space font-bold text-[18px] leading-[24px] tracking-[-0.025em] text-white">
                {displayResiNumber}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="h-[30px] px-[10px] bg-[#2A2A2A] border border-[#444748] inline-flex items-center justify-center gap-[6px] font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-white hover:bg-[#353535] transition-colors"
            >
              <span>{copied ? "TERSALIN" : "SALIN RESI"}</span>
            </button>
          </div>

          {/* Current Status Banner (#1:4076) */}
          <div className="p-[10px] bg-[#2A2A2A] border-l-2 border-white flex flex-col gap-[2px]">
            <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.1em] uppercase text-[#FFB3B6]">
              STATUS TERKINI
            </span>
            <span className="font-inter font-semibold text-[12px] leading-[16px] text-white">
              Paket Sedang Transit di Gateway Sortir J&amp;T
            </span>
          </div>
        </section>

        {/* Section - Logistics Stepper Timeline (#1:4081) */}
        <section className="p-[16px] bg-[#1C1B1B] border border-[#444748] rounded-[2px] flex flex-col gap-[16px]">
          <div className="pb-[10px] border-b border-[#444748]/60 flex items-center justify-between">
            <h2 className="font-space font-bold text-[12px] leading-[16px] tracking-[0.05em] uppercase text-white">
              HISTORI PERJALANAN LOGISTIK
            </h2>
            <div className="flex items-center gap-[6px]">
              <span className="w-[6px] h-[6px] rounded-full bg-[#34D399] block" />
              <span className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
                REAL-TIME
              </span>
            </div>
          </div>

          {/* Vertical Stepper (#1:4088) */}
          <div className="relative pl-[4px] flex flex-col gap-[16px]">
            {/* Vertical Connecting Line (#1:4089) */}
            <div className="absolute left-[13px] top-[10px] bottom-[24px] w-[1px] bg-[#444748]" />

            {/* Step 1 (Active) (#1:4090) */}
            <div className="relative flex items-start gap-[12px]">
              <div className="w-[20px] h-[20px] rounded-full bg-white flex items-center justify-center shrink-0 z-10">
                <svg
                  width="11"
                  height="8"
                  viewBox="0 0 13 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 5L4.8 8.3L11.5 1.5"
                    stroke="#131313"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </svg>
              </div>
              <div className="flex-1 flex flex-col gap-[4px]">
                <div className="flex items-center gap-[8px]">
                  <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.025em] uppercase text-white">
                    TRANSIT GATEWAY SORTIR J&amp;T
                  </span>
                  <span className="px-[5px] py-[1px] bg-[#CC003C] font-space font-bold text-[9px] leading-[11px] uppercase text-white">
                    TERBARU
                  </span>
                </div>
                <p className="font-inter text-[12px] leading-[16px] text-[#C4C7C8]">
                  Paket telah tiba di pusat sortir transit logistik [Gateway
                  Kulon Progo / Jogja Interchange].
                </p>
                <span className="font-mono text-[10px] leading-[14px] text-[#8E9192]">
                  14:55 WIB // HARI INI
                </span>
              </div>
            </div>

            {/* Step 2 (#1:4104) */}
            <div className="relative flex items-start gap-[12px]">
              <div className="w-[20px] h-[20px] rounded-full bg-[#1C1B1B] border border-[#444748] flex items-center justify-center shrink-0 z-10">
                <span className="w-[6px] h-[6px] rounded-full bg-[#8E9192]" />
              </div>
              <div className="flex-1 flex flex-col gap-[4px]">
                <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.025em] uppercase text-[#E5E2E1]">
                  DROP POINT J&amp;T YOGYAKARTA
                </span>
                <p className="font-inter text-[12px] leading-[16px] text-[#C4C7C8]">
                  Paket diserahkan oleh tim dispatch SIXTYNINE Warehouse ke J&amp;T
                  Express.
                </p>
                <span className="font-mono text-[10px] leading-[14px] text-[#8E9192]">
                  14:10 WIB // HARI INI
                </span>
              </div>
            </div>

            {/* Step 3 (#1:4113) */}
            <div className="relative flex items-start gap-[12px]">
              <div className="w-[20px] h-[20px] rounded-full bg-[#1C1B1B] border border-[#444748] flex items-center justify-center shrink-0 z-10">
                <span className="w-[6px] h-[6px] rounded-full bg-[#8E9192]" />
              </div>
              <div className="flex-1 flex flex-col gap-[4px]">
                <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.025em] uppercase text-[#E5E2E1]">
                  QUALITY CHECK &amp; DOUBLE-BOX PACKAGING
                </span>
                <p className="font-inter text-[12px] leading-[16px] text-[#C4C7C8]">
                  Produk lulus sertifikasi QC skate shop &amp; disegel bubble wrap
                  tebal.
                </p>
                <span className="font-mono text-[10px] leading-[14px] text-[#8E9192]">
                  13:45 WIB // HARI INI
                </span>
              </div>
            </div>

            {/* Step 4 (#1:4122) */}
            <div className="relative flex items-start gap-[12px]">
              <div className="w-[20px] h-[20px] rounded-full bg-[#1C1B1B] border border-[#444748] flex items-center justify-center shrink-0 z-10">
                <span className="w-[6px] h-[6px] rounded-full bg-[#8E9192]" />
              </div>
              <div className="flex-1 flex flex-col gap-[4px]">
                <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.025em] uppercase text-[#E5E2E1]">
                  PESANAN DIBUAT &amp; TERKONFIRMASI QRIS
                </span>
                <p className="font-inter text-[12px] leading-[16px] text-[#C4C7C8]">
                  Pembayaran lunas via QRIS Instant Settlement.
                </p>
                <span className="font-mono text-[10px] leading-[14px] text-[#8E9192]">
                  13:30 WIB // HARI INI
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section - Shoe Item Summary Card (#1:4131) */}
        <section className="p-[14px] bg-[#1C1B1B] border border-[#444748] flex flex-col gap-[12px]">
          <div className="pb-[8px] border-b border-[#444748]/60 flex items-center justify-between">
            <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
              DETAIL ITEM PESANAN
            </span>
            <span className="px-[6px] py-[2px] bg-[#2A2A2A] font-space font-bold text-[10px] leading-[12px] uppercase text-white">
              {product.categoryType === "backpack" ? "1 UNIT" : "1 PASANG"}
            </span>
          </div>

          <div className="flex items-center gap-[12px]">
            <div className="relative w-[76px] h-[76px] bg-[#201F1F] border border-[#444748]/50 shrink-0 overflow-hidden">
              <img
                src={product.image}
                alt={product.fullName}
                className="w-full h-full object-cover block"
              />
              <span className="absolute left-[4px] top-[4px] px-[4px] py-[1px] bg-[#0E0E0E]/85 font-space font-medium text-[8px] leading-[11px] uppercase text-white">
                ORIGINAL
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-[3px] min-w-0">
              <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
                {product.categoryTag}
              </span>
              <Link
                href={`/produk/${product.id}`}
                className="font-space font-bold text-[13px] leading-[17px] uppercase text-white hover:underline truncate"
              >
                {product.fullName}
              </Link>
              <span className="font-inter text-[11px] leading-[15px] text-[#C4C7C8]">
                Size:{" "}
                <strong className="text-white">
                  {activeOrderForProduct?.selected_size_label ||
                    selectedSize.fullLabel}
                </strong>
              </span>
              <div className="pt-[4px] mt-[2px] border-t border-[#444748]/40 flex items-center justify-between">
                <span className="font-inter text-[11px] text-[#8E9192]">
                  Total Lunas
                </span>
                <span className="font-space font-bold text-[14px] leading-[18px] text-white">
                  {formatRupiah(totalPaid)}
                </span>
              </div>
            </div>
          </div>

          {/* Switcher for all 6 Figma Status & Lacak Resi screens */}
          <div className="pt-[8px] border-t border-[#444748]/40 flex flex-col gap-[6px]">
            <span className="font-space font-bold text-[9px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
              LIHAT STATUS RESI PRODUK LAIN (6 LAYAR FIGMA):
            </span>
            <div className="flex items-center gap-[6px] overflow-x-auto pb-[2px] no-scrollbar">
              {ALL_PRODUCTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedProductId(item.id)}
                  className={`h-[24px] px-[8px] rounded-[2px] font-space font-bold text-[9px] leading-[12px] uppercase whitespace-nowrap shrink-0 transition-colors ${
                    item.id === product.id
                      ? "bg-white text-[#0E0E0E]"
                      : "bg-[#201F1F] border border-[#444748] text-[#C4C7C8] hover:text-white"
                  }`}
                >
                  {item.berandaName.replace("…", "")}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Logistics Origin & Destination Section (#1:4153) */}
        <section className="p-[14px] bg-[#1C1B1B] border border-[#444748] flex flex-col gap-[12px]">
          <div className="pb-[6px] border-b border-[#444748]/60">
            <h2 className="font-space font-bold text-[12px] leading-[16px] tracking-[0.05em] uppercase text-white">
              RUTE PENGIRIMAN
            </h2>
          </div>

          {/* Origin (#1:4156) */}
          <div className="flex items-start gap-[10px]">
            <div className="w-[28px] h-[28px] bg-[#201F1F] border border-[#8E9192] rounded-[2px] flex items-center justify-center shrink-0">
              <img
                src="/images/icon-store.svg"
                alt=""
                className="w-[13px] h-[12px] block"
              />
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
                GUDANG ASAL (PENGIRIM)
              </span>
              <span className="font-inter font-bold text-[12px] leading-[16px] text-white">
                SIXTYNINE STORE YOGYAKARTA
              </span>
              <p className="font-inter text-[12px] leading-[16px] text-[#C4C7C8]">
                Jl. Kaliurang KM 5.2, Caturtunggal, Depok, Sleman, D.I.
                Yogyakarta 55281
              </p>
            </div>
          </div>

          <div className="w-full border-t border-[#444748]/40" />

          {/* Destination (#1:4168) */}
          <div className="flex items-start gap-[10px]">
            <div className="w-[28px] h-[28px] bg-white rounded-[2px] flex items-center justify-center shrink-0">
              <svg
                width="10"
                height="13"
                viewBox="0 0 10 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 13 5 13C5 13 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.75C4.03 6.75 3.25 5.97 3.25 5C3.25 4.03 4.03 3.25 5 3.25C5.97 3.25 6.75 4.03 6.75 5C6.75 5.97 5.97 6.75 5 6.75Z"
                  fill="#131313"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
                ALAMAT TUJUAN (PENERIMA)
              </span>
              <span className="font-inter font-bold text-[12px] leading-[16px] text-white">
                {displayRecipientName}
              </span>
              <span className="font-inter text-[12px] leading-[16px] text-[#C4C7C8]">
                Penerima: {displayRecipientPhone}
              </span>
              <span className="font-inter text-[12px] leading-[16px] text-[#C4C7C8]">
                {displayFullAddress}
              </span>
            </div>
          </div>
        </section>

        {/* Section - Action Buttons (#1:4181) */}
        <div className="flex flex-col gap-[10px]">
          <a
            href="https://wa.me/6285725548466"
            target="_blank"
            rel="noreferrer"
            className="w-full py-[12px] px-[16px] bg-[#25D366] rounded-[4px] shadow-[0px_4px_0px_0px_#000000] flex items-center justify-center gap-[8px] font-space font-bold text-[12px] leading-[16px] tracking-[0.04em] uppercase text-black hover:brightness-105 transition-all"
          >
            <img
              src="/images/icon-wa-float.svg"
              alt=""
              className="w-[16.67px] h-[16.67px] block shrink-0"
            />
            <span>KONFIRMASI KE WHATSAPP ADMIN (085725548466)</span>
          </a>

          <Link
            href="/beranda"
            className="w-full h-[44px] px-[16px] bg-white rounded-[4px] flex items-center justify-center gap-[8px] font-space font-bold text-[12px] leading-[16px] tracking-[0.05em] uppercase text-[#131313] hover:bg-white/90 transition-colors"
          >
            <span>KEMBALI BERBELANJA</span>
            <img
              src="/images/icon-arrow.svg"
              alt=""
              className="w-[12px] h-[12px] block shrink-0"
            />
          </Link>
        </div>

        {/* Assurance Guarantee Footer Note (#1:4191) */}
        <div className="p-[10px] bg-[#0E0E0E] border border-[#444748]/40 text-center">
          <span className="font-space font-bold text-[10px] leading-[14px] tracking-[0.05em] uppercase text-[#8E9192]">
            JAMINAN 100% ORIGINAL ATAU UANG KEMBALI 2X LIPAT // DOUBLE BOX
            PACKAGING
          </span>
        </div>
      </main>

      {/* Shared Desktop Footer */}
      <Footer />

      <BottomNav />
    </div>
  );
}

export default function LacakResiPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[390px] min-h-screen bg-[#131313] flex items-center justify-center text-white font-space text-sm">
          Memuat Status Pesanan...
        </div>
      }
    >
      <LacakResiContent />
    </Suspense>
  );
}
