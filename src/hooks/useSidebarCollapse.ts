"use client";

import { useState, useEffect } from "react";

// Module-level singleton variable to preserve collapsed state synchronously across SPA page transitions
let globalIsCollapsed: boolean | null = null;
let isInitialHydration = true;

export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    // During initial hydration, always return false to match server HTML (w-[290px])
    if (isInitialHydration) {
      return false;
    }
    // After initial hydration (SPA page transitions), return the preserved state
    if (globalIsCollapsed !== null) {
      return globalIsCollapsed;
    }
    return false;
  });

  useEffect(() => {
    if (isInitialHydration) {
      isInitialHydration = false;
      const saved = localStorage.getItem("simgizi_sidebar_collapsed");
      if (saved !== null) {
        const val = saved === "true";
        globalIsCollapsed = val;
        setIsCollapsed(val);
      } else {
        globalIsCollapsed = false;
      }
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      globalIsCollapsed = next;
      if (typeof window !== "undefined") {
        localStorage.setItem("simgizi_sidebar_collapsed", String(next));
      }
      return next;
    });
  };

  return { isCollapsed, toggleCollapse };
}

export default useSidebarCollapse;
