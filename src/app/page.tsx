"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashScreenPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(64);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 55);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const redirect = setTimeout(() => {
        router.push("/beranda");
      }, 450);
      return () => clearTimeout(redirect);
    }
  }, [progress, router]);

  return (
    <div
      onClick={() => router.push("/beranda")}
      className="relative w-full max-w-[500px] mx-auto min-h-screen sm:min-h-0 sm:my-auto sm:h-[680px] bg-[#0E0E0E] sm:rounded-2xl sm:border sm:border-white/10 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.8)] p-[24px] sm:p-[32px] flex flex-col justify-between items-center select-none cursor-pointer transition-transform hover:scale-[1.01]"
      title="Klik untuk langsung masuk ke Beranda"
    >
      {/* Top brand micro tag (#1:141) */}
      <header className="w-full pb-[12px] border-b border-white/10 flex items-center justify-between">
        <span className="font-mono font-normal text-[11px] leading-[16.5px] tracking-[0.1em] uppercase text-white/50">
          SIXTYNINE© ARCHIVE
        </span>
        <div className="flex items-center gap-[6px]">
          <span className="w-[6px] h-[6px] rounded-full bg-[#34D399]" />
          <span className="font-mono font-normal text-[11px] leading-[16.5px] tracking-[0.1em] uppercase text-white/50">
            ONLINE
          </span>
        </div>
      </header>

      {/* Center Content: Mascot + Progress UI (#1:147) */}
      <main className="w-full max-w-[320px] my-auto flex flex-col items-stretch justify-center">
        {/* Mascot Logo Container with dark streetwear contrast backing (#1:149 -> #1:150) */}
        <div className="pb-[24px] w-full">
          <div className="relative w-full p-[12px] rounded-[16px] bg-white/[0.05] backdrop-blur-xl flex items-center justify-center overflow-hidden">
            <img
              src="/images/splash-mascot-6346a4.png"
              alt="Sixty Nine Mascot"
              className="w-full h-auto aspect-square object-contain rounded-[10px] bg-white p-2 shadow-[0px_15px_60px_0px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>

        {/* Progress & Counter UI (#1:153) */}
        <div className="w-full h-[81px] flex flex-col justify-between">
          {/* Dynamic Percentage Counter (#1:154 -> #1:155) */}
          <div className="pb-[8px] flex items-end justify-center gap-[4px]">
            <span className="font-mono font-bold text-[36px] leading-[40px] tracking-[-0.05em] text-white">
              {progress}
            </span>
            <span className="font-mono font-bold text-[20px] leading-[28px] text-white/60">
              %
            </span>
          </div>

          {/* Streetwear Sleek Minimalist Progress Bar (#1:167) */}
          <div className="w-full h-[6px] bg-[#171717] border border-white/20 rounded-full p-[1.5px] shadow-[0px_0px_12px_0px_rgba(255,255,255,0.1)] flex items-center overflow-hidden">
            <div
              className="h-[2px] bg-white rounded-full shadow-[0px_0px_8px_rgba(255,255,255,0.8)] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status Micro-Text & Sequence Info (#1:160 -> #1:161) */}
          <div className="pt-[12px] flex items-center justify-between">
            <div className="flex items-center gap-[6px]">
              <span className="w-[4px] h-[4px] bg-white shrink-0" />
              <span className="font-mono font-normal text-[10px] leading-[15px] tracking-[0.05em] uppercase text-[#A3A3A3]">
                SYNCING ASSETS &amp; TEXTURES...
              </span>
            </div>
            <span className="font-mono font-medium text-[10px] leading-[15px] uppercase text-white/40">
              [SYSTEM.V2]
            </span>
          </div>
        </div>
      </main>

      {/* Footer Micro Note (#1:169) */}
      <footer className="w-full pt-[12px] border-t border-white/10 flex items-center justify-between">
        <span className="font-mono font-normal text-[10px] leading-[15px] tracking-[0.1em] uppercase text-white/30">
          SKATE CULTURE // REBEL SPIRIT
        </span>
        <span className="font-mono font-normal text-[10px] leading-[15px] tracking-[0.1em] uppercase text-white/30">
          EST. 2024
        </span>
      </footer>
    </div>
  );
}
