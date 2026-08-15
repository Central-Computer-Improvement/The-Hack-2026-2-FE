"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      onClick={() => toggleTheme(isDark ? "light" : "dark")}
      className="w-[72px] h-[36px] rounded-[13px] bg-[#f2f4f7] dark:bg-[#1a1d24] p-[3px] flex items-center justify-between relative cursor-pointer select-none transition-colors duration-200"
      aria-label="Toggle Theme"
      role="button"
      tabIndex={0}
    >
      {/* Sliding Active Pill Indicator */}
      <div
        className={`absolute top-[3px] w-[30px] h-[30px] rounded-[10px] bg-white dark:bg-[#262a34] shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isDark ? "left-[39px]" : "left-[3px]"
        }`}
      />

      {/* Light Mode Button (Sun) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleTheme("light");
        }}
        className={`w-[30px] h-[30px] rounded-[10px] flex items-center justify-center relative z-10 cursor-pointer transition-colors duration-200 ${
          !isDark
            ? "text-amber-500 dark:text-amber-400"
            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        }`}
        title="Light Mode"
      >
        <Sun
          className={`w-[15px] h-[15px] stroke-[1.9] transition-transform duration-200 ${
            !isDark ? "scale-105 rotate-0" : "scale-90 -rotate-45"
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
        className={`w-[30px] h-[30px] rounded-[10px] flex items-center justify-center relative z-10 cursor-pointer transition-colors duration-200 ${
          isDark
            ? "text-blue-400 dark:text-blue-300"
            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        }`}
        title="Dark Mode"
      >
        <Moon
          className={`w-[14px] h-[14px] stroke-[1.9] transition-transform duration-200 ${
            isDark ? "scale-105 rotate-0" : "scale-90 rotate-45"
          }`}
        />
      </button>
    </div>
  );
};

export default ThemeToggle;
