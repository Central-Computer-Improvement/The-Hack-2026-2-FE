"use client";

import React, { useRef, useEffect } from "react";
import { Search, Bell, Mail, User, Menu } from "lucide-react";
import ThemeToggle from "@/components/layouts/ThemeToggle";

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* Global Keyboard Shortcut: Ctrl + F or Cmd + F */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="w-full h-[66px] bg-white/90 dark:bg-[#161920]/90 backdrop-blur-md border-b border-[#e6e8eb] dark:border-[#262a34] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200 select-none">
      {/* Left: Mobile Menu Button & Search Input */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="w-[18px] h-[18px] text-zinc-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search"
            className="w-48 sm:w-72 md:w-96 lg:w-[380px] xl:w-[420px] h-[42px] pl-10 pr-16 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-zinc-700/80 rounded-xl font-inter text-[13.5px] sm:text-[14px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#0d472c] dark:focus:border-emerald-600 transition-all"
          />
          <span className="hidden sm:inline-block absolute right-3.5 font-inter text-[13px] font-normal text-zinc-400 dark:text-zinc-500 pointer-events-none">
            Ctrl +F
          </span>
        </div>
      </div>

      {/* Right: Notifications, Profile Widget & Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white dark:ring-zinc-900" />
        </button>

        {/* Mail Icon */}
        <button
          type="button"
          className="hidden sm:block p-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Messages"
        >
          <Mail className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* User Profile Widget */}
        <div className="flex items-center gap-2 sm:gap-3 sm:pl-2 sm:border-l border-gray-200 dark:border-zinc-800">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-[#0d472c] dark:text-emerald-300 shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="font-inter text-[13.5px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              Bidan Sri Wahyuni, S.Tr.Keb
            </span>
            <span className="font-inter text-[11.5px] text-zinc-400 dark:text-zinc-500 leading-tight">
              Posyandu Melati 03
            </span>
          </div>
        </div>

        {/* Theme Switcher Toggle (W: 89, H: 48) */}
        <div className="pl-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
