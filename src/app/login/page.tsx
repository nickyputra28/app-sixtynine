"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import {
  authenticateMember,
  getSavedMemberUser,
  isSupabaseConfigured,
  MemberSessionUser,
  signOutMember,
} from "@/lib/supabase";

export default function LoginAccountPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<MemberSessionUser | null>(null);

  useEffect(() => {
    setCurrentUser(getSavedMemberUser());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setStatusMessage("Masukkan Email atau Nomor WhatsApp terlebih dahulu.");
      return;
    }
    setLoading(true);
    setStatusMessage(null);

    const res = await authenticateMember({
      mode: authMode,
      identifier: identifier.trim(),
      password: password || "sixtynine123",
    });

    setCurrentUser(res.user);
    setLoading(false);
    setStatusMessage(
      authMode === "register"
        ? `Akun ${res.user.full_name} berhasil terdaftar!`
        : `Selamat datang kembali, ${res.user.full_name}!`
    );

    setTimeout(() => {
      router.push("/beranda");
    }, 600);
  };

  const handleQuickLogin = async (provider: "google" | "whatsapp") => {
    setLoading(true);
    const demoId =
      provider === "google" ? "skater.yk@gmail.com" : "081298443120";
    const res = await authenticateMember({
      mode: "login",
      identifier: demoId,
      password: "oauth_fast_login_69",
    });
    setCurrentUser(res.user);
    setLoading(false);
    router.push("/beranda");
  };

  const handleLogout = async () => {
    await signOutMember();
    setCurrentUser(null);
    setStatusMessage("Sesi member berhasil keluar.");
  };

  return (
    <div className="relative w-full min-h-screen bg-[#131313] flex flex-col pb-[96px] md:pb-0">
      {/* Header - Top App Bar */}
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
            <Link href="/lacak" className="hover:text-white transition-colors">
              LACAK RESI
            </Link>
            <Link
              href="/login"
              className="text-white border-b-2 border-white pb-0.5"
            >
              AKUN MEMBER
            </Link>
          </nav>

          <Link
            href="/beranda"
            aria-label="Tutup"
            className="text-xs font-space font-bold text-[#8E9192] hover:text-white transition-colors"
          >
            KEMBALI KE STORE
          </Link>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="street-grid-bg flex-1 flex flex-col p-4 sm:p-6 lg:p-8 items-center justify-center">
        <div className="w-full max-w-[480px] flex flex-col gap-6 bg-[#161616] p-6 sm:p-8 border border-[#444748] rounded-[4px] shadow-2xl">
        {/* Active Member Banner if logged in */}
        {currentUser && (
          <div className="p-[12px] bg-[#1C1B1B] border border-[#25D366]/60 rounded-[4px] flex items-center justify-between gap-[8px]">
            <div className="flex flex-col gap-[2px] min-w-0">
              <span className="font-space font-bold text-[9px] leading-[12px] tracking-[0.05em] uppercase text-[#25D366]">
                ● MEMBER AKTIF TERHUBUNG
              </span>
              <span className="font-space font-bold text-[12px] leading-[16px] text-white truncate">
                {currentUser.full_name} ({currentUser.email})
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="px-[8px] py-[4px] bg-[#2A2A2A] border border-[#444748] rounded-[2px] font-space font-bold text-[9px] leading-[12px] uppercase text-[#FFDADA] hover:bg-[#353535] shrink-0"
            >
              KELUAR
            </button>
          </div>
        )}

        {/* Segmented Mode Toggle (MASUK vs DAFTAR) (#1:41) */}
        <div className="w-full p-[4px] bg-[#1C1B1B] border border-[#444748] rounded-[4px] grid grid-cols-2">
          <button
            type="button"
            onClick={() => setAuthMode("login")}
            className={`h-[32px] py-[8px] rounded-[2px] flex items-center justify-center font-space text-[12px] leading-[16px] tracking-[0.05em] uppercase whitespace-nowrap transition-all ${
              authMode === "login"
                ? "bg-white text-[#2F3131] font-bold shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                : "text-[#8E9192] font-semibold hover:text-white"
            }`}
          >
            MASUK / LOGIN
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("register")}
            className={`h-[32px] py-[8px] rounded-[2px] flex items-center justify-center font-space text-[12px] leading-[16px] tracking-[0.05em] uppercase whitespace-nowrap transition-all ${
              authMode === "register"
                ? "bg-white text-[#2F3131] font-bold shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                : "text-[#8E9192] font-semibold hover:text-white"
            }`}
          >
            DAFTAR / REGISTER
          </button>
        </div>

        {/* Welcome Streetwear Hero Statement (#1:46) */}
        <section className="flex flex-col pt-[5px] gap-[5px] items-start">
          <div className="px-[6px] py-[2px] bg-[#CC003C] inline-flex items-center justify-center">
            <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-white">
              OFFICIAL SKATE DECK &amp; GEAR
            </span>
          </div>
          <h1 className="pt-[3px] font-space font-bold text-[26px] leading-[30px] tracking-[-0.05em] uppercase text-white">
            {authMode === "login"
              ? "WELCOME BACK, SKATER."
              : "JOIN THE CREW, SKATER."}
          </h1>
          <p className="font-inter font-normal text-[14px] leading-[22.75px] text-[#C4C7C8]">
            Masuk untuk kelola pesanan, simpan alamat
            <br />
            pengiriman, dan nikmati diskon member eksklusif.
          </p>
        </section>

        {/* Authentication Form (#1:53) */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          {/* Input: Identifier (Email / WhatsApp) (#1:54) */}
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="identifier"
              className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#E5E2E1]"
            >
              EMAIL ATAU NOMOR WHATSAPP
            </label>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-[13.67px] top-1/2 -translate-y-1/2 flex items-center justify-center">
                <img
                  src="/images/icon-mail.svg"
                  alt=""
                  aria-hidden="true"
                  className="w-[16.67px] h-[13.33px] block"
                />
              </span>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="contoh: skate@sixtynine.id / 0812xxxx"
                className="w-full h-[46px] bg-[#1C1B1B] border border-[#444748] rounded-[4px] pl-[40px] pr-[12px] font-inter font-normal text-[14px] leading-[19px] text-white placeholder:text-[#8E9192]/70 focus:outline-none focus:border-white/70 transition-colors"
              />
            </div>
          </div>

          {/* Input: Password (#1:62) */}
          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="password"
              className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#E5E2E1]"
            >
              KATA SANDI
            </label>
            <div className="relative flex items-center">
              <span className="pointer-events-none absolute left-[15.33px] top-1/2 -translate-y-1/2 flex items-center justify-center">
                <img
                  src="/images/icon-lock.svg"
                  alt=""
                  aria-hidden="true"
                  className="w-[13.33px] h-[17.5px] block"
                />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[46px] bg-[#1C1B1B] border border-[#444748] rounded-[4px] pl-[40px] pr-[44px] font-mono font-normal text-[14px] leading-[17px] text-white placeholder:text-[#8E9192]/70 focus:outline-none focus:border-white/70 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Tampilkan kata sandi"
                className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[28px] h-[28px] flex items-center justify-center rounded hover:bg-white/5 transition-colors"
              >
                <img
                  src="/images/icon-eye.svg"
                  alt="Tampilkan kata sandi"
                  className="w-[18.33px] h-[16.5px] block"
                />
              </button>
            </div>
          </div>

          {/* Utility Row: Remember Me & Forgot Password (#1:73) */}
          <div className="h-[28px] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setRememberMe((prev) => !prev)}
              className="inline-flex items-center gap-[7px] select-none"
            >
              <span
                className={`w-[18px] h-[18px] rounded-[2px] flex items-center justify-center transition-colors ${
                  rememberMe
                    ? "bg-[#CC003C]"
                    : "bg-[#1C1B1B] border border-[#444748]"
                }`}
              >
                {rememberMe && (
                  <img
                    src="/images/icon-check.svg"
                    alt=""
                    className="w-[16px] h-[16px] block"
                  />
                )}
              </span>
              <span className="font-space font-bold text-[10px] leading-[12px] text-[#E5E2E1]">
                Ingat Saya
              </span>
            </button>

            <a
              href="#forgot-password"
              onClick={(e) => e.preventDefault()}
              className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] underline text-[#FFDADA] hover:opacity-80 transition-opacity"
            >
              Lupa Kata Sandi?
            </a>
          </div>

          {statusMessage && (
            <div className="px-[12px] py-[8px] bg-[#1C1B1B] border border-[#444748] rounded-[4px] font-space font-bold text-[11px] leading-[15px] text-[#25D366]">
              {statusMessage}
            </div>
          )}

          {/* Primary CTA Button (#1:82) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[46px] px-[16px] bg-white rounded-[4px] shadow-[0px_4px_0px_0px_#000000] flex items-center justify-center gap-[8px] active:translate-y-[1px] transition-transform disabled:opacity-60"
          >
            <span className="font-space font-bold text-[14px] leading-[18px] tracking-[0.05em] uppercase text-[#2F3131]">
              {loading
                ? "MEMPROSES..."
                : authMode === "login"
                ? "MASUK SEKARANG"
                : "DAFTAR SEKARANG"}
            </span>
            <img
              src="/images/icon-arrow.svg"
              alt=""
              aria-hidden="true"
              className="w-[12px] h-[12px] block"
            />
          </button>
        </form>

        {/* Street Divider (#1:87) */}
        <div className="relative h-[12px] flex items-center justify-center w-full">
          <div className="w-full border-t border-[#444748]" />
          <div className="absolute bg-[#131313] px-[12px] flex items-center justify-center">
            <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.1em] uppercase text-[#8E9192] whitespace-nowrap">
              ATAU MASUK LEBIH CEPAT
            </span>
          </div>
        </div>

        {/* Quick Social / One-Tap Login Buttons (#1:91) */}
        <div className="flex flex-col pb-[16px] gap-[8px]">
          {/* Button - Google Fast Login (#1:92) */}
          <button
            type="button"
            onClick={() => handleQuickLogin("google")}
            className="w-full h-[42px] px-[16px] bg-[#1C1B1B] border border-[#444748] rounded-[4px] flex items-center justify-center gap-[12px] hover:bg-[#252424] active:scale-[0.99] transition-all"
          >
            <img
              src="/images/icon-google.svg"
              alt="Google"
              className="w-[16px] h-[16px] shrink-0 block"
            />
            <span className="font-space font-semibold text-[12px] leading-[16px] tracking-[0.05em] uppercase text-white whitespace-nowrap">
              MASUK DENGAN GOOGLE
            </span>
          </button>

          {/* Button - WhatsApp OTP Fast Login (#1:100) */}
          <button
            type="button"
            onClick={() => handleQuickLogin("whatsapp")}
            className="w-full h-[42px] px-[16px] bg-[#1C1B1B] border border-[#444748] rounded-[4px] flex items-center justify-center gap-[12px] hover:bg-[#252424] active:scale-[0.99] transition-all"
          >
            <img
              src="/images/icon-whatsapp.svg"
              alt="WhatsApp"
              className="w-[16.67px] h-[16.67px] shrink-0 block"
            />
            <span className="font-space font-semibold text-[12px] leading-[16px] tracking-[0.05em] uppercase text-white whitespace-nowrap">
              MASUK DENGAN WHATSAPP OTP
            </span>
            <span className="ml-auto px-[6px] h-[16px] bg-[#25D366]/20 rounded-[2px] inline-flex items-center justify-center font-space font-semibold text-[9px] leading-[16px] tracking-[0.0667em] uppercase text-[#25D366] shrink-0">
              INSTANT
            </span>
          </button>
        </div>

        {/* Section - Streetwear Club Benefits Showcase Bento (#1:108) */}
        <section className="flex flex-col pt-[16px] gap-[8px] border-t border-[#444748]/60">
          <div className="flex items-center justify-between">
            <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase text-[#8E9192]">
              SIXTYNINE CLUB // ADVANTAGES
            </span>
            <span className="font-space font-medium text-[9px] leading-[13.5px] uppercase text-[#CC003C]">
              YOGYAKARTA DIVISION
            </span>
          </div>

          <div className="grid grid-cols-2 gap-[8px]">
            {/* Benefit 1 (#1:115) */}
            <div className="p-[10px] bg-[#1C1B1B] border border-[#444748] rounded-[4px] flex flex-col justify-between">
              <div className="pb-[8px] h-[25.5px] flex items-center">
                <img
                  src="/images/icon-benefit-discount.svg"
                  alt=""
                  className="h-[17.5px] w-auto block"
                />
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="font-space font-bold text-[10px] leading-[12.5px] uppercase text-white">
                  POTONGAN
                </span>
                <span className="font-inter font-normal text-[10px] leading-[12.5px] text-[#C4C7C8]">
                  Rp 15.000 member baru
                </span>
              </div>
            </div>

            {/* Benefit 2 (#1:124) */}
            <div className="p-[10px] bg-[#1C1B1B] border border-[#444748] rounded-[4px] flex flex-col justify-between">
              <div className="pb-[8px] h-[25.5px] flex items-center">
                <img
                  src="/images/icon-benefit-track.svg"
                  alt=""
                  className="h-[13.33px] w-auto block"
                />
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="font-space font-bold text-[10px] leading-[12.5px] uppercase text-white">
                  LACAK RESI
                </span>
                <span className="font-inter font-normal text-[10px] leading-[12.5px] text-[#C4C7C8]">
                  Otomatis J&amp;T Express
                </span>
              </div>
            </div>
          </div>

          {/* Secure guarantee badge (#1:133) */}
          <div className="pt-[8px] flex items-center justify-center gap-[8px]">
            <img
              src="/images/icon-shield.svg"
              alt=""
              className="w-[9.33px] h-[11.67px] block"
            />
            <span className="font-space font-medium text-[10px] leading-[15px] uppercase text-[#8E9192]">
              100% GUARANTEED SKATE HARDWARE &amp; APPAREL
            </span>
          </div>
        </section>
        </div>
      </main>

      {/* Shared Desktop Footer */}
      <Footer />

      {/* Shared Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
