"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";
import { Check, X, Trash2, AlertCircle } from "lucide-react";

interface ToastOptions {
  description?: string;
  duration?: number;
}

export const showToast = {
  success: (title: string, options?: ToastOptions) => {
    sonnerToast.custom(
      (t) => (
        <div className="w-[305px] max-w-[calc(100vw-32px)] bg-[#F1F2F4] text-zinc-900 border border-[#DDE0E5] rounded-[14px] p-2.5 px-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2.5 relative font-inter select-none">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Left Badge */}
            <div className="w-[28px] h-[28px] rounded-[7px] bg-white border border-[#D5D8DF] text-zinc-800 flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <Check className="w-4 h-4 stroke-[2.2]" />
            </div>

            {/* Text Content */}
            <div className="min-w-0 flex-1 pr-1">
              <h4 className="text-[12.5px] font-semibold text-zinc-900 leading-snug break-words">
                {title}
              </h4>
            </div>
          </div>

          {/* Right Close 'x' Button */}
          <button
            type="button"
            onClick={() => sonnerToast.dismiss(t)}
            className="w-6 h-6 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-black/5 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>
      ),
      { duration: options?.duration || 2000 }
    );
  },

  error: (title: string, options?: ToastOptions) => {
    sonnerToast.custom(
      (t) => (
        <div className="w-[305px] max-w-[calc(100vw-32px)] bg-[#F1F2F4] text-zinc-900 border border-[#DDE0E5] rounded-[14px] p-2.5 px-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2.5 relative font-inter select-none">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Left Badge */}
            <div className="w-[28px] h-[28px] rounded-[7px] bg-white border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <AlertCircle className="w-4 h-4 stroke-[2.2]" />
            </div>

            {/* Text Content */}
            <div className="min-w-0 flex-1 pr-1">
              <h4 className="text-[12.5px] font-semibold text-zinc-900 leading-snug break-words">
                {title}
              </h4>
            </div>
          </div>

          {/* Right Close 'x' Button */}
          <button
            type="button"
            onClick={() => sonnerToast.dismiss(t)}
            className="w-6 h-6 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-black/5 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>
      ),
      { duration: options?.duration || 2500 }
    );
  },

  delete: (title: string, options?: ToastOptions) => {
    sonnerToast.custom(
      (t) => (
        <div className="w-[305px] max-w-[calc(100vw-32px)] bg-[#F1F2F4] text-zinc-900 border border-[#DDE0E5] rounded-[14px] p-2.5 px-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2.5 relative font-inter select-none">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Left Badge */}
            <div className="w-[28px] h-[28px] rounded-[7px] bg-white border border-[#D5D8DF] text-zinc-800 flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
            </div>

            {/* Text Content */}
            <div className="min-w-0 flex-1 pr-1">
              <h4 className="text-[12.5px] font-semibold text-zinc-900 leading-snug break-words">
                {title}
              </h4>
            </div>
          </div>

          {/* Right Close 'x' Button */}
          <button
            type="button"
            onClick={() => sonnerToast.dismiss(t)}
            className="w-6 h-6 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-black/5 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>
      ),
      { duration: options?.duration || 2000 }
    );
  },
};



