"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#111111] border-t border-white/10 text-[#8E9192] pt-12 pb-24 md:pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/sixtynine-logo-7ba055.png"
                alt="SIXTYNINE Logo"
                className="w-8 h-8 object-contain block"
              />
              <span className="font-space font-bold text-xl tracking-tight uppercase text-white">
                SIXTYNINE
              </span>
            </div>
            <p className="font-inter text-xs leading-relaxed text-[#A3A3A3]">
              Yogyakarta Original Skate Store. Menyediakan koleksi Vans Authentic, Old Skool, Sk8-Low, dan skate hardware 100% Original BNIB sejak 2024.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              <span className="font-mono text-[11px] text-white/70 uppercase">
                Yogyakarta Store • Open Daily
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5">
            <span className="font-space font-bold text-xs uppercase tracking-wider text-white">
              NAVIGASI
            </span>
            <Link href="/beranda" className="text-xs hover:text-white transition-colors">
              Beranda
            </Link>
            <Link href="/katalog" className="text-xs hover:text-white transition-colors">
              Semua Katalog
            </Link>
            <Link href="/katalog?cat=sepatu" className="text-xs hover:text-white transition-colors">
              Koleksi Sepatu Vans
            </Link>
            <Link href="/katalog?cat=backpack" className="text-xs hover:text-white transition-colors">
              Backpack &amp; Apparel
            </Link>
            <Link href="/lacak" className="text-xs hover:text-white transition-colors">
              Lacak Pengiriman Resi
            </Link>
          </div>

          {/* Service & Guarantee */}
          <div className="flex flex-col gap-2.5">
            <span className="font-space font-bold text-xs uppercase tracking-wider text-white">
              LAYANAN &amp; JAMINAN
            </span>
            <span className="text-xs text-[#A3A3A3]">
              ✓ 100% Original BNIB (Money Back Guarantee)
            </span>
            <span className="text-xs text-[#A3A3A3]">
              ✓ Garansi Tukar Size 3 Hari
            </span>
            <span className="text-xs text-[#A3A3A3]">
              ✓ Double Box Packing Safety
            </span>
            <span className="text-xs text-[#A3A3A3]">
              ✓ Pengiriman Cepat J&amp;T &amp; SiCepat
            </span>
          </div>

          {/* Contact & Hours */}
          <div className="flex flex-col gap-2.5">
            <span className="font-space font-bold text-xs uppercase tracking-wider text-white">
              KONTAK &amp; HUBUNGI KAMI
            </span>
            <a
              href="https://wa.me/6281234567890?text=Halo%20SIXTYNINE%2C%20mau%20tanya%20produk"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 rounded-lg text-white text-xs font-semibold transition-colors w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              WhatsApp CS: +62 812-3456-7890
            </a>
            <span className="text-xs text-[#A3A3A3]">
              Instagram: <a href="https://instagram.com/sixtynine.sco" target="_blank" rel="noreferrer" className="text-white hover:underline">@sixtynine.sco</a>
            </span>
            <span className="text-xs text-[#A3A3A3]">
              Jam Operasional: 10:00 - 22:00 WIB
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6E7172]">
          <span>
            © 2024–2026 SIXTYNINE STORE. ALL RIGHTS RESERVED.
          </span>
          <div className="flex items-center gap-4">
            <span>QRIS</span>
            <span>•</span>
            <span>BCA</span>
            <span>•</span>
            <span>MANDIRI</span>
            <span>•</span>
            <span>J&amp;T EXPRESS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
