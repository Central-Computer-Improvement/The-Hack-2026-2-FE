"use client";

import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", ...props }) => {
  return (
    <div
      className={`animate-pulse bg-zinc-200/80 dark:bg-[#1E2530] rounded-md ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
