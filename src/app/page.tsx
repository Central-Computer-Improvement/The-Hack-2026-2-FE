"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import Topbar from "@/components/layouts/Topbar";
import HealthSummary from "@/components/dashboard/HealthSummary";
import StuntingAlerts from "@/components/dashboard/StuntingAlerts";
import NutritionChart from "@/components/charts/NutritionChart";
import { Plus, Book } from "lucide-react";
import Link from "next/link";
import WhoRulesModal from "@/components/_shared/WhoRulesModal";

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWhoRules, setShowWhoRules] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen xl:h-screen xl:overflow-hidden bg-[#f8f9fa] dark:bg-[#0f1115] text-zinc-900 dark:text-zinc-100 font-inter transition-colors duration-200">
      {/* Responsive Sidebar (W: 290px on Desktop) */}
      <Sidebar
        currentTab="dashboard"
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Modal Guide WHO */}
      <WhoRulesModal
        isOpen={showWhoRules}
        onClose={() => setShowWhoRules(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 xl:h-screen xl:overflow-hidden">
        {/* Topbar (H: 66px) */}
        <Topbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Full-width Content Container */}
        <main className="p-4 sm:p-5 xl:p-6 flex flex-col space-y-4 [@media(min-height:850px)]:space-y-5 w-full flex-1 xl:min-h-0 xl:overflow-hidden">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <h1 className="font-inter text-[24px] sm:text-[28px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Dashboard Gizi
            </h1>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link
                href="/pencatatan-anak"
                className="px-4 h-[42px] bg-[#0d472c] hover:bg-[#0a3923] active:bg-[#0a3923] text-white rounded-xl font-inter text-[14px] font-medium flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-[18px] h-[18px] stroke-[1.8]" />
                <span>Tambah data anak</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowWhoRules(true)}
                className="px-4 h-[42px] bg-[#eef3ed] dark:bg-[#1b2720] border border-[#c3dfc3] dark:border-emerald-900/60 text-[#0d472c] dark:text-emerald-300 font-inter text-[14px] font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Book className="w-[18px] h-[18px] stroke-[1.8]" />
                <span>Rumus & Aturan WHO</span>
              </button>
            </div>
          </div>

          {/* Section 1: Ringkasan Indikator Kesehatan */}
          <HealthSummary />

          {/* Section 2: Bottom Grid (Stunting Alerts + Distribution Chart) */}
          <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 xl:gap-4 [@media(min-height:850px)]:gap-5 w-full flex-1 xl:min-h-0">
            {/* Peringatan Dini Gizi & Stunting: Di HP tampil di bawah chart (order-2), di Desktop di kiri (xl:order-1) */}
            <div className="w-full xl:w-1/2 flex flex-col flex-1 xl:min-h-0 order-2 xl:order-1">
              <StuntingAlerts />
            </div>

            {/* Distribusi Status Gizi: Di HP tampil tepat setelah Ringkasan (order-1), di Desktop di kanan (xl:order-2) */}
            <div className="w-full xl:w-1/2 flex flex-col flex-1 xl:min-h-0 order-1 xl:order-2">
              <NutritionChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
