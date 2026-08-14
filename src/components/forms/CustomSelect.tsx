"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  triggerClassName?: string;
  containerClassName?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Pilih",
  triggerClassName,
  containerClassName = "inline-flex",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultTriggerClass = `w-full px-4 py-3 bg-[#f5f6f8] dark:bg-[#1e222d] rounded-xl text-[13.5px] flex items-center justify-between transition-all duration-200 cursor-pointer border ${
    isOpen
      ? "border-[#0d472c] ring-1 ring-[#0d472c] bg-white dark:bg-[#161920]"
      : "border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
  }`;

  return (
    <div ref={containerRef} className={`relative font-inter select-none ${containerClassName}`}>
      {/* Trigger Input Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClassName || defaultTriggerClass}
      >
        <span className={selectedOption ? "text-zinc-900 dark:text-zinc-100 font-medium whitespace-nowrap" : "text-zinc-400 dark:text-zinc-500 whitespace-nowrap"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300 transition-transform duration-200 ml-1.5 shrink-0 stroke-[2] ${
            isOpen ? "rotate-180 text-[#0d472c] dark:text-emerald-400" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 z-50 bg-white dark:bg-[#161920] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150 min-w-[170px] max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2 rounded-lg text-[12.5px] font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#eef3ed] dark:bg-[#1b2720] text-[#0d472c] dark:text-emerald-300 font-semibold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#0d472c] dark:text-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
