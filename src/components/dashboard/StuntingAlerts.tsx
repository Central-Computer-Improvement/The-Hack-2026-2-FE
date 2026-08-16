"use client";

import React, { useState } from "react";
import { ChevronRight, X, Sparkles } from "lucide-react";
import { useDataAnak } from "@/lib/data-anak-store";
import { useHasMounted } from "@/hooks/useHasMounted";
import { SkeletonAlertCard } from "@/components/_shared/skeletons";

interface ChildAlert {
  id: string;
  initial: string;
  name: string;
  age: string;
  gender: string;
  status: string;
  zScore: string;
  height: string;
  weight: string;
  lastCheck: string;
  rekomendasiAI: string;
}

const formatIndonesianDate = (dateString: string) => {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const [yyyy, mm, dd] = dateString.split("-");
  return `${parseInt(dd, 10)} ${months[parseInt(mm, 10) - 1]} ${yyyy}`;
};

export const StuntingAlerts: React.FC = () => {
  const hasMounted = useHasMounted();
  const currentData = useDataAnak();
  const [selectedChild, setSelectedChild] = useState<ChildAlert | null>(null);

  if (!hasMounted) {
    return <SkeletonAlertCard />;
  }

  const alertList: ChildAlert[] = currentData
    .filter((anak) => ["Stunting", "Gizi Kurang", "Gizi Buruk"].includes(anak.statusGizi))
    .map((anak) => ({
      id: anak.id,
      initial: anak.nama.charAt(0).toUpperCase(),
      name: anak.nama,
      age: `${anak.usiaBulan} Bulan`,
      gender: anak.jenisKelamin === "L" ? "Laki - Laki" : "Perempuan",
      status: anak.statusGizi,
      zScore: anak.zScoreTBU.includes("SD") ? anak.zScoreTBU : `${anak.zScoreTBU} SD`,
      height: `${anak.tinggiBadan} cm`,
      weight: `${anak.beratBadan} kg`,
      lastCheck: formatIndonesianDate(anak.tanggalPeriksa),
      rekomendasiAI: anak.rekomendasiAI,
    }));

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

      {/* Scrollable list */}
      <div className="max-h-[290px] sm:max-h-[340px] xl:max-h-none xl:flex-1 min-h-0 overflow-y-auto mt-1 sm:mt-2 space-y-2 sm:space-y-3 pr-1.5 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
        {alertList.map((item) => (
          <div
            key={item.id}
            className="w-full bg-white dark:bg-[#1e222d] border border-[#e6e8eb] dark:border-[#2b313e] rounded-[14px] [@media(min-height:850px)]:rounded-[16px] p-2.5 sm:py-3 sm:px-4 flex items-center justify-between gap-2.5 sm:gap-3 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            {/* Left: Avatar Initial & Info */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-full bg-[#eef3ed] dark:bg-[#1b2720] border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center font-inter text-[14px] sm:text-[16px] font-bold text-[#0d472c] dark:text-emerald-300 shrink-0">
                {item.initial}
              </div>

              <div className="flex flex-col text-left min-w-0">
                {/* Status Badge */}
                <div className="mb-0.5">
                  {item.status === "Stunting" ? (
                    <span className="font-inter text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[#fde8e8] text-[#a81a1a] dark:bg-[#3b1212] dark:text-[#f87171] inline-block">
                      Stunting
                    </span>
                  ) : item.status === "Gizi Buruk" ? (
                    <span className="font-inter text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[#fff0eb] text-[#c2410c] dark:bg-[#3a1d17] dark:text-[#FFA382] inline-block">
                      Gizi Buruk
                    </span>
                  ) : (
                    <span className="font-inter text-[11px] font-medium px-2 py-0.5 rounded-[6px] bg-[#fef6dc] text-[#b45309] dark:bg-[#332b00] dark:text-[#fde047] inline-block">
                      Gizi Kurang
                    </span>
                  )}
                </div>

                {/* Name */}
                <span className="font-inter text-[13px] sm:text-[14.5px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {item.name}
                </span>

                {/* Meta details */}
                <span className="font-inter text-[11px] sm:text-[12px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                  {item.age} · {item.gender}
                </span>
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={() => setSelectedChild(item)}
              className="p-1.5 sm:p-2 rounded-xl text-[#0d472c] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors shrink-0 cursor-pointer"
              title="Lihat Detail Anak"
              aria-label="Lihat Detail Anak"
            >
              <ChevronRight className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        ))}
      </div>

      {/* Detail Anak Modal (Aligned Design) */}
      {selectedChild && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedChild(null)}
        >
          <div
            className="bg-white dark:bg-[#161920] border border-gray-100 dark:border-zinc-800 rounded-[24px] max-w-[480px] w-full p-6 shadow-2xl font-inter select-none animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Detail Anak
            </h3>

            {/* Child Info Box */}
            <div className="border border-gray-200/70 dark:border-zinc-800 rounded-2xl p-4.5 mb-5 space-y-3 text-[13.5px] bg-white dark:bg-[#1e222d]/40">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400">Nama Lengkap:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{selectedChild.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400">Umur:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {selectedChild.age}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400">BB/TB:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {selectedChild.weight} / {selectedChild.height}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400">Status</span>
                <span className={`px-2.5 py-0.5 rounded-[6px] text-[12px] font-medium ${
                  selectedChild.status === "Normal"
                    ? "bg-[#eaf5ec] text-[#0d472c] dark:bg-emerald-950/40 dark:text-emerald-300"
                    : selectedChild.status === "Gizi Kurang"
                    ? "bg-[#fef6dc] text-[#b45309] dark:bg-[#332b00] dark:text-[#fde047]"
                    : selectedChild.status === "Gizi Buruk"
                    ? "bg-[#fff0eb] text-[#c2410c] dark:bg-[#3a1d17] dark:text-[#FFA382]"
                    : "bg-[#fde8e8] text-[#a81a1a] dark:bg-[#3b1212] dark:text-[#f87171]"
                }`}>
                  {selectedChild.status}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400">Z Score TB/U</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {selectedChild.zScore}
                </span>
              </div>
            </div>

            {/* Subheader */}
            <h4 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Matriks Penilaian Status Gizi WHO &amp; Risk Level
            </h4>

            {/* Fixed Purple AI Box */}
            <div className="p-4.5 rounded-2xl bg-[#faf5ff] dark:bg-[#1a1424] border border-[#f3e8ff] dark:border-[#382654] text-[13px] mb-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#7e22ce] dark:text-[#c084fc] text-[14px]">
                <Sparkles className="w-4 h-4 text-[#7e22ce] dark:text-[#c084fc] stroke-[2.2]" />
                <span>Rekomendasi analisis AI</span>
              </div>

              <p className="text-[#6b21a8] dark:text-[#d8b4fe] leading-relaxed whitespace-pre-line font-normal text-[12.5px] sm:text-[13px]">
                {selectedChild.rekomendasiAI}
              </p>
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => setSelectedChild(null)}
              className="w-full py-3.5 bg-[#0d472c] hover:bg-[#0a3923] text-white rounded-xl text-[14.5px] font-medium cursor-pointer transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default StuntingAlerts;
