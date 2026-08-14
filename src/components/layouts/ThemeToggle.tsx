"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className="w-[89px] h-[48px]" />;
  }

  const isDark = theme === "dark";

  return (
    <div
      onClick={() => toggleTheme(isDark ? "light" : "dark")}
      className="w-[89px] h-[48px] rounded-[18px] bg-[#f4f5f7] dark:bg-[#1a1d24] p-[4px] flex items-center justify-between relative cursor-pointer select-none transition-colors duration-300"
      aria-label="Toggle Theme"
      role="button"
      tabIndex={0}
    >
      {/* Sliding Active Pill Indicator */}
      <div
        className={`absolute top-[4px] w-[40px] h-[40px] rounded-[12px] bg-white dark:bg-[#262a34] shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isDark ? "left-[45px]" : "left-[4px]"
        }`}
      />

      {/* Light Mode Button (Sun) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleTheme("light");
        }}
        className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center relative z-10 cursor-pointer transition-colors duration-200 ${
          !isDark
            ? "text-amber-500 dark:text-amber-400"
            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        }`}
        title="Light Mode"
      >
        <Sun
          className={`w-4 h-4 stroke-[2] transition-transform duration-300 ${
            !isDark ? "scale-110 rotate-0" : "scale-90 -rotate-45"
          }`}
        />
      </button>

      {/* Dark Mode Button (Moon) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleTheme("dark");
        }}
        className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center relative z-10 cursor-pointer transition-colors duration-200 ${
          isDark
            ? "text-blue-400 dark:text-blue-300"
            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        }`}
        title="Dark Mode"
      >
        <Moon
          className={`w-4 h-4 stroke-[2] transition-transform duration-300 ${
            isDark ? "scale-110 rotate-0" : "scale-90 rotate-45"
          }`}
        />
      </button>
    </div>
  );
};

export default ThemeToggle;
