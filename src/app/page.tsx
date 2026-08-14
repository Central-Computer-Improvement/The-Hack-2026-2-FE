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
    <div className="flex flex-col xl:flex-row min-h-screen xl:h-screen xl:overflow-hidden bg-[#f8f9fa] dark:bg-[#0f1115] text-zinc-900 dark:text-zinc-100 font-inter transition-colors duration-200">
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
        <main className="p-4 sm:p-5 xl:p-6 flex flex-col space-y-5 w-full flex-1 xl:min-h-0 xl:overflow-hidden">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <h1 className="font-inter text-[24px] sm:text-[28px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Dashboard Gizi
            </h1>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link
                href="/pencatatan-anak"
                className="px-4 h-[42px] bg-[#0d472c] hover:bg-[#0d472c] active:bg-[#0d472c] text-white rounded-xl font-inter text-[15px] font-medium flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-[18px] h-[18px] stroke-[1.8]" />
                <span>Tambah data anak</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowWhoRules(true)}
                className="px-4 h-[42px] bg-[#eef3ed] dark:bg-[#1b2720] border border-[#c3dfc3] dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-[#22352b] text-[#0d472c] dark:text-emerald-300 font-inter text-[14px] font-medium rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Book className="w-[18px] h-[18px] stroke-[1.8]" />
                <span>Rumusan &amp; Aturan WHO</span>
              </button>
            </div>
          </div>

          {/* Section 1: Ringkasan Indikator Kesehatan */}
          <HealthSummary />

          {/* Section 2: Bottom Grid (Stunting Alerts + Distribution Chart) */}
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 w-full flex-1 xl:min-h-0">
            {/* Left Column: Peringatan Dini Gizi & Stunting */}
            <div className="w-full xl:w-1/2 flex flex-col flex-1 xl:min-h-0">
              <StuntingAlerts />
            </div>

            {/* Right Column: Distribusi Status Gizi Balita */}
            <div className="w-full xl:w-1/2 flex flex-col flex-1 xl:min-h-0">
              <NutritionChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
