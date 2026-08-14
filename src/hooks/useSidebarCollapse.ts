"use client";

import { useState, useEffect } from "react";

// Module-level singleton variable to preserve collapsed state synchronously across SPA page transitions
let globalIsCollapsed: boolean | null = null;

export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (globalIsCollapsed !== null) {
      return globalIsCollapsed;
    }
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("simgizi_sidebar_collapsed");
      if (saved !== null) {
        const val = saved === "true";
        globalIsCollapsed = val;
        return val;
      }
    }
    return false;
  });

  useEffect(() => {
    if (globalIsCollapsed === null) {
      const saved = localStorage.getItem("simgizi_sidebar_collapsed");
      if (saved !== null) {
        const val = saved === "true";
        globalIsCollapsed = val;
        setIsCollapsed(val);
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
