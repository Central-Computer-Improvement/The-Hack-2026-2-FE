"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

interface CustomDatePickerProps {
  value: string; // ISO format YYYY-MM-DD
  onChange: (dateStr: string) => void;
  placeholder?: string;
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Cari berdasarkan tanggal",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Current displayed month & year in popover
  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState<Date>(
    isNaN(initialDate.getTime()) ? new Date() : initialDate
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Days in month calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleSelectDay = (day: number) => {
    const selected = new Date(year, month, day);
    const yyyy = selected.getFullYear();
    const mm = String(selected.getMonth() + 1).padStart(2, "0");
    const dd = String(selected.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const d = new Date(value);
    return (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day
    );
  };

  return (
    <div ref={containerRef} className="relative font-inter select-none inline-block">
      {/* Trigger Pill Button (Height 42px to match Rekap, Centered Content) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-[42px] px-4 rounded-xl text-[13px] font-medium inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border ${
          value
            ? "bg-[#dcfce7] dark:bg-emerald-950/50 border-[#166534] dark:border-emerald-600 text-[#166534] dark:text-emerald-300"
            : "bg-white dark:bg-[#161920] border-gray-200 dark:border-zinc-700 hover:border-gray-300 text-zinc-400 dark:text-zinc-500"
        }`}
      >
        <CalendarIcon
          className={`w-4 h-4 stroke-[1.8] shrink-0 ${
            value
              ? "text-[#166534] dark:text-emerald-300"
              : "text-[#0d472c] dark:text-emerald-400"
          }`}
        />

        <span className="leading-none">{value ? value : placeholder}</span>

        {value && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="w-5 h-5 ml-1 inline-flex items-center justify-center rounded-full hover:bg-emerald-200/70 dark:hover:bg-emerald-800/40 text-[#166534] dark:text-emerald-300 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </span>
        )}
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-white dark:bg-[#161920] border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-4 w-[280px] animate-in fade-in zoom-in-95 duration-150">
          {/* Calendar Header Navigation */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-bold text-[13.5px] text-zinc-900 dark:text-zinc-100">
              {MONTHS[month]} {year}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS.map((d) => (
              <span
                key={d}
                className="text-[10.5px] font-bold text-zinc-400 dark:text-zinc-500"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Blank leading days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const active = isSelected(dayNum);

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`w-8 h-8 rounded-lg text-[12px] font-medium flex items-center justify-center transition-colors cursor-pointer ${
                    active
                      ? "bg-[#0d472c] text-white font-bold shadow-xs"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-[#eef3ed] hover:text-[#0d472c] dark:hover:bg-zinc-800"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
