"use client";

import React from "react";
import { dataAnak } from "@/lib/data-anak";
import { Smile, AlertTriangle, CheckSquare, Percent } from "lucide-react";

export const HealthSummary: React.FC = () => {
  // Metrik terhitung dari dataAnak
  const totalAnak = dataAnak.length;
  const anakBeresiko = dataAnak.filter(
    (anak) => anak.statusGizi !== "Normal",
  ).length;
  const pemeriksaan = dataAnak.length;
  const normalCount = dataAnak.filter(
    (anak) => anak.statusGizi === "Normal",
  ).length;
  const normalPercentage =
    totalAnak > 0 ? ((normalCount / totalAnak) * 100).toFixed(1) : "0";

  const cards = [
    {
      title: "Total Anak",
      value: `${totalAnak} Anak`,
      icon: Smile,
    },
    {
      title: "Anak Beresiko",
      value: `${anakBeresiko} Anak`,
      icon: AlertTriangle,
    },
    {
      title: "Pemeriksaan",
      value: `${pemeriksaan} Sesi`,
      icon: CheckSquare,
    },
    {
      title: "Gizi Normal",
      value: `${normalPercentage}% Cakupan`,
      icon: Percent,
    },
  ];

  return (
    <section className="w-full shrink-0 bg-white dark:bg-[#161920] border border-[#e6e8eb] dark:border-[#262a34] rounded-[18px] sm:rounded-[20px] [@media(min-height:850px)]:rounded-[24px] p-3 sm:p-3.5 [@media(min-height:850px)]:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-colors duration-200 select-none">
      {/* Header Title */}
      <div className="mb-2 sm:mb-2.5 [@media(min-height:850px)]:mb-3">
        <h2 className="font-inter text-[14px] sm:text-[15px] [@media(min-height:850px)]:text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
          Ringkasan indikator kesehatan
        </h2>
      </div>

      {/* Grid 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 [@media(min-height:850px)]:gap-3.5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-[#fafafa] dark:bg-[#1e222d] border border-[#eaecf0] dark:border-zinc-800 rounded-[12px] sm:rounded-[14px] [@media(min-height:850px)]:rounded-[16px] p-2.5 sm:p-3 [@media(min-height:850px)]:p-3.5 flex flex-col justify-between hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-200"
            >
              {/* Icon Badge */}
              <div className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] [@media(min-height:850px)]:w-[38px] [@media(min-height:850px)]:h-[38px] rounded-full bg-[#f3e8ff]/60 dark:bg-[#2e1065]/40 flex items-center justify-center text-[#7e22ce] dark:text-[#c084fc] shrink-0">
                <Icon className="w-[17px] h-[17px] sm:w-[19px] sm:h-[19px] [@media(min-height:850px)]:w-[21px] [@media(min-height:850px)]:h-[21px] stroke-[1.9]" />
              </div>

              {/* Title & Value */}
              <div className="mt-2 sm:mt-2.5 [@media(min-height:850px)]:mt-3">
                <span className="font-inter text-[13px] sm:text-[14px] [@media(min-height:850px)]:text-[15px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight block truncate">
                  {card.title}
                </span>
                <span className="font-inter text-[16px] sm:text-[19px] [@media(min-height:850px)]:text-[21px] font-normal tracking-tight text-[#0d472c] dark:text-emerald-400 block truncate mt-0.5">
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HealthSummary;
