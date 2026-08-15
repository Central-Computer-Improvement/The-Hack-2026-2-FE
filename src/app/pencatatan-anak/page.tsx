"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import Topbar from "@/components/layouts/Topbar";
import WhoRulesModal from "@/components/_shared/WhoRulesModal";
import CustomSelect from "@/components/forms/CustomSelect";
import CustomDatePicker from "@/components/forms/CustomDatePicker";
import { Book, CheckCircle2 } from "lucide-react";

export default function PencatatanAnakPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWhoRules, setShowWhoRules] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Form State starts EMPTY so placeholders are visible by default
  const [formData, setFormData] = useState({
    namaBalita: "",
    nikOrangTua: "",
    namaOrangTua: "",
    jenisKelamin: "",
    tanggalLahir: "",
    tanggalPemeriksaan: "",
    umurBulan: "",
    beratBadan: "",
    tinggiBadan: "",
    alamat: "",
  });

  // Calculated Analysis State
  const [calcResult, setCalcResult] = useState<{
    zScoreBBU: string;
    zScoreTBU: string;
    zScoreBBTB: string;
    statusGizi: string;
    statusBadgeColor: string;
    rekomendasiAI: string;
  } | null>(null);

  // Dynamic Z-score & WHO Status calculation
  useEffect(() => {
    const bb = parseFloat(formData.beratBadan.replace(",", "."));
    const tb = parseFloat(formData.tinggiBadan.replace(",", "."));
    const usia = parseInt(formData.umurBulan) || 0;

    if (!bb || !tb || isNaN(bb) || isNaN(tb) || bb <= 0 || tb <= 0) {
      setCalcResult(null);
      return;
    }

    const medianTB = 75 + usia * 0.75;
    const medianBB = 3.5 + usia * 0.35;

    const zTB = parseFloat(((tb - medianTB) / 3.5).toFixed(2));
    const zBB = parseFloat(((bb - medianBB) / 1.5).toFixed(2));
    const zBB_TB = parseFloat((zBB - zTB).toFixed(2));

    let status = "Normal";
    let badgeColor =
      "bg-[#eaf5ec] dark:bg-emerald-950/60 text-[#0d472c] dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60";

    if (zTB < -3.0 || zBB < -3.0 || zBB_TB < -3.0) {
      status = "Stunting";
      badgeColor =
        "bg-[#fdeaea] dark:bg-rose-950/60 text-[#b91c1c] dark:text-rose-300 border-rose-200 dark:border-rose-900/60";
    } else if (zTB < -2.0 || zBB < -2.0 || zBB_TB < -2.0) {
      status = "Gizi Kurang";
      badgeColor =
        "bg-[#fff8dd] dark:bg-amber-950/60 text-[#b4540a] dark:text-amber-300 border-amber-200 dark:border-amber-900/60";
    }

    const zBBUStr = zBB > 0 ? `+${zBB} SD` : `${zBB} SD`;
    const zTBUStr = zTB > 0 ? `+${zTB} SD` : `${zTB} SD`;
    const zBBTBStr = zBB_TB > 0 ? `+${zBB_TB} SD` : `${zBB_TB} SD`;

    const nama = formData.namaBalita || "Pasien";
    const aiAdvice = `[ANALISIS MEDIS KEMENKES RI & WHO] Pasien ${nama} (${usia} Bulan) terindikasi status ${status} dengan Z-Score BB/TB ${zBBTBStr} (BB ${bb} kg pada TB ${tb} cm). ${
      status === "Stunting" || status === "Gizi Buruk"
        ? "Berisiko tinggi terhadap gangguan pertumbuhan dan kognitif dini. Segera konsultasikan ke Posyandu/Puskesmas untuk pemantauan dan intervensi gizi terpadu."
        : "Pertahankan pemantauan gizi rutin bulanan dan berikan asupan makanan bergizi seimbang."
    }`;

    setCalcResult({
      zScoreBBU: zBBUStr,
      zScoreTBU: zTBUStr,
      zScoreBBTB: zBBTBStr,
      statusGizi: status,
      statusBadgeColor: badgeColor,
      rekomendasiAI: aiAdvice,
    });
  }, [
    formData.beratBadan,
    formData.tinggiBadan,
    formData.umurBulan,
    formData.namaBalita,
  ]);

  const isNikInvalid =
    formData.nikOrangTua.length > 0 && formData.nikOrangTua.length < 16;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nikOrangTua.length !== 16) {
      return;
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  const jenisKelaminOptions = [
    { value: "L", label: "Laki - Laki" },
    { value: "P", label: "Perempuan" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8f9fa] dark:bg-[#0f1115] text-zinc-900 dark:text-zinc-100 font-inter transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar
        currentTab="pencatatan-anak"
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Modal Guide WHO */}
        <WhoRulesModal
          isOpen={showWhoRules}
          onClose={() => setShowWhoRules(false)}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-5 xl:p-6 flex flex-col space-y-5 w-full flex-1">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="font-inter text-[24px] sm:text-[28px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Pencatatan Data Anak
            </h1>

              <button
                type="button"
                onClick={() => setShowWhoRules(true)}
                className="px-4 h-[42px] bg-[#eef3ed] dark:bg-[#1b2720] border border-[#c3dfc3] dark:border-emerald-900/60 text-[#0d472c] dark:text-emerald-300 font-inter text-[14px] font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Book className="w-[18px] h-[18px] stroke-[1.8]" />
                <span>Rumus & Aturan WHO</span>
              </button>
          </div>

          {/* Success Alert Banner */}
          {isSaved && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-[#0d472c] dark:text-emerald-300 flex items-center gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-[13.5px] font-semibold">
                Data balita berhasil ditambahkan ke sistem!
              </span>
            </div>
          )}

          <section className="w-full bg-white dark:bg-[#161920] border border-gray-200/70 dark:border-zinc-800/70 rounded-[24px] p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-colors duration-200">
            <h2 className="font-inter text-[18px] sm:text-[19px] font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              Peringatan Dini Gizi & Stunting
            </h2>
            <p className="font-inter text-[13px] sm:text-[13.5px] text-zinc-400 dark:text-zinc-500 mt-1">
              Balita yang memerlukan tindakan intervensi
            </p>

            <form onSubmit={handleSubmit} className="space-y-[32px] mt-[32px]">
              {/* Row 1: Nama Lengkap Balita & NIK Orang Tua */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-zinc-200 mb-2.5">
                    Nama Lengkap Balita
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama balita"
                    value={formData.namaBalita}
                    onChange={(e) =>
                      setFormData({ ...formData, namaBalita: e.target.value })
                    }
                    className="w-full h-[48px] px-4 py-3.5 bg-white dark:bg-[#1e222d] rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 focus:border-[#0d472c] focus:outline-none transition-colors placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-zinc-200 mb-2.5">
                    NIK Orang Tua Balita
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={16}
                    required
                    placeholder="Masukkan 16 digit NIK"
                    value={formData.nikOrangTua || ""}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16);
                      setFormData({
                        ...formData,
                        nikOrangTua: val,
                      });
                    }}
                    className={`w-full h-[48px] px-4 py-3.5 rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-zinc-100 border transition-colors placeholder:text-zinc-400 focus:outline-none ${
                      isNikInvalid
                        ? "bg-rose-50/30 dark:bg-rose-950/20 border-rose-500 focus:border-rose-500 focus:ring-1.5 focus:ring-rose-500/20"
                        : formData.nikOrangTua.length === 16
                          ? "bg-white dark:bg-[#1e222d] border-emerald-500 dark:border-emerald-500 focus:border-emerald-600"
                          : "bg-white dark:bg-[#1e222d] border-gray-200 dark:border-zinc-700 focus:border-[#0d472c]"
                    }`}
                  />
                  {isNikInvalid && (
                    <p className="font-inter text-[12px] font-medium text-rose-500 mt-1.5 flex items-center gap-1">
                      <span>NIK harus terdiri dari 16 digit angka</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Umur, Jenis Kelamin, Nama Orang Tua */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-zinc-200 mb-2.5">
                    Umur (Bulan)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukan umur"
                    value={formData.umurBulan}
                    onChange={(e) =>
                      setFormData({ ...formData, umurBulan: e.target.value })
                    }
                    className="w-full h-[48px] px-4 py-3.5 bg-white dark:bg-[#1e222d] rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 focus:border-[#0d472c] focus:outline-none transition-colors placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-zinc-200 mb-2.5">
                    Jenis Kelamin
                  </label>
                  <CustomSelect
                    options={[
                      { value: "L", label: "Laki - Laki" },
                      { value: "P", label: "Perempuan" },
                    ]}
                    value={formData.jenisKelamin}
                    onChange={(val) =>
                      setFormData({ ...formData, jenisKelamin: val })
                    }
                    placeholder="Pilih jenis kelamin"
                    containerClassName="w-full flex"
                    triggerClassName="w-full h-[48px] px-4 py-3.5 bg-white dark:bg-[#1e222d] rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-zinc-200 mb-2.5">
                    Nama Orang Tua
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap"
                    value={formData.namaOrangTua || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        namaOrangTua: e.target.value,
                      })
                    }
                    className="w-full h-[48px] px-4 py-3.5 bg-white dark:bg-[#1e222d] rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 focus:border-[#0d472c] focus:outline-none transition-colors placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Row 3: Berat Badan & Tinggi Badan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-zinc-200 mb-2.5">
                    Berat Badan (kg)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukan Berat Badan"
                    value={formData.beratBadan}
                    onChange={(e) =>
                      setFormData({ ...formData, beratBadan: e.target.value })
                    }
                    className="w-full h-[48px] px-4 py-3.5 bg-white dark:bg-[#1e222d] rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 focus:border-[#0d472c] focus:outline-none transition-colors placeholder:text-zinc-400"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-zinc-200 mb-2.5">
                    Tinggi Badan (cm)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukan Tinggi Badan"
                    value={formData.tinggiBadan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tinggiBadan: e.target.value,
                      })
                    }
                    className="w-full h-[48px] px-4 py-3.5 bg-white dark:bg-[#1e222d] rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 focus:border-[#0d472c] focus:outline-none transition-colors placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-[#0d472c] hover:bg-[#0a3923] active:bg-[#072a1a] text-white font-inter text-[15.5px] font-medium rounded-[8px] transition-colors shadow-xs cursor-pointer mt-4"
              >
                Tambah data balita
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
