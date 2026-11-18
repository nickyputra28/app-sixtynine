"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { ALL_PRODUCTS, formatRupiah, getProductById } from "@/data/products";
import { createOrderInDb, getSavedMemberUser } from "@/lib/supabase";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialProductId =
    searchParams.get("product") || "vans-sk8-low-classic";
  const initialSizeIdx = Number(searchParams.get("size") ?? "8");

  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const product = getProductById(selectedProductId);

  const safeSizeIdx =
    initialSizeIdx >= 0 && initialSizeIdx < product.sizes.length
      ? initialSizeIdx
      : product.defaultSizeIndex;
  const selectedSize = product.sizes[safeSizeIdx] || product.sizes[0];

  const [courier, setCourier] = useState<"ez" | "super">("ez");
  const [recipientName, setRecipientName] = useState("Aditya Pratama");
  const [recipientPhone, setRecipientPhone] = useState("0812-9844-3120");
  const [province, setProvince] = useState("DKI Jakarta");
  const [city, setCity] = useState("Jakarta Selatan");
  const [district, setDistrict] = useState("Kebayoran Baru");
  const [postalCode, setPostalCode] = useState("12180");
  const [fullAddress, setFullAddress] = useState(
    "Jl. Senopati No. 42B, RT 04 / RW 02, Kebayoran Baru, Jakarta Selatan (Pagar Hitam dekat Skatepark)"
  );
  const [submitting, setSubmitting] = useState(false);

  // Isi otomatis nama/telepon jika user sudah login di halaman Akun
  useEffect(() => {
    const member = getSavedMemberUser();
    if (member) {
      if (member.full_name) setRecipientName(member.full_name);
      if (member.phone_whatsapp) setRecipientPhone(member.phone_whatsapp);
    }
  }, []);

  // Countdown timer (14:51)
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 51);
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  const shippingCost = courier === "ez" ? 24000 : 38000;
  const memberDiscount = 15000;
  const grandTotal = product.priceNumber + shippingCost - memberDiscount;

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    const savedOrder = await createOrderInDb({
      product,
      sizeIndex: safeSizeIdx,
      sizeLabel: selectedSize.fullLabel,
      recipientName,
      recipientPhone,
      province,
      city,
      district,
      postalCode,
      fullAddress,
      courierCode: courier,
      shippingCost,
      discountAmount: memberDiscount,
      grandTotal,
    });
    setSubmitting(false);
    router.push(
      `/lacak?orderId=${savedOrder.id}&product=${product.id}&size=${safeSizeIdx}&courier=${courier}`
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-[#131313] flex flex-col pb-[148px] lg:pb-0">
      {/* Transactional Shell Header */}
      <header className="w-full h-16 bg-[#131313]/95 backdrop-blur-md border-b border-[#444748] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Kembali"
              className="w-9 h-9 bg-[#201F1F] border border-[#444748]/50 rounded-[4px] flex items-center justify-center hover:bg-[#2A2A2A] active:scale-95 transition-all"
            >
              <img
                src="/images/icon-back.svg"
                alt="Kembali"
                className="w-3.5 h-3.5 block"
              />
            </button>
            <div className="flex flex-col">
              <h1 className="font-space font-bold text-base sm:text-lg tracking-tight uppercase text-white">
                CHECKOUT PESANAN
              </h1>
              <span className="font-space font-medium text-[9px] tracking-wider uppercase text-[#8E9192]">
                VERIFIKASI &amp; PENGIRIMAN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 bg-[#CC003C]/20 border border-[#CC003C] rounded-[2px] inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CC003C] block" />
              <span className="font-space font-bold text-[10px] leading-none uppercase text-[#FFDADA]">
                SECURE CHECKOUT
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Urgency Flash Drop Countdown Banner (#1:3432) */}
      <div className="w-full bg-[#0E0E0E] border-b border-[#444748]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[8px] flex items-center justify-between w-full">
          <div className="flex items-center gap-[8px]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#CC003C] animate-pulse block" />
            <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#E5E2E1]">
              SELESAIKAN PEMBAYARAN QRIS DALAM
            </span>
          </div>
          <div className="px-[8px] py-[2px] bg-[#2A2A2A] border border-[#444748]/50 rounded-[2px]">
            <span className="font-mono font-bold text-[12px] leading-[16px] text-[#CC003C]">
              {mins}:{secs}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-1">
        {/* Left Column: Items, Address & QRIS Payment */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Section 1: Ringkasan Item Pesanan (#1:3441) */}
          <section className="p-[14px] bg-[#1C1B1B] border border-[#444748] rounded-[4px] flex flex-col gap-[12px]">
          <div className="pb-[8px] border-b border-[#444748]/50 flex items-center justify-between">
            <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
              RINGKASAN ITEM (1)
            </span>
            <span className="px-[6px] py-[2px] bg-[#2A2A2A] rounded-[2px] font-space font-bold text-[10px] leading-[12px] uppercase text-white">
              {product.categoryTag}
            </span>
          </div>

          <div className="flex items-start gap-[12px]">
            <div className="relative w-[80px] h-[80px] bg-[#0E0E0E] border border-[#444748]/50 rounded-[4px] overflow-hidden shrink-0">
              <img
                src={product.image}
                alt={product.fullName}
                className="w-full h-full object-cover block"
              />
              <span className="absolute right-[4px] bottom-[4px] px-[4px] py-[1px] bg-[#131313] border border-[#444748] font-space font-medium text-[9px] leading-[12px] text-white">
                1x
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-[4px] min-w-0">
              <h2 className="font-space font-bold text-[14px] leading-[18px] uppercase text-white truncate">
                {product.fullName}
              </h2>
              <span className="font-inter text-[12px] leading-[16px] text-[#C4C7C8]">
                {product.subtitle}
              </span>

              <div className="pt-[2px] flex flex-wrap gap-[4px]">
                <span className="px-[6px] py-[2px] bg-[#201F1F] border border-[#444748] font-space font-bold text-[10px] leading-[12px] text-[#E5E2E1]">
                  {selectedSize.us} // {selectedSize.eurCm.split("•")[0].trim()}
                </span>
                <span className="px-[6px] py-[2px] bg-[#201F1F] border border-[#444748] font-space font-bold text-[10px] leading-[12px] text-[#E5E2E1]">
                  Qty: 1
                </span>
              </div>

              <div className="pt-[6px] flex items-center justify-between">
                <span className="font-inter text-[11px] text-[#8E9192]">
                  Harga Satuan
                </span>
                <span className="font-space font-bold text-[16px] leading-[20px] text-white">
                  {product.priceFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Product Switcher Pill Bar */}
          <div className="pt-[8px] border-t border-[#444748]/40 flex flex-col gap-[6px]">
            <span className="font-space font-bold text-[9px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
              GANTI PRODUK CHECKOUT (6 VARIAN LAYAR FIGMA):
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

        {/* Section 2: Informasi Pengiriman & Asal Pengirim (#1:3464) */}
        <section className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[6px]">
              <img
                src="/images/icon-truck-promo.svg"
                alt=""
                className="w-[14.67px] h-[10.67px] block"
              />
              <h3 className="font-space font-bold text-[14px] leading-[18px] uppercase text-white">
                INFORMASI PENGIRIMAN
              </h3>
            </div>
            <span className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
              DIJAMIN AMAN
            </span>
          </div>

          {/* Origin / Asal Pengirim (#1:3473) */}
          <div className="p-[10px] bg-[#1C1B1B] border border-[#444748]/60 rounded-[4px] flex items-start gap-[10px]">
            <div className="w-[28px] h-[28px] bg-[#201F1F] border border-[#444748] rounded-[2px] flex items-center justify-center shrink-0">
              <img
                src="/images/icon-store.svg"
                alt=""
                className="w-[14px] h-[13px] block"
              />
            </div>
            <div className="flex-1 flex flex-col gap-[2px]">
              <div className="flex items-center justify-between">
                <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
                  ORIGIN / ASAL PENGIRIM
                </span>
                <span className="px-[6px] py-[1px] bg-[#2A2A2A] border border-[#444748] rounded-[2px] font-space font-bold text-[9px] leading-[12px] uppercase text-[#E5E2E1]">
                  TERKUNCI
                </span>
              </div>
              <span className="font-space font-bold text-[12px] leading-[16px] uppercase text-white">
                GUDANG SIXTYNINE YOGYAKARTA
              </span>
              <span className="font-inter text-[11px] leading-[15px] text-[#8E9192]">
                D.I. Yogyakarta 55281 • Drop Pusat Streetwear
              </span>
            </div>
          </div>

          {/* Alamat Tujuan Pelanggan Form (#1:3488) */}
          <div className="p-[14px] bg-[#201F1F] border border-[#444748]/60 rounded-[4px] flex flex-col gap-[12px]">
            <div className="pb-[8px] border-b border-[#444748]/40 flex items-center justify-between">
              <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
                ALAMAT TUJUAN PELANGGAN
              </span>
              <span className="px-[6px] py-[1px] bg-[#2A2A2A] font-space font-bold text-[9px] leading-[12px] uppercase text-white">
                UTAMA
              </span>
            </div>

            <div className="flex flex-col gap-[10px]">
              <div className="flex flex-col gap-[4px]">
                <label className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
                  NAMA PENERIMA
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full h-[38px] px-[12px] bg-[#0E0E0E] border border-[#444748] rounded-[4px] font-inter text-[12px] text-white focus:outline-none focus:border-white/70"
                />
              </div>

              <div className="flex flex-col gap-[4px]">
                <label className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
                  NOMOR TELEPON / WHATSAPP
                </label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full h-[38px] px-[12px] bg-[#0E0E0E] border border-[#444748] rounded-[4px] font-inter text-[12px] text-white focus:outline-none focus:border-white/70"
                />
              </div>

              <div className="grid grid-cols-2 gap-[8px]">
                <div className="flex flex-col gap-[4px]">
                  <label className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
                    PROVINSI
                  </label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full h-[38px] px-[10px] bg-[#0E0E0E] border border-[#444748] rounded-[4px] font-inter text-[12px] text-white focus:outline-none focus:border-white/70"
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <label className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
                    KOTA / KABUPATEN
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-[38px] px-[10px] bg-[#0E0E0E] border border-[#444748] rounded-[4px] font-inter text-[12px] text-white focus:outline-none focus:border-white/70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[8px]">
                <div className="flex flex-col gap-[4px]">
                  <label className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
                    KECAMATAN
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-[38px] px-[10px] bg-[#0E0E0E] border border-[#444748] rounded-[4px] font-inter text-[12px] text-white focus:outline-none focus:border-white/70"
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <label className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
                    KODE POS
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full h-[38px] px-[10px] bg-[#0E0E0E] border border-[#444748] rounded-[4px] font-inter text-[12px] text-white focus:outline-none focus:border-white/70"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-[4px]">
                <label className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#8E9192]">
                  ALAMAT LENGKAP (JALAN, NO RUMAH, RT/RW)
                </label>
                <textarea
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  className="w-full p-[10px] bg-[#0E0E0E] border border-[#444748] rounded-[4px] font-inter text-[12px] leading-[16px] text-white focus:outline-none focus:border-white/70 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pilihan Kurir Ekspedisi (#1:3536) */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
                PILIHAN KURIR EKSPEDISI
              </span>
              <span className="font-space font-bold text-[10px] leading-[12px] uppercase text-[#FFDADA]">
                OTOMATIS DIKALKULASI
              </span>
            </div>

            {/* Option 1: J&T EZ */}
            <button
              type="button"
              onClick={() => setCourier("ez")}
              className={`w-full p-[12px] rounded-[4px] flex items-center justify-between text-left transition-all ${
                courier === "ez"
                  ? "bg-[#201F1F] border-2 border-white"
                  : "bg-[#1C1B1B] border border-[#444748]/60 opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-start gap-[10px]">
                <span
                  className={`mt-[2px] w-[16px] h-[16px] rounded-full border flex items-center justify-center shrink-0 ${
                    courier === "ez"
                      ? "border-white bg-white"
                      : "border-[#8E9192]"
                  }`}
                >
                  {courier === "ez" && (
                    <span className="w-[6px] h-[6px] rounded-full bg-[#0E0E0E]" />
                  )}
                </span>
                <div className="flex flex-col gap-[2px]">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-space font-bold text-[12px] leading-[16px] uppercase text-white">
                      J&amp;T EXPRESS EZ
                    </span>
                    <span className="px-[6px] py-[1px] bg-white rounded-[2px] font-space font-bold text-[9px] leading-[12px] uppercase text-[#2F3131]">
                      REGULER
                    </span>
                  </div>
                  <span className="font-inter text-[11px] leading-[15px] text-[#C4C7C8]">
                    Estimasi 2-3 Hari • Yogyakarta ➔ {city}
                  </span>
                </div>
              </div>
              <span className="font-space font-bold text-[14px] leading-[18px] text-white shrink-0">
                Rp 24.000
              </span>
            </button>

            {/* Option 2: J&T Super */}
            <button
              type="button"
              onClick={() => setCourier("super")}
              className={`w-full p-[12px] rounded-[4px] flex items-center justify-between text-left transition-all ${
                courier === "super"
                  ? "bg-[#201F1F] border-2 border-white"
                  : "bg-[#1C1B1B] border border-[#444748]/60 opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-start gap-[10px]">
                <span
                  className={`mt-[2px] w-[16px] h-[16px] rounded-full border flex items-center justify-center shrink-0 ${
                    courier === "super"
                      ? "border-white bg-white"
                      : "border-[#8E9192]"
                  }`}
                >
                  {courier === "super" && (
                    <span className="w-[6px] h-[6px] rounded-full bg-[#0E0E0E]" />
                  )}
                </span>
                <div className="flex flex-col gap-[2px]">
                  <div className="flex items-center gap-[6px]">
                    <span className="font-space font-bold text-[12px] leading-[16px] uppercase text-white">
                      J&amp;T EXPRESS SUPER
                    </span>
                    <span className="px-[6px] py-[1px] bg-[#CC003C] rounded-[2px] font-space font-bold text-[9px] leading-[12px] uppercase text-white">
                      NEXT DAY
                    </span>
                  </div>
                  <span className="font-inter text-[11px] leading-[15px] text-[#C4C7C8]">
                    Estimasi 1 Hari Kerja (Besok Sampai)
                  </span>
                </div>
              </div>
              <span className="font-space font-bold text-[14px] leading-[18px] text-white shrink-0">
                Rp 38.000
              </span>
            </button>
          </div>
        </section>

        {/* Section 4: QRIS Dinamis Otomatis (#1:3607) */}
        <section className="p-[16px] bg-[#201F1F] border-2 border-[#444748]/80 rounded-[4px] flex flex-col gap-[14px]">
          <div className="pb-[10px] border-b border-[#444748]/50 flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="w-[28px] h-[28px] bg-white rounded-[2px] flex items-center justify-center font-space font-bold text-[14px] text-[#131313]">
                Q
              </div>
              <div className="flex flex-col">
                <h3 className="font-space font-bold text-[13px] leading-[17px] uppercase text-white">
                  QRIS DINAMIS OTOMATIS
                </h3>
                <span className="font-inter text-[11px] leading-[15px] text-[#8E9192]">
                  Semua M-Banking &amp; E-Wallet Indonesia
                </span>
              </div>
            </div>
            <span className="px-[6px] py-[2px] bg-[#25D366]/20 rounded-[2px] font-space font-bold text-[9px] leading-[12px] uppercase text-[#25D366]">
              INSTANT
            </span>
          </div>

          {/* QR Code White Card (#1:3620) */}
          <div className="w-[240px] mx-auto p-[12px] bg-white rounded-[4px] shadow-lg flex flex-col items-center gap-[8px] text-[#131313]">
            <div className="w-full pb-[6px] border-b border-black/10 flex items-center justify-between">
              <span className="font-space font-bold text-[12px] leading-[14px] tracking-tight text-black">
                QRIS
              </span>
              <span className="font-space font-bold text-[9px] leading-[12px] uppercase text-[#CC003C]">
                GPN NASIONAL
              </span>
            </div>

            <div className="py-[4px] flex items-center justify-center">
              <img
                src="/images/qris-code.svg"
                alt="QRIS SIXTYNINE"
                className="w-[176px] h-[176px] block"
              />
            </div>

            <div className="w-full pt-[6px] border-t border-black/10 flex flex-col items-center gap-[2px]">
              <span className="font-mono font-bold text-[10px] leading-[13px] text-black">
                NMID: ID1024889218903
              </span>
              <span className="font-inter text-[9px] leading-[12px] text-black/70">
                SIXTYNINE OFFICIAL STORE INDONESIA
              </span>
            </div>
          </div>

          {/* Supported Banks / E-Wallets (#1:3665) */}
          <div className="flex flex-wrap items-center justify-center gap-[6px]">
            {[
              "BCA",
              "Mandiri",
              "BRI",
              "BNI",
              "GoPay",
              "OVO",
              "DANA",
              "ShopeePay",
            ].map((bank) => (
              <span
                key={bank}
                className="px-[8px] py-[3px] bg-[#131313] border border-[#444748] rounded-[2px] font-space font-bold text-[10px] leading-[12px] text-[#E5E2E1]"
              >
                {bank}
              </span>
            ))}
          </div>

          {/* Panduan Cepat Bayar (#1:3682) */}
          <div className="p-[12px] bg-[#0E0E0E] border border-[#444748]/50 rounded-[4px] flex flex-col gap-[8px]">
            <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
              PANDUAN CEPAT BAYAR:
            </span>
            <ol className="flex flex-col gap-[6px] text-[11px] leading-[15px] text-[#E5E2E1]">
              <li className="flex items-center gap-[8px]">
                <span className="w-[16px] h-[16px] rounded-full bg-[#2A2A2A] font-space font-bold text-[10px] flex items-center justify-center text-white shrink-0">
                  1
                </span>
                <span>Screenshot / Simpan kode QRIS di atas</span>
              </li>
              <li className="flex items-center gap-[8px]">
                <span className="w-[16px] h-[16px] rounded-full bg-[#2A2A2A] font-space font-bold text-[10px] flex items-center justify-center text-white shrink-0">
                  2
                </span>
                <span>Buka BCA Mobile, Livin, GoPay, OVO, atau DANA</span>
              </li>
              <li className="flex items-center gap-[8px]">
                <span className="w-[16px] h-[16px] rounded-full bg-[#2A2A2A] font-space font-bold text-[10px] flex items-center justify-center text-white shrink-0">
                  3
                </span>
                <span>Pilih menu Bayar / Scan QR dari galeri foto Anda</span>
              </li>
              <li className="flex items-center gap-[8px]">
                <span className="w-[16px] h-[16px] rounded-full bg-[#2A2A2A] font-space font-bold text-[10px] flex items-center justify-center text-white shrink-0">
                  4
                </span>
                <span>
                  Pastikan nominal{" "}
                  <strong className="text-white">
                    {formatRupiah(grandTotal)}
                  </strong>{" "}
                  dan konfirmasi PIN
                </span>
              </li>
            </ol>
          </div>
        </section>
      </div>

      {/* Right Column: Order Summary, Cost Breakdown & Desktop Pay Button */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Section 3: Rincian Total Pembayaran */}
        <section className="p-4 sm:p-5 bg-[#1C1B1B] border border-[#444748] rounded-[4px] flex flex-col gap-3">
          <div className="pb-2 border-b border-[#444748]/50 flex items-center justify-between">
            <span className="font-space font-bold text-[10px] tracking-wider uppercase text-[#8E9192]">
              RINCIAN TOTAL PEMBAYARAN
            </span>
            <span className="font-mono text-[10px] text-[#C4C7C8]">
              INVOICE: {product.invoiceNumber}
            </span>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#C4C7C8]">Subtotal Produk (1 Item)</span>
              <span className="font-space font-bold text-white">
                {product.priceFormatted}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#C4C7C8]">
                Biaya Pengiriman ({courier === "ez" ? "J&T EZ" : "J&T Super"})
              </span>
              <span className="font-space font-bold text-white">
                {formatRupiah(shippingCost)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#FFDADA]">Diskon Streetwear Member</span>
              <span className="font-space font-bold text-[#FFDADA]">
                -Rp 15.000
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#C4C7C8]">
                Biaya Layanan &amp; Payment Gateway
              </span>
              <span className="font-mono text-[11px] uppercase text-[#34D399]">
                GRATIS (RP 0)
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#444748] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-space font-bold text-xs uppercase text-white">
                TOTAL TAGIHAN AKHIR
              </span>
              <span className="font-space font-bold text-[9px] uppercase text-[#FFDADA]">
                SUDAH TERMASUK PAJAK &amp; ONGKIR
              </span>
            </div>
            <span className="font-space font-bold text-2xl text-white">
              {formatRupiah(grandTotal)}
            </span>
          </div>
        </section>

        {/* Desktop Pay CTA Box */}
        <div className="hidden lg:flex flex-col gap-3 p-5 bg-[#1C1B1B] border border-[#444748] rounded-[4px]">
          <button
            type="button"
            onClick={handleConfirmPayment}
            disabled={submitting}
            className="w-full py-3 px-4 bg-white text-[#131313] font-space font-bold text-xs uppercase tracking-wider rounded-[4px] shadow-lg hover:bg-[#F2F2F2] active:scale-[0.99] transition-all disabled:opacity-60 flex flex-col items-center justify-center gap-0.5"
          >
            <span>
              {submitting
                ? "MENYIMPAN TRANSAKSI KE DATABASE..."
                : "SAYA SUDAH MEMBAYAR (VERIFIKASI OTOMATIS)"}
            </span>
            <span className="font-inter text-[9px] text-[#131313]/70 font-normal">
              RESI &amp; INVOICE OTOMATIS DITERBITKAN SETELAH VERIFIKASI
            </span>
          </button>

          <a
            href="https://wa.me/6285725548466"
            target="_blank"
            rel="noreferrer"
            className="w-full h-10 px-3 bg-[#201F1F] border border-[#444748] rounded-[4px] flex items-center justify-center gap-2 hover:bg-[#2A2A2A] transition-colors"
          >
            <img
              src="/images/icon-whatsapp.svg"
              alt=""
              className="w-3.5 h-3.5 block shrink-0"
            />
            <span className="font-space font-bold text-[10px] tracking-wider uppercase text-white">
              KONFIRMASI MANUAL VIA WHATSAPP (085725548466)
            </span>
          </a>
        </div>

        {/* Garansi Keaslian Banner */}
        <section className="p-4 bg-[#0E0E0E] border border-[#444748] rounded-[4px] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#131313] border border-[#444748] flex items-center justify-center shrink-0 rounded-sm">
            <img
              src="/images/icon-shield.svg"
              alt=""
              className="w-3.5 h-4 block"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="font-space font-bold text-xs uppercase text-white">
              100% ORIGINAL GUARANTEED OR 10X MONEY BACK
            </h4>
            <p className="font-inter text-xs text-[#8E9192]">
              Setiap item melewati kurasi barcode fisik di Gudang sixtynine Yogyakarta.
            </p>
          </div>
        </section>
      </div>
      </main>

      {/* Shared Desktop Footer */}
      <Footer />

      {/* Sticky Bottom Checkout Action Dock (Mobile only) */}
      <footer className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[540px] px-4 py-2.5 bg-[#0E0E0E]/95 backdrop-blur-md border-t border-[#444748] flex flex-col gap-2 z-50 shadow-2xl">
        <button
          type="button"
          onClick={handleConfirmPayment}
          disabled={submitting}
          className="w-full py-[10px] px-[12px] bg-white rounded-[4px] shadow-[0px_4px_0px_0px_#000000] flex flex-col items-center justify-center gap-[2px] hover:bg-white/95 active:translate-y-[1px] transition-all disabled:opacity-60"
        >
          <span className="font-space font-bold text-[12px] leading-[16px] tracking-[0.04em] uppercase text-[#2F3131] text-center">
            {submitting
              ? "MENYIMPAN TRANSAKSI KE DATABASE..."
              : "SAYA SUDAH MEMBAYAR (VERIFIKASI OTOMATIS)"}
          </span>
          <span className="font-inter text-[9px] leading-[13px] uppercase text-[#2F3131]/75">
            RESI &amp; INVOICE OTOMATIS DITERBITKAN SETELAH VERIFIKASI
          </span>
        </button>

        <a
          href="https://wa.me/6285725548466"
          target="_blank"
          rel="noreferrer"
          className="w-full h-[34px] px-[12px] bg-[#201F1F] border border-[#444748] rounded-[4px] flex items-center justify-center gap-[8px] hover:bg-[#2A2A2A] transition-colors"
        >
          <img
            src="/images/icon-whatsapp.svg"
            alt=""
            className="w-[14px] h-[14px] block shrink-0"
          />
          <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.03em] uppercase text-white">
            KONFIRMASI MANUAL VIA WHATSAPP (085725548466)
          </span>
        </a>
      </footer>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-[390px] min-h-screen bg-[#131313] flex items-center justify-center text-white font-space text-sm">
          Memuat Checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
