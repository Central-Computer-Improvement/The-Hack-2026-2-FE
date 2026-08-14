"use client";

import React, { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { dataAnak } from "@/lib/data-anak";

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
  const [selectedChild, setSelectedChild] = useState<ChildAlert | null>(null);

  const alertList: ChildAlert[] = dataAnak
    .filter((anak) => ["Stunting", "Gizi Kurang", "Gizi Buruk"].includes(anak.statusGizi))
    .map((anak) => ({
      id: anak.id,
      initial: anak.nama.charAt(0).toUpperCase(),
      name: anak.nama,
      age: `${anak.usiaBulan} bln`,
      gender: anak.jenisKelamin === "L" ? "Laki - Laki" : "Perempuan",
      status: anak.statusGizi,
      zScore: anak.zScoreTBU,
      height: `${anak.tinggiBadan} cm`,
      weight: `${anak.beratBadan} kg`,
      lastCheck: formatIndonesianDate(anak.tanggalPeriksa),
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
                    <span className="inline-block bg-[#fdeaea] dark:bg-rose-950/60 text-[#b91c1c] dark:text-rose-300 font-inter text-[10.5px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md">
                      Stunting
                    </span>
                  ) : (
                    <span className="inline-block bg-[#fff8dd] dark:bg-amber-950/60 text-[#b4540a] dark:text-amber-300 font-inter text-[10.5px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md">
                      Gizi Kurang
                    </span>
                  )}
                </div>

                <span className="font-inter text-[13.5px] sm:text-[15px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                  {item.name}
                </span>
                <span className="font-inter text-[11px] sm:text-[12px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
                  {item.age}, {item.gender}
                </span>
              </div>
            </div>

            {/* Right: Detail Button */}
            <button
              type="button"
              onClick={() => setSelectedChild(item)}
              className="px-2.5 sm:px-3.5 py-1.5 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl font-inter text-[12px] sm:text-[13px] font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <span>Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedChild && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedChild(null)}
        >
          <div
            className="bg-white dark:bg-[#161920] border border-gray-100 dark:border-zinc-800 rounded-2xl max-w-[480px] w-full p-6 shadow-2xl font-inter relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedChild(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-[17px] font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Detail Peringatan Dini
            </h3>

            <div className="border border-gray-100 dark:border-zinc-800 rounded-xl p-4 mb-5 space-y-2.5 text-[13px] bg-[#f8f9fa] dark:bg-[#1e222d]">
              <div className="flex justify-between">
                <span className="text-zinc-500">Nama Balita:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedChild.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Usia &amp; Gender:</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {selectedChild.age}, {selectedChild.gender}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tinggi &amp; Berat:</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {selectedChild.height} / {selectedChild.weight}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status Gizi:</span>
                <span className={`font-bold ${selectedChild.status === "Stunting" ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {selectedChild.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Z-Score TB/U:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{selectedChild.zScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Pemeriksaan Terakhir:</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{selectedChild.lastCheck}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[13px] mb-5">
              <div className="font-bold text-amber-800 dark:text-amber-300 mb-1">
                ⚠️ Rekomendasi Tindakan Cepat
              </div>
              <p className="font-medium text-amber-900 dark:text-amber-200 leading-relaxed">
                Prioritaskan balita ini untuk pemberian makanan tambahan (PMT) kaya protein hewani dan jadwalkan konseling gizi intensif dengan tenaga medis Posyandu.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedChild(null)}
              className="w-full py-2.5 bg-[#0d472c] hover:bg-[#0a3923] text-white rounded-xl text-[14px] font-medium cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default StuntingAlerts;
