"use client";

import React from "react";
import { Skeleton } from "./SkeletonBase";

export interface SkeletonTableRowProps {
  isRiwayat?: boolean;
}

export const SkeletonTableRow: React.FC<SkeletonTableRowProps> = ({
  isRiwayat = false,
}) => {
  if (isRiwayat) {
    return (
      <tr className="h-[54px]">
        <td className="py-3 px-4">
          <Skeleton className="h-4 w-32 rounded-[4px]" />
          <Skeleton className="h-3 w-20 rounded-[3px] mt-1" />
        </td>
        <td className="py-3 px-4">
          <Skeleton className="h-3.5 w-24 rounded-[4px]" />
        </td>
        <td className="py-3 px-4">
          <Skeleton className="h-3.5 w-28 rounded-[4px]" />
        </td>
        <td className="py-3 px-4">
          <Skeleton className="h-6 w-20 rounded-[6px]" />
        </td>
        <td className="py-3 px-4">
          <Skeleton className="h-3.5 w-16 rounded-[4px]" />
        </td>
        <td className="py-3 px-4 text-center">
          <Skeleton className="h-4 w-28 rounded-[4px] mx-auto" />
        </td>
      </tr>
    );
  }

  return (
    <tr className="h-[54px]">
      <td className="py-3 px-4">
        <Skeleton className="h-4 w-32 rounded-[4px]" />
        <Skeleton className="h-3 w-20 rounded-[3px] mt-1" />
      </td>
      <td className="py-3 px-4">
        <Skeleton className="h-3.5 w-24 rounded-[4px]" />
      </td>
      <td className="py-3 px-4">
        <Skeleton className="h-3.5 w-28 rounded-[4px]" />
      </td>
      <td className="py-3 px-4">
        <Skeleton className="h-6 w-20 rounded-[6px]" />
      </td>
      <td className="py-3 px-4">
        <Skeleton className="h-3.5 w-16 rounded-[4px]" />
      </td>
      <td className="py-3 px-4 text-center">
        <Skeleton className="h-7 w-16 rounded-full mx-auto" />
      </td>
      <td className="py-3 px-4 text-center">
        <Skeleton className="h-7 w-7 rounded-full mx-auto" />
      </td>
    </tr>
  );
};

export interface SkeletonTableBodyProps {
  isRiwayat?: boolean;
}

export const SkeletonTableBody: React.FC<SkeletonTableBodyProps> = ({
  isRiwayat = false,
}) => {
  return (
    <>
      {/* Laptop Tbody (< 850px): 3 baris */}
      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60 hidden [@media(max-height:849px)]:table-row-group">
        {[1, 2, 3].map((i) => (
          <SkeletonTableRow key={i} isRiwayat={isRiwayat} />
        ))}
      </tbody>

      {/* Monitor Tbody (>= 850px): 8 baris */}
      <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60 hidden [@media(min-height:850px)]:table-row-group">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <SkeletonTableRow key={i} isRiwayat={isRiwayat} />
        ))}
      </tbody>
    </>
  );
};

export const SkeletonTableFooter: React.FC = () => {
  return (
    <>
      {/* Laptop Footer */}
      <div className="h-[58px] shrink-0 px-3.5 bg-[#f8f9fa] dark:bg-[#1e222d] border-t border-gray-200/80 dark:border-zinc-800 hidden [@media(max-height:849px)]:flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-36 rounded-[4px]" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      {/* Monitor Footer */}
      <div className="h-[58px] shrink-0 px-3.5 bg-[#f8f9fa] dark:bg-[#1e222d] border-t border-gray-200/80 dark:border-zinc-800 hidden [@media(min-height:850px)]:flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-36 rounded-[4px]" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </>
  );
};

export default SkeletonTableRow;
