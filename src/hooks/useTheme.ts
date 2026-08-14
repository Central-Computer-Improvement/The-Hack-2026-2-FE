"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

let globalTheme: Theme = "light";
const listeners = new Set<() => void>();

function getInitialTheme(): Theme {
  if (typeof document !== "undefined") {
    if (document.documentElement.classList.contains("dark")) {
      return "dark";
    }
    const saved = localStorage.getItem("simgizi-theme");
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }
  return "light";
}

if (typeof window !== "undefined") {
  globalTheme = getInitialTheme();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  return globalTheme;
}

function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const applyThemeToDOM = (t: Theme) => {
    if (typeof document === "undefined") return;
    if (t === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  };

  const toggleTheme = (targetTheme?: Theme) => {
    const nextTheme = targetTheme || (globalTheme === "dark" ? "light" : "dark");
    globalTheme = nextTheme;

    if (typeof document !== "undefined") {
      document.documentElement.classList.add("theme-transitioning");
      localStorage.setItem("simgizi-theme", nextTheme);
      applyThemeToDOM(nextTheme);

      setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 400);
    }

    listeners.forEach((listener) => listener());
  };

  return { theme, toggleTheme, mounted: true };
}
