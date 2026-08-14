"use client";

import React from "react";

import { dataAnak } from "@/lib/data-anak";

export const HealthSummary: React.FC = () => {
  // Calculate real metrics from dataAnak
  const totalAnak = dataAnak.length;
  const anakBeresiko = dataAnak.filter((anak) => anak.statusGizi !== "Normal").length;
  const pemeriksaan = dataAnak.length; // Assuming 1 record = 1 pemeriksaan
  const normalCount = dataAnak.filter((anak) => anak.statusGizi === "Normal").length;
  const normalPercentage = totalAnak > 0 ? ((normalCount / totalAnak) * 100).toFixed(1) : "0";

  const cards = [
    {
      title: "Total Anak",
      value: `${totalAnak} Anak`,
      subtext: null,
    },
    {
      title: "Anak Beresiko",
      value: `${anakBeresiko} Anak`,
      subtext: null,
    },
    {
      title: "Pemeriksaan",
      value: `${pemeriksaan} Kali`,
      subtext: null,
    },
    {
      title: "Gizi Normal",
      value: `${normalPercentage}% Tercapai`,
      subtext: null,
    },
  ];

  return (
    <section className="w-full shrink-0 bg-white dark:bg-[#161920] border border-[#e6e8eb] dark:border-[#262a34] rounded-[24px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-colors duration-200 select-none">
      <div className="mb-3">
        <h2 className="font-inter text-[18px] sm:text-[19px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
          Ringkasan indikator kesehatan
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-[#D2F5D9] dark:bg-[#1b2720] rounded-[10px] p-3 sm:p-4 flex flex-col justify-between h-[90px] xl:h-[100px] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span className="font-inter text-[15px] sm:text-[16px] font-bold text-[#0d472c] dark:text-emerald-300">
              {card.title}
            </span>

            <div className="mt-2 w-full">
              <div className="bg-white dark:bg-[#161920] rounded-[8px] px-3 h-[36px] xl:h-[40px] flex items-center font-inter text-[18px] sm:text-[20px] font-medium text-[#0d472c] dark:text-zinc-100 tracking-tight w-full">
                {card.value}
              </div>
              {card.subtext && (
                <div className="font-inter text-[16px] sm:text-[18px] font-semibold text-zinc-800 dark:text-zinc-200 leading-tight mt-0.5">
                  {card.subtext}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HealthSummary;
