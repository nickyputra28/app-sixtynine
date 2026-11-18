"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isBeranda = pathname === "/beranda";
  const isKatalog = pathname === "/katalog";
  const isLacak = pathname === "/lacak";
  const isAkun = pathname === "/login";

  return (
    <nav
      aria-label="Navigasi Utama"
      className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-[4px] bg-[#0E0E0E]/95 backdrop-blur-md border-t border-[#444748] grid grid-cols-4 items-center z-50 select-none shadow-[0_-10px_25px_rgba(0,0,0,0.5)]"
    >
      {/* 1. Beranda */}
      <Link
        href="/beranda"
        className={`h-[42px] py-[4px] flex flex-col items-center justify-center gap-[3px] border-t-2 transition-colors ${
          isBeranda
            ? "border-white text-white"
            : "border-transparent text-[#8E9192] hover:text-white/80"
        }`}
      >
        <span className="w-[20px] h-[16px] flex items-center justify-center">
          <svg
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[13.33px] h-[15px]"
          >
            <path
              d="M1.66667 13.3333H4.16667V8.33333H9.16667V13.3333H11.6667V5.83333L6.66667 2.08333L1.66667 5.83333V13.3333ZM0 15V5L6.66667 0L13.3333 5V15H7.5V10H5.83333V15H0Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase">
          BERANDA
        </span>
      </Link>

      {/* 2. Katalog */}
      <Link
        href="/katalog"
        className={`h-[42px] py-[4px] flex flex-col items-center justify-center gap-[3px] border-t-2 transition-colors ${
          isKatalog
            ? "border-white text-white"
            : "border-transparent text-[#8E9192] hover:text-white/80"
        }`}
      >
        <span className="w-[20px] h-[16px] flex items-center justify-center">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[15px] h-[15px]"
          >
            <path
              d="M0 6.66667V0H6.66667V6.66667H0ZM0 15V8.33333H6.66667V15H0ZM8.33333 6.66667V0H15V6.66667H8.33333ZM8.33333 15V8.33333H15V15H8.33333ZM1.66667 5H5V1.66667H1.66667V5ZM10 5H13.3333V1.66667H10V5ZM10 13.3333H13.3333V10H10V13.3333ZM1.66667 13.3333H5V10H1.66667V13.3333Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase">
          KATALOG
        </span>
      </Link>

      {/* 3. Lacak */}
      <Link
        href="/lacak"
        className={`h-[42px] py-[4px] flex flex-col items-center justify-center gap-[3px] border-t-2 transition-colors ${
          isLacak
            ? "border-white text-white"
            : "border-transparent text-[#8E9192] hover:text-white/80"
        }`}
      >
        <span className="w-[20px] h-[16px] flex items-center justify-center">
          <svg
            width="19"
            height="14"
            viewBox="0 0 19 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[18.33px] h-[13.33px]"
          >
            <path
              d="M4.31818 13.8182C3.59849 13.8182 2.98674 13.5663 2.48296 13.0625C1.97917 12.5587 1.72727 11.947 1.72727 11.2273H0V1.72727C0 1.25227 0.169129 0.845644 0.507387 0.507387C0.845644 0.169129 1.25227 0 1.72727 0H13.8182V3.45455H16.4091L19 6.90909V11.2273H17.2727C17.2727 11.947 17.0208 12.5587 16.5171 13.0625C16.0133 13.5663 15.4015 13.8182 14.6818 13.8182C13.9621 13.8182 13.3504 13.5663 12.8466 13.0625C12.3428 12.5587 12.0909 11.947 12.0909 11.2273H6.90909C6.90909 11.947 6.6572 12.5587 6.15341 13.0625C5.64962 13.5663 5.03788 13.8182 4.31818 13.8182ZM4.31818 12.0909C4.56288 12.0909 4.76799 12.0081 4.93352 11.8426C5.09905 11.6771 5.18182 11.472 5.18182 11.2273C5.18182 10.9826 5.09905 10.7775 4.93352 10.6119C4.76799 10.4464 4.56288 10.3636 4.31818 10.3636C4.07349 10.3636 3.86837 10.4464 3.70284 10.6119C3.53731 10.7775 3.45455 10.9826 3.45455 11.2273C3.45455 11.472 3.53731 11.6771 3.70284 11.8426C3.86837 12.0081 4.07349 12.0909 4.31818 12.0909ZM1.72727 9.5H2.41818C2.66288 9.24091 2.94356 9.0322 3.26023 8.87387C3.57689 8.71553 3.92955 8.63637 4.31818 8.63637C4.70682 8.63637 5.05947 8.71553 5.37614 8.87387C5.6928 9.0322 5.97349 9.24091 6.21818 9.5H12.0909V1.72727H1.72727V9.5ZM14.6818 12.0909C14.9265 12.0909 15.1316 12.0081 15.2972 11.8426C15.4627 11.6771 15.5455 11.472 15.5455 11.2273C15.5455 10.9826 15.4627 10.7775 15.2972 10.6119C15.1316 10.4464 14.9265 10.3636 14.6818 10.3636C14.4371 10.3636 14.232 10.4464 14.0665 10.6119C13.901 10.7775 13.8182 10.9826 13.8182 11.2273C13.8182 11.472 13.901 11.6771 14.0665 11.8426C14.232 12.0081 14.4371 12.0909 14.6818 12.0909ZM13.8182 7.77273H17.4886L15.5455 5.18182H13.8182V7.77273Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase">
          LACAK
        </span>
      </Link>

      {/* 4. Akun */}
      <Link
        href="/login"
        className={`h-[42px] py-[4px] flex flex-col items-center justify-center gap-[3px] border-t-2 transition-colors ${
          isAkun
            ? "border-white text-white"
            : "border-transparent text-[#8E9192] hover:text-white/80"
        }`}
      >
        <span className="w-[20px] h-[16px] flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[13.33px] h-[13.33px]"
          >
            <path
              d="M6.99999 6.99999C6.0375 6.99999 5.21354 6.65729 4.52812 5.97187C3.84271 5.28645 3.5 4.4625 3.5 3.5C3.5 2.5375 3.84271 1.71354 4.52812 1.02812C5.21354 0.342708 6.0375 0 6.99999 0C7.96249 0 8.78645 0.342708 9.47187 1.02812C10.1573 1.71354 10.5 2.5375 10.5 3.5C10.5 4.4625 10.1573 5.28645 9.47187 5.97187C8.78645 6.65729 7.96249 6.99999 6.99999 6.99999ZM0 14V11.55C0 11.0542 0.127604 10.5984 0.382812 10.1828C0.63802 9.76718 0.977083 9.44999 1.4 9.23124C2.30416 8.77916 3.22291 8.4401 4.15625 8.21406C5.08958 7.98801 6.0375 7.87499 6.99999 7.87499C7.96249 7.87499 8.91041 7.98801 9.84374 8.21406C10.7771 8.4401 11.6958 8.77916 12.6 9.23124C13.0229 9.44999 13.362 9.76718 13.6172 10.1828C13.8724 10.5984 14 11.0542 14 11.55V14H0Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="font-space font-bold text-[10px] leading-[12px] tracking-[0.05em] uppercase">
          AKUN
        </span>
      </Link>
    </nav>
  );
}
