"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { dataAnak } from "@/lib/data-anak";

interface NutritionChartProps {
  onNavigateToRekap?: () => void;
}

interface BarData {
  id: string;
  category: string;
  count: number;
  percentage: string;
  heightPercent: number;
  color: string;
}

export const NutritionChart: React.FC<NutritionChartProps> = ({ onNavigateToRekap }) => {
  const router = useRouter();
  const [hoveredBar, setHoveredBar] = useState<BarData | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState<number>(500);

  const totalAnak = dataAnak.length;
  
  const categories = [
    { id: "1", category: "Normal", color: "#00c076" },
    { id: "2", category: "Gizi Kurang", color: "#f59e0b" },
    { id: "3", category: "Gizi Buruk", color: "#4672b8" },
    { id: "4", category: "Stunting", color: "#223d66" },
    { id: "5", category: "Obesitas", color: "#59c3e2" },
  ];

  const counts = categories.map(cat => dataAnak.filter(a => a.statusGizi === cat.category).length);

  const chartData: BarData[] = categories.map((cat, idx) => {
    const count = counts[idx];
    const percentageVal = totalAnak > 0 ? (count / totalAnak) * 100 : 0;
    const percentage = percentageVal.toFixed(1);
    
    let heightPercent = percentageVal;
    if (count > 0 && heightPercent < 2) {
      heightPercent = 2;
    }
    
    return {
      ...cat,
      count,
      percentage: `${percentage}%`,
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

  const handleLihatSelengkapnya = () => {
    if (onNavigateToRekap) {
      onNavigateToRekap();
    } else {
      router.push("/rekap-data-gizi");
    }
  };

  const tooltipLeft = Math.max(10, Math.min(mousePos.x - 65, containerWidth - 145));
  const tooltipTop = Math.max(10, mousePos.y - 60);

  return (
    <section className="w-full h-full flex-1 bg-white dark:bg-[#161920] border border-[#e6e8eb] dark:border-[#262a34] rounded-[20px] [@media(min-height:850px)]:rounded-[24px] p-3.5 sm:p-5 [@media(min-height:850px)]:p-7 flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-colors duration-200 select-none xl:overflow-hidden">
      {/* Header */}
      <div className="shrink-0 mb-2 [@media(min-height:850px)]:mb-4">
        <h2 className="font-inter text-[16px] sm:text-[18px] [@media(min-height:850px)]:text-[19px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
          Distribusi Status Gizi Balita
        </h2>
        <p className="font-inter text-[12px] sm:text-[13px] [@media(min-height:850px)]:text-[13.5px] text-zinc-400 dark:text-zinc-500 mt-0.5 sm:mt-1">
          Jumlah anak per kategori z-score WHO
        </p>
      </div>

      {/* Interactive Chart Container */}
      <div
        onMouseMove={handleMouseMove}
        className="w-full h-[220px] sm:h-[240px] xl:h-auto xl:flex-1 min-h-0 bg-[#f8f9fa] dark:bg-[#1e222d] border border-gray-200/70 dark:border-zinc-800 rounded-[14px] [@media(min-height:850px)]:rounded-[18px] p-2.5 sm:p-3 [@media(min-height:850px)]:p-4 relative overflow-hidden flex flex-col"
      >
        {/* Dynamic Mouse-Following Tooltip Popup */}
        {hoveredBar && (
          <div
            style={{
              left: `${tooltipLeft}px`,
              top: `${tooltipTop}px`,
            }}
            className="pointer-events-none absolute z-30 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-xl rounded-2xl px-3.5 py-2 transition-all duration-75 ease-out font-inter select-none"
          >
            <div className="font-bold text-zinc-900 dark:text-zinc-100 text-[12.5px] leading-tight text-center">
              {hoveredBar.category}
            </div>
            <div className="font-bold text-[#00c076] dark:text-emerald-400 text-[13.5px] leading-tight text-center">
              {hoveredBar.count} Anak
            </div>
          </div>
        )}

        {/* Bar Chart Graphics */}
        <div className="flex-1 min-h-0 w-full flex items-end justify-between px-1 sm:px-2 pt-2.5 sm:pt-3 pb-1 border-b border-gray-200 dark:border-zinc-700/80 relative">
          {/* Grid background dashed lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 px-2 py-3">
            <div className="w-full border-b border-dashed border-gray-300 dark:border-zinc-700" />
            <div className="w-full border-b border-dashed border-gray-300 dark:border-zinc-700" />
            <div className="w-full border-b border-dashed border-gray-300 dark:border-zinc-700" />
            <div className="w-full border-b border-dashed border-gray-300 dark:border-zinc-700" />
          </div>

          {/* Render Bars */}
          {chartData.map((bar) => (
            <div
              key={bar.id}
              onMouseEnter={() => setHoveredBar(bar)}
              onMouseLeave={() => setHoveredBar(null)}
              className="h-full flex flex-col justify-end items-center flex-1 group cursor-pointer z-10 px-1"
            >
              <div
                style={{
                  height: `${bar.heightPercent}%`,
                  backgroundColor: bar.color,
                }}
                className="w-full max-w-[40px] sm:max-w-[52px] rounded-t-sm transition-all duration-300 group-hover:brightness-110 group-hover:scale-y-[1.02] transform origin-bottom shadow-xs"
              />
            </div>
          ))}
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between items-center px-1 sm:px-2 mt-1.5 font-inter text-[10.5px] sm:text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
          {chartData.map((bar) => (
            <div key={bar.id} className="flex-1 text-center truncate px-0.5">
              {bar.category}
            </div>
          ))}
        </div>
      </div>

      {/* Button to navigate */}
      <div className="mt-2.5 sm:mt-3 [@media(min-height:850px)]:mt-4 shrink-0">
        <button
          type="button"
          onClick={handleLihatSelengkapnya}
          className="w-full py-2 sm:py-2.5 [@media(min-height:850px)]:py-3 bg-[#0d472c] hover:bg-[#0a3923] text-white font-inter text-[13px] sm:text-[13.5px] [@media(min-height:850px)]:text-[14px] font-semibold rounded-xl transition-colors cursor-pointer text-center shadow-xs"
        >
          Lihat selengkapnya
        </button>
      </div>
    </section>
  );
};

export default NutritionChart;
