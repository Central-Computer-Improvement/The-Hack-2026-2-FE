"use client";

import React from "react";
import { Skeleton } from "./SkeletonBase";

export const SkeletonAlertCard: React.FC = () => {
  return (
    <section className="w-full h-full flex-1 bg-white dark:bg-[#161920] border border-[#e6e8eb] dark:border-[#262a34] rounded-[20px] [@media(min-height:850px)]:rounded-[24px] p-3.5 sm:p-5 [@media(min-height:850px)]:p-7 flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-colors duration-200 select-none xl:overflow-hidden">
      {/* Card Header */}
      <div className="shrink-0 mb-2 [@media(min-height:850px)]:mb-4">
        <h2 className="font-inter text-[16px] sm:text-[18px] [@media(min-height:850px)]:text-[19px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
          Peringatan Dini Gizi &amp; Stunting
        </h2>
        <p className="font-inter text-[12px] sm:text-[13px] [@media(min-height:850px)]:text-[13.5px] text-zinc-400 dark:text-zinc-500 mt-0.5 sm:mt-1">
          Balita yang memerlukan tindakan intervensi
        </p>
      </div>

      {/* List Skeletons */}
      <div className="max-h-[290px] sm:max-h-[340px] xl:max-h-none xl:flex-1 min-h-0 overflow-y-auto mt-1 sm:mt-2 space-y-2 sm:space-y-3 pr-1.5 scrollbar-thin">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="w-full bg-white dark:bg-[#1e222d] border border-[#e6e8eb] dark:border-[#2b313e] rounded-[14px] [@media(min-height:850px)]:rounded-[16px] p-2.5 sm:py-3 sm:px-4 flex items-center justify-between gap-2.5 sm:gap-3"
          >
            {/* Left: Avatar Initial & Info Placeholder */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <Skeleton className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-full shrink-0" />

              <div className="flex flex-col min-w-0 flex-1 space-y-1 sm:space-y-1.5">
                {/* Status Badge Placeholder */}
                <Skeleton className="h-4 w-16 sm:w-20 rounded-[6px]" />

                {/* Name Placeholder */}
                <Skeleton className="h-4 sm:h-4.5 w-28 sm:w-36 rounded-[4px]" />

                {/* Meta details Placeholder */}
                <Skeleton className="h-3 w-20 sm:w-24 rounded-[3px]" />
              </div>
            </div>

            {/* Action button placeholder */}
            <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkeletonAlertCard;
