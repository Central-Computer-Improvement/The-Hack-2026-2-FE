"use client";

import React from "react";
import { User, Menu } from "lucide-react";
import ThemeToggle from "@/components/layouts/ThemeToggle";

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  return (
    <header className="w-full h-[66px] bg-white/90 dark:bg-[#161920]/90 backdrop-blur-md border-b border-gray-200/70 dark:border-zinc-800/70 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200 select-none">
      {/* Left: Mobile Menu Button (Hamburger) */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Right: Theme Toggle (Dark/Light Mode) & User Profile Widget */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Theme Switcher Toggle (Mode Gelap & Terang) */}
        <ThemeToggle />

        {/* User Profile Widget */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200 dark:border-zinc-800">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-[#0d472c] dark:text-emerald-300 shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="font-inter text-[13.5px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              Bidan Sri Wahyuni, S.Tr.Keb
            </span>
            <span className="font-inter text-[11.5px] text-zinc-400 dark:text-zinc-500 leading-tight mt-0.5">
              Posyandu Melati 03
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
