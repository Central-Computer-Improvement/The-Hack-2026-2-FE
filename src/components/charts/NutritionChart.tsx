"use client";

import React, { useState } from "react";
import { dataAnak } from "@/lib/data-anak";

interface BarData {
  id: string;
  category: string;
  count: number;
  heightPercent: number;
  color: string;
}

export const NutritionChart: React.FC = () => {
  const [hoveredBar, setHoveredBar] = useState<BarData | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [containerWidth, setContainerWidth] = useState<number>(500);

  // 4 Kategori Status Gizi Resmi
  const categories = [
    { id: "1", category: "Normal", color: "#368364" },
    { id: "2", category: "Gizi Kurang", color: "#FFEA00" },
    { id: "3", category: "Gizi Buruk", color: "#FFA382" },
    { id: "4", category: "Stunting", color: "#ef4444" },
  ];

  // Hitung jumlah riil per kategori dari data-anak.ts (Single Source of Truth)
  const counts = categories.map(
    (cat) => dataAnak.filter((a) => a.statusGizi === cat.category).length,
  );

  // Perhitungan Sumbu Y 100% Dinamis mengikuti data maksimum
  const maxCount = Math.max(...counts, 4);
  const step = Math.max(1, Math.ceil(maxCount / 4));
  const maxScale = step * 4;
  const yTicks = [maxScale, step * 3, step * 2, step * 1, 0];

  const chartData: BarData[] = categories.map((cat, idx) => {
    const count = counts[idx];
    const heightPercent = maxScale > 0 ? (count / maxScale) * 100 : 0;

    return {
      ...cat,
      count,
      heightPercent,
    };
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setContainerWidth(rect.width);
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const tooltipLeft = Math.max(
    10,
    Math.min(mousePos.x - 55, containerWidth - 120),
  );
  const tooltipTop = Math.max(8, mousePos.y - 62);

  return (
    <section className="w-full h-full flex-1 bg-white dark:bg-[#161920] border border-[#e6e8eb] dark:border-[#262a34] rounded-[18px] sm:rounded-[20px] [@media(min-height:850px)]:rounded-[24px] p-3 sm:p-4 [@media(min-height:850px)]:p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-colors duration-200 select-none xl:overflow-hidden min-h-0">
      {/* Header */}
      <div className="shrink-0 mb-1 sm:mb-1.5 [@media(min-height:850px)]:mb-2.5">
        <h2 className="font-inter text-[14.5px] sm:text-[16px] [@media(min-height:850px)]:text-[18.5px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
          Distribusi Status Gizi Balita
        </h2>
        <p className="font-inter text-[11px] sm:text-[12px] [@media(min-height:850px)]:text-[13px] text-zinc-400 dark:text-zinc-500 mt-0.5">
          Jumlah anak per kategori status gizi
        </p>
      </div>

      {/* Main Bar Chart Container */}
      <div
        onMouseMove={handleMouseMove}
        className="w-full h-[185px] sm:h-[210px] xl:h-auto xl:flex-1 min-h-0 bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-zinc-800 rounded-[14px] [@media(min-height:850px)]:rounded-[16px] p-2 sm:p-2.5 [@media(min-height:850px)]:p-3.5 relative overflow-hidden flex flex-col justify-between"
      >
        {/* Dynamic Interactive Hover Tooltip Popup */}
        {hoveredBar && (
          <div
            style={{
              left: `${tooltipLeft}px`,
              top: `${tooltipTop}px`,
            }}
            className="pointer-events-none absolute z-30 bg-white dark:bg-[#1e222d] border border-gray-100 dark:border-zinc-700 shadow-xl rounded-xl px-3 py-1.5 transition-all duration-75 ease-out font-inter select-none"
          >
            <div className="font-bold text-zinc-900 dark:text-zinc-100 text-[12px] leading-tight text-center">
              {hoveredBar.category}
            </div>
            <div className="font-bold text-[#00c076] dark:text-emerald-400 text-[13px] leading-tight text-center mt-0.5">
              {hoveredBar.count} Anak
            </div>
          </div>
        )}

        {/* Graphics Area (Y-Axis + Bars + Dashed Grid) */}
        <div className="flex-1 min-h-0 w-full flex items-stretch relative">
          {/* Left Y-Axis Ticks (Dynamic Real-Time Scale) */}
          <div className="w-7 sm:w-8 shrink-0 flex flex-col justify-between text-right pr-2 pb-1 font-inter text-[10px] sm:text-[11px] font-medium text-zinc-400 dark:text-zinc-500 select-none">
            {yTicks.map((val, i) => (
              <span key={i} className="leading-none">
                {val}
              </span>
            ))}
          </div>

          {/* Chart Plot Area */}
          <div className="flex-1 min-h-0 flex flex-col justify-between relative border-l border-b border-gray-200 dark:border-zinc-700">
            {/* Dashed Grid Lines (Aligned with Y-Ticks) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-b border-dashed border-gray-200 dark:border-zinc-800" />
              <div className="w-full border-b border-dashed border-gray-200 dark:border-zinc-800" />
              <div className="w-full border-b border-dashed border-gray-200 dark:border-zinc-800" />
              <div className="w-full border-b border-dashed border-gray-200 dark:border-zinc-800" />
              <div className="w-full border-b border-transparent" />
            </div>

            {/* Bars */}
            <div className="flex-1 min-h-0 flex items-end justify-around px-1 sm:px-2 z-10">
              {chartData.map((bar) => (
                <div
                  key={bar.id}
                  onMouseEnter={() => setHoveredBar(bar)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="h-full flex flex-col justify-end items-center flex-1 cursor-pointer px-1 sm:px-2"
                >
                  <div
                    style={{
                      height: `${Math.max(bar.heightPercent, 2)}%`,
                      backgroundColor: bar.color,
                    }}
                    className="w-full max-w-[42px] sm:max-w-[54px] [@media(min-height:850px)]:max-w-[62px] rounded-t-[6px] sm:rounded-t-[8px] transition-all duration-300 transform origin-bottom shadow-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* X-Axis Labels Below Bars */}
        <div className="flex items-center pl-7 sm:pl-8 mt-1.5 font-inter text-[10.5px] sm:text-[12px] font-bold text-zinc-900 dark:text-zinc-200">
          {chartData.map((bar) => (
            <div key={bar.id} className="flex-1 text-center truncate px-0.5">
              {bar.category}
            </div>
          ))}
        </div>
      </div>

      {/* Legend Cards Grid Below Chart (Horizontal Lega, Vertikal Lebih Dempet) */}
      <div className="grid grid-cols-2 gap-x-4 sm:gap-x-5 [@media(min-height:850px)]:gap-x-6 gap-y-1.5 sm:gap-y-2 [@media(min-height:850px)]:gap-y-2.5 mt-2.5 sm:mt-3 [@media(min-height:850px)]:mt-3.5 shrink-0">
        {chartData.map((item) => (
          <div
            key={item.id}
            className="bg-[#fafafa] dark:bg-[#1e222d] border border-[#eaecf0] dark:border-zinc-800 rounded-[14px] sm:rounded-[16px] py-2.5 px-3.5 sm:px-4 [@media(min-height:850px)]:py-3 [@media(min-height:850px)]:px-4.5 flex items-center gap-3 sm:gap-3.5 transition-colors"
          >
            {/* Color Indicator Dot */}
            <div
              style={{ backgroundColor: item.color }}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shrink-0 shadow-xs"
            />
            {/* Name & Count */}
            <div className="min-w-0 flex-1">
              <span className="font-inter text-[12px] sm:text-[13px] [@media(min-height:850px)]:text-[14px] font-bold text-zinc-900 dark:text-zinc-100 block truncate leading-tight">
                {item.category}
              </span>
              <span className="font-inter text-[11px] sm:text-[12px] [@media(min-height:850px)]:text-[12.5px] font-normal text-[#0d472c] dark:text-emerald-400 block truncate leading-tight mt-0.5">
                {item.count} Anak
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NutritionChart;
