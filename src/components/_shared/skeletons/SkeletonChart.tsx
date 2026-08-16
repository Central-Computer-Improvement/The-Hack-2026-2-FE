"use client";

import React from "react";
import { Skeleton } from "./SkeletonBase";

export const SkeletonChart: React.FC = () => {
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

      {/* Main Bar Chart Placeholder */}
      <div className="w-full h-[185px] sm:h-[210px] xl:h-auto xl:flex-1 min-h-0 bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-zinc-800 rounded-[14px] [@media(min-height:850px)]:rounded-[16px] p-2 sm:p-2.5 [@media(min-height:850px)]:p-3.5 relative overflow-hidden flex flex-col justify-between">
        {/* Graphics Area */}
        <div className="flex-1 min-h-0 w-full flex items-stretch relative">
          {/* Y-Axis Ticks Skeleton */}
          <div className="w-7 sm:w-8 shrink-0 flex flex-col justify-between text-right pr-2 pb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-2.5 w-4 ml-auto rounded-[2px]" />
            ))}
          </div>

          {/* Chart Plot Area with Grid and 4 Bars */}
          <div className="flex-1 min-h-0 flex flex-col justify-between relative border-l border-b border-gray-200 dark:border-zinc-700">
            {/* Dashed Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-b border-dashed border-gray-200 dark:border-zinc-800" />
              <div className="w-full border-b border-dashed border-gray-200 dark:border-zinc-800" />
              <div className="w-full border-b border-dashed border-gray-200 dark:border-zinc-800" />
              <div className="w-full border-b border-dashed border-gray-200 dark:border-zinc-800" />
              <div className="w-full border-b border-transparent" />
            </div>

            {/* Bars Placeholder */}
            <div className="flex-1 min-h-0 flex items-end justify-around px-1 sm:px-2 z-10">
              <div className="h-full flex flex-col justify-end items-center flex-1 px-1 sm:px-2">
                <Skeleton className="w-full max-w-[42px] sm:max-w-[54px] [@media(min-height:850px)]:max-w-[62px] h-[65%] rounded-t-[6px] sm:rounded-t-[8px]" />
              </div>
              <div className="h-full flex flex-col justify-end items-center flex-1 px-1 sm:px-2">
                <Skeleton className="w-full max-w-[42px] sm:max-w-[54px] [@media(min-height:850px)]:max-w-[62px] h-[30%] rounded-t-[6px] sm:rounded-t-[8px]" />
              </div>
              <div className="h-full flex flex-col justify-end items-center flex-1 px-1 sm:px-2">
                <Skeleton className="w-full max-w-[42px] sm:max-w-[54px] [@media(min-height:850px)]:max-w-[62px] h-[20%] rounded-t-[6px] sm:rounded-t-[8px]" />
              </div>
              <div className="h-full flex flex-col justify-end items-center flex-1 px-1 sm:px-2">
                <Skeleton className="w-full max-w-[42px] sm:max-w-[54px] [@media(min-height:850px)]:max-w-[62px] h-[45%] rounded-t-[6px] sm:rounded-t-[8px]" />
              </div>
            </div>
          </div>
        </div>

        {/* X-Axis Labels Placeholder */}
        <div className="flex items-center pl-7 sm:pl-8 mt-1.5">
          {["Normal", "Gizi Kurang", "Gizi Buruk", "Stunting"].map((label, idx) => (
            <div key={idx} className="flex-1 flex justify-center px-0.5">
              <Skeleton className="h-3 w-12 sm:w-16 rounded-[2px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Legend Cards Grid Below Chart */}
      <div className="grid grid-cols-2 gap-x-4 sm:gap-x-5 [@media(min-height:850px)]:gap-x-6 gap-y-1.5 sm:gap-y-2 [@media(min-height:850px)]:gap-y-2.5 mt-2.5 sm:mt-3 [@media(min-height:850px)]:mt-3.5 shrink-0">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="bg-[#fafafa] dark:bg-[#1e222d] border border-[#eaecf0] dark:border-zinc-800 rounded-[14px] sm:rounded-[16px] py-2.5 px-3.5 sm:px-4 [@media(min-height:850px)]:py-3 [@media(min-height:850px)]:px-4.5 flex items-center gap-3 sm:gap-3.5"
          >
            <Skeleton className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full shrink-0" />
            <div className="min-w-0 flex-1 space-y-1">
              <Skeleton className="h-3 sm:h-3.5 w-16 sm:w-20 rounded-[2px]" />
              <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-14 rounded-[2px]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkeletonChart;
