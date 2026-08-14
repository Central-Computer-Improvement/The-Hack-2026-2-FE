"use client";

import React from "react";
import { dataAnak } from "@/lib/data-anak";

export const HealthSummary: React.FC = () => {
  // Calculate real metrics from dataAnak
  const totalAnak = dataAnak.length;
  const anakBeresiko = dataAnak.filter((anak) => anak.statusGizi !== "Normal").length;
  const pemeriksaan = dataAnak.length;
  const normalCount = dataAnak.filter((anak) => anak.statusGizi === "Normal").length;
  const normalPercentage = totalAnak > 0 ? ((normalCount / totalAnak) * 100).toFixed(1) : "0";

  const cards = [
    {
      title: "Total Anak",
      value: `${totalAnak} Anak`,
    },
    {
      title: "Anak Beresiko",
      value: `${anakBeresiko} Anak`,
    },
    {
      title: "Pemeriksaan",
      value: `${pemeriksaan} Kali`,
    },
    {
      title: "Gizi Normal",
      value: `${normalPercentage}% Tercapai`,
    },
  ];

  return (
    <section className="w-full shrink-0 bg-white dark:bg-[#161920] border border-[#e6e8eb] dark:border-[#262a34] rounded-[20px] [@media(min-height:850px)]:rounded-[24px] p-3 sm:p-4 [@media(min-height:850px)]:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-colors duration-200 select-none">
      <div className="mb-2 [@media(min-height:850px)]:mb-3">
        <h2 className="font-inter text-[15px] sm:text-[17px] [@media(min-height:850px)]:text-[19px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
          Ringkasan indikator kesehatan
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 [@media(min-height:850px)]:gap-4">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="bg-[#D2F5D9] dark:bg-[#1b2720] rounded-[10px] p-2.5 sm:p-3 [@media(min-height:850px)]:p-4 flex flex-col justify-between h-[76px] sm:h-[84px] [@media(min-height:850px)]:h-[100px] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span className="font-inter text-[13px] sm:text-[14px] [@media(min-height:850px)]:text-[16px] font-bold text-[#0d472c] dark:text-emerald-300 truncate">
              {card.title}
            </span>

            <div className="mt-1 [@media(min-height:850px)]:mt-2 w-full">
              <div className="bg-white dark:bg-[#161920] rounded-[6px] [@media(min-height:850px)]:rounded-[8px] px-2.5 sm:px-3 h-[30px] sm:h-[34px] [@media(min-height:850px)]:h-[40px] flex items-center font-inter text-[14.5px] sm:text-[16px] [@media(min-height:850px)]:text-[20px] font-medium text-[#0d472c] dark:text-zinc-100 tracking-tight w-full truncate">
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HealthSummary;
