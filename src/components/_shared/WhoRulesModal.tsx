"use client";

import React, { useEffect } from "react";
import { Sparkles } from "lucide-react";

interface WhoRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhoRulesModal({ isOpen, onClose }: WhoRulesModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-inter select-none"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#161920] rounded-2xl max-w-[540px] w-full p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <h3 className="text-[17px] font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Rumus &amp; Aturan WHO
        </h3>

        {/* Formulas Box */}
        <div className="p-4 rounded-xl bg-[#eef8f2] dark:bg-emerald-950/20 mb-5">
          <h4 className="font-bold text-[#0d472c] dark:text-emerald-400 text-[13px] mb-2">
            Rumus Matematika Z-Score WHO
          </h4>
          <ul className="text-[13px] text-[#125c3a] dark:text-emerald-300 font-medium space-y-1 ml-1">
            <li>• Median TB = 75 + (UsiaBulan &times; 0.75) cm</li>
            <li>• Z-Score TB/U (Stunting) = (TB - Median TB) / 3.5 SD</li>
            <li>• Median BB = 3.5 + (UsiaBulan &times; 0.35) kg</li>
            <li>• Z-Score BB/U (Gizi) = (BB - Median BB) / 1.5 SD</li>
            <li>• Z-Score BB/TB (Wasting) = Z-Score BB/U - Z-Score TB/U</li>
          </ul>
        </div>

        {/* Matrix Table */}
        <h3 className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          Matriks Penilaian Status Gizi WHO &amp; Risk Level
        </h3>
        
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-center text-[12px]">
            <thead className="border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="py-2 px-1 text-zinc-900 dark:text-zinc-100 font-bold">Range Z-Score</th>
                <th className="py-2 px-1 text-zinc-900 dark:text-zinc-100 font-bold">Status Gizi</th>
                <th className="py-2 px-1 text-zinc-900 dark:text-zinc-100 font-bold">Level Risiko</th>
                <th className="py-2 px-1 text-zinc-900 dark:text-zinc-100 font-bold text-left">Tindakan Medis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              <tr>
                <td className="py-3 px-1 text-zinc-600 dark:text-zinc-400">&lt; -3.0 SD</td>
                <td className="py-3 px-1 text-zinc-600 dark:text-zinc-400">Stunting Berat / Gizi Buruk</td>
                <td className="py-3 px-1">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-medium text-[11px]">Kritis</span>
                </td>
                <td className="py-3 px-1 text-left text-zinc-600 dark:text-zinc-400 text-[11px]">Rujukan darurat Puskesmas, evaluasi TBC/cacingan, &amp; PMT 2 telur/hari.</td>
              </tr>
              <tr>
                <td className="py-3 px-1 text-zinc-600 dark:text-zinc-400">-3.0 s/d -2.0 SD</td>
                <td className="py-3 px-1 text-zinc-600 dark:text-zinc-400">Stunting Sedang / Gizi Kurang</td>
                <td className="py-3 px-1">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-medium text-[11px]">Sedang</span>
                </td>
                <td className="py-3 px-1 text-left text-zinc-600 dark:text-zinc-400 text-[11px]">Konseling nutrisi keluarga, PMT pangan lokal protein hewani.</td>
              </tr>
              <tr>
                <td className="py-3 px-1 text-zinc-600 dark:text-zinc-400">-2.0 s/d +2.0 SD</td>
                <td className="py-3 px-1 text-zinc-600 dark:text-zinc-400">Normal</td>
                <td className="py-3 px-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium text-[11px]">Normal</span>
                </td>
                <td className="py-3 px-1 text-left text-zinc-600 dark:text-zinc-400 text-[11px]">Pertahankan asupan gizi seimbang dan penimbangan rutin bulanan.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* AI Box */}
        <div className="p-4 rounded-xl bg-[#fdfafb] dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-[13px] mb-6">
          <div className="flex items-center gap-2 font-bold text-[#8b5cf6] dark:text-purple-400 mb-1.5">
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Analisis Kritis AI:
          </div>
          <p className="font-medium text-[#7c3aed] dark:text-purple-300 leading-relaxed">
            Setiap data balita yang diukur akan diproses oleh Google Gemini 1.5 Flash AI untuk mengevaluasi dampak kognitif jangka panjang dan menghasilkan rekomendasi medis klinis yang disesuaikan secara individual.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-[#0d472c] hover:bg-[#0a3923] active:bg-[#072a1a] text-white font-inter text-[14px] font-medium rounded-[8px] transition-colors cursor-pointer"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}

export default WhoRulesModal;
