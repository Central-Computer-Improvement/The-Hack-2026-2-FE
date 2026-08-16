"use client";

import React from "react";
import { Skeleton } from "./SkeletonBase";

export const SkeletonStatCard: React.FC = () => {
  return (
    <section className="w-full shrink-0 bg-white dark:bg-[#161920] border border-[#e6e8eb] dark:border-[#262a34] rounded-[18px] sm:rounded-[20px] [@media(min-height:850px)]:rounded-[24px] p-3 sm:p-3.5 [@media(min-height:850px)]:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-colors duration-200 select-none">
      {/* Header Title */}
      <div className="mb-2 sm:mb-2.5 [@media(min-height:850px)]:mb-3">
        <h2 className="font-inter text-[14px] sm:text-[15px] [@media(min-height:850px)]:text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
          Ringkasan indikator kesehatan
        </h2>
      </div>

      {/* Grid 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 [@media(min-height:850px)]:gap-3.5">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="bg-[#fafafa] dark:bg-[#1e222d] border border-[#eaecf0] dark:border-zinc-800 rounded-[12px] sm:rounded-[14px] [@media(min-height:850px)]:rounded-[16px] p-2.5 sm:p-3 [@media(min-height:850px)]:p-3.5 flex flex-col justify-between"
          >
            {/* Icon Badge Placeholder */}
            <Skeleton className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] [@media(min-height:850px)]:w-[38px] [@media(min-height:850px)]:h-[38px] rounded-full" />

            {/* Title & Value Placeholders */}
            <div className="mt-2 sm:mt-2.5 [@media(min-height:850px)]:mt-3 space-y-1.5 sm:space-y-2">
              <Skeleton className="h-[12px] sm:h-[13px] [@media(min-height:850px)]:h-[14px] w-20 sm:w-24 rounded-[4px]" />
              <Skeleton className="h-[16px] sm:h-[19px] [@media(min-height:850px)]:h-[21px] w-24 sm:w-28 rounded-[4px]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkeletonStatCard;
