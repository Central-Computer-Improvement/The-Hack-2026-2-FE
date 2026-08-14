"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("simgizi-theme") as Theme | null;
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      applyThemeToDOM(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      applyThemeToDOM("dark");
    }
  }, []);

  const applyThemeToDOM = (t: Theme) => {
    if (t === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  };

  const toggleTheme = (targetTheme?: Theme) => {
    const nextTheme = targetTheme || (theme === "dark" ? "light" : "dark");

    // Enable smooth theme transition class for duration of CSS transition
    document.documentElement.classList.add("theme-transitioning");

    setTheme(nextTheme);
    localStorage.setItem("simgizi-theme", nextTheme);
    applyThemeToDOM(nextTheme);

    // Remove transition class after animation completes (matches 0.35s CSS)
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 400);
  };

  return { theme, toggleTheme, mounted };
}
