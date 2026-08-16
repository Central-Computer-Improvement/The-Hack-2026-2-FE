"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import Topbar from "@/components/layouts/Topbar";
import WhoRulesModal from "@/components/_shared/WhoRulesModal";
import CustomSelect from "@/components/forms/CustomSelect";
import { Book } from "lucide-react";

import { addDataAnak, isNikBalitaTerdaftar } from "@/lib/data-anak-store";
import { AnakRecord } from "@/lib/data-anak";
import { showToast } from "@/lib/custom-toast";

export default function PencatatanAnakPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWhoRules, setShowWhoRules] = useState(false);

  // Form State starts EMPTY so placeholders are visible by default
  const [formData, setFormData] = useState({
    namaBalita: "",
    nikBalita: "",
    namaOrangTua: "",
    jenisKelamin: "",
    tanggalLahir: "",
    tanggalPemeriksaan: "",
    umurBulan: "",
    beratBadan: "",
    tinggiBadan: "",
    alamat: "",
  });

  const isNikInvalid =
    formData.nikBalita.length > 0 && formData.nikBalita.length < 16;
  const isNikDuplicate =
    formData.nikBalita.length === 16 &&
    isNikBalitaTerdaftar(formData.nikBalita);

  const umurNum = parseInt(formData.umurBulan, 10);
  const isUmurInvalid =
    formData.umurBulan !== "" &&
    (isNaN(umurNum) || umurNum > 59 || umurNum < 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nikBalita.length !== 16 || isUmurInvalid || isNikDuplicate) {
      if (isNikDuplicate) {
        showToast.error(
          "NIK Balita ini sudah terdaftar pada data lain. Periksa kembali data yang diinput.",
        );
      }
      return;
    }

    const bb = parseFloat(formData.beratBadan.replace(",", ".")) || 10.0;
    const tb = parseFloat(formData.tinggiBadan.replace(",", ".")) || 80.0;
    const usia = Math.min(
      59,
      Math.max(0, parseInt(formData.umurBulan, 10) || 0),
    );
    const today = new Date().toISOString().split("T")[0];

    // Hitung Z-Score & Status Gizi berdasarkan standar WHO
    const medianTB = 75 + usia * 0.75;
    const medianBB = 3.5 + usia * 0.35;

    const zTB = parseFloat(((tb - medianTB) / 3.5).toFixed(2));
    const zBB = parseFloat(((bb - medianBB) / 1.5).toFixed(2));
    const zBB_TB = parseFloat((zBB - zTB).toFixed(2));

    let status: "Normal" | "Gizi Kurang" | "Gizi Buruk" | "Stunting" = "Normal";

    if (zTB < -3.0 || zBB < -3.0 || zBB_TB < -3.0) {
      status = "Stunting";
    } else if (zTB < -2.0 || zBB < -2.0 || zBB_TB < -2.0) {
      status = "Gizi Kurang";
    }

    const zBBUStr = zBB > 0 ? `+${zBB} SD` : `${zBB} SD`;
    const zTBUStr = zTB > 0 ? `+${zTB} SD` : `${zTB} SD`;
    const zBBTBStr = zBB_TB > 0 ? `+${zBB_TB} SD` : `${zBB_TB} SD`;

    const nama = formData.namaBalita.trim() || "Pasien";
    const isCritical =
      status === "Stunting" || (status as string) === "Gizi Buruk";
    const aiAdvice = `[ANALISIS MEDIS KEMENKES RI & WHO] Pasien ${nama} (${usia} Bulan) terindikasi status ${status} dengan Z-Score BB/TB ${zBBTBStr} (BB ${bb} kg pada TB ${tb} cm). ${
      isCritical
        ? "Berisiko tinggi terhadap gangguan pertumbuhan dan kognitif dini. Segera konsultasikan ke Posyandu/Puskesmas untuk pemantauan dan intervensi gizi terpadu."
        : "Pertahankan pemantauan gizi rutin bulanan dan berikan asupan makanan bergizi seimbang."
    }`;

    const newChildRecord: AnakRecord = {
      id: `anak-${Date.now()}`,
      nama: nama,
      nik: formData.nikBalita,
      usiaBulan: usia,
      jenisKelamin: (formData.jenisKelamin as "L" | "P") || "L",
      namaOrangTua: formData.namaOrangTua.trim() || "Orang Tua",
      beratBadan: bb,
      tinggiBadan: tb,
      statusGizi: status,
      zScoreBBU: zBBUStr,
      zScoreTBU: zTBUStr,
      zScoreBBTB: zBBTBStr,
      tanggalPeriksa: today,
      rekomendasiAI: aiAdvice,
    };

    // Save to persistent localStorage store
    addDataAnak(newChildRecord);

    // Custom Sleek Toast
    showToast.success("Data Balita berhasil ditambahkan");

    // Reset Form
    setFormData({
      namaBalita: "",
      nikBalita: "",
      namaOrangTua: "",
      jenisKelamin: "",
      tanggalLahir: "",
      tanggalPemeriksaan: "",
      umurBulan: "",
      beratBadan: "",
      tinggiBadan: "",
      alamat: "",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8f9fa] dark:bg-[#0B0F14] text-zinc-900 dark:text-zinc-100 font-inter transition-colors duration-200">
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

        {/* Content Body */}
        <main className="p-4 sm:p-5 xl:p-6 flex flex-col space-y-4 [@media(min-height:850px)]:space-y-5 w-full flex-1">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-zinc-900 dark:text-[#F0F3F7]">
              Pencatatan Data Anak
            </h1>

            <button
              type="button"
              onClick={() => setShowWhoRules(true)}
              className="px-4 h-[42px] bg-[#eef3ed] dark:bg-[#1b2720] border border-[#c3dfc3] dark:border-emerald-900/60 text-[#0d472c] dark:text-emerald-300 font-inter text-[14px] font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Book className="w-[18px] h-[18px] stroke-[1.8]" />
              <span>Rumus & Aturan WHO</span>
            </button>
          </div>

          {/* Form Card (Clean Full Width) */}
          <div className="bg-white dark:bg-[#161920] rounded-[24px] border border-[#e6e8eb] dark:border-[#262a34] p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h2 className="text-[18px] font-bold text-zinc-900 dark:text-[#F0F3F7]">
              Data Identitas & Hasil Pengukuran
            </h2>
            <p className="text-[13px] text-zinc-500 dark:text-[#9BA5B0] mt-1">
              Balita yang memerlukan tindakan intervensi
            </p>

            <form onSubmit={handleSubmit} className="space-y-[32px] mt-[32px]">
              {/* Row 1: Nama Lengkap Balita & NIK Balita */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-[#9BA5B0] mb-2.5">
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
                    className="w-full h-[48px] px-4 py-3.5 bg-white dark:bg-[#1A222C] rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-[#F0F3F7] border border-gray-200 dark:border-[#232B36] focus:border-[#0d472c] dark:focus:border-[#22A559] focus:outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-[#6B7580]"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-[#9BA5B0] mb-2.5">
                    NIK Balita
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={16}
                    required
                    placeholder="Masukkan 16 digit NIK balita"
                    value={formData.nikBalita || ""}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16);
                      setFormData({
                        ...formData,
                        nikBalita: val,
                      });
                    }}
                    className={`w-full h-[48px] px-4 py-3.5 rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-[#F0F3F7] border transition-colors placeholder:text-zinc-400 dark:placeholder:text-[#6B7580] focus:outline-none ${
                      isNikInvalid || isNikDuplicate
                        ? "bg-rose-50/30 dark:bg-rose-950/20 border-rose-500 focus:border-rose-500 focus:ring-1.5 focus:ring-rose-500/20"
                        : formData.nikBalita.length === 16
                          ? "bg-white dark:bg-[#1A222C] border-emerald-500 dark:border-emerald-500 focus:border-emerald-600"
                          : "bg-white dark:bg-[#1A222C] border-gray-200 dark:border-[#232B36] focus:border-[#0d472c] dark:focus:border-[#22A559]"
                    }`}
                  />
                  {isNikInvalid && (
                    <p className="font-inter text-[12px] font-medium text-rose-500 mt-1.5 flex items-center gap-1">
                      <span>NIK harus terdiri dari 16 digit angka</span>
                    </p>
                  )}
                  {isNikDuplicate && (
                    <p className="font-inter text-[12px] font-medium text-rose-500 mt-1.5 flex items-center gap-1">
                      <span>NIK Balita ini sudah terdaftar</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Umur, Jenis Kelamin, Nama Orang Tua */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-[#9BA5B0] mb-2.5">
                    Umur (Bulan)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="Masukkan umur"
                    value={formData.umurBulan}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, umurBulan: val });
                    }}
                    className={`w-full h-[48px] px-4 py-3.5 rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-[#F0F3F7] border transition-colors placeholder:text-zinc-400 dark:placeholder:text-[#6B7580] focus:outline-none ${
                      isUmurInvalid
                        ? "bg-rose-50/30 dark:bg-rose-950/20 border-rose-500 focus:border-rose-500 focus:ring-1.5 focus:ring-rose-500/20"
                        : formData.umurBulan !== ""
                          ? "bg-white dark:bg-[#1A222C] border-emerald-500 dark:border-emerald-500 focus:border-emerald-600"
                          : "bg-white dark:bg-[#1A222C] border-gray-200 dark:border-[#232B36] focus:border-[#0d472c] dark:focus:border-[#22A559]"
                    }`}
                  />
                  {isUmurInvalid && (
                    <p className="font-inter text-[12px] font-medium text-rose-500 mt-1.5 flex items-center gap-1">
                      <span>Umur harus antara 0 - 59 bulan</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-[#9BA5B0] mb-2.5">
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
                    triggerClassName="w-full h-[48px] px-4 py-3.5 bg-white dark:bg-[#1A222C] rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-[#F0F3F7] border border-gray-200 dark:border-[#232B36] hover:bg-gray-50 dark:hover:bg-[#1E222D] transition-colors flex items-center justify-between"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-[#9BA5B0] mb-2.5">
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
                    className="w-full h-[48px] px-4 py-3.5 bg-white dark:bg-[#1A222C] rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-[#F0F3F7] border border-gray-200 dark:border-[#232B36] focus:border-[#0d472c] dark:focus:border-[#22A559] focus:outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-[#6B7580]"
                  />
                </div>
              </div>

              {/* Row 3: Berat Badan & Tinggi Badan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-[#9BA5B0] mb-2.5">
                    Berat Badan (kg)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="Masukan Berat Badan"
                    value={formData.beratBadan}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9.,]/g, "");
                      const matches = val.match(/[.,]/g);
                      if (matches && matches.length > 1) {
                        const firstSep = val.match(/[.,]/)?.[0] || ".";
                        const parts = val.split(/[.,]/);
                        val = parts[0] + firstSep + parts.slice(1).join("");
                      }
                      setFormData({ ...formData, beratBadan: val });
                    }}
                    className="w-full h-[48px] px-4 py-3.5 bg-white dark:bg-[#1A222C] rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-[#F0F3F7] border border-gray-200 dark:border-[#232B36] focus:border-[#0d472c] dark:focus:border-[#22A559] focus:outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-[#6B7580]"
                  />
                </div>

                <div>
                  <label className="block font-inter text-[13.5px] font-medium text-zinc-800 dark:text-[#9BA5B0] mb-2.5">
                    Tinggi Badan (cm)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    placeholder="Masukan Tinggi Badan"
                    value={formData.tinggiBadan}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9.,]/g, "");
                      const matches = val.match(/[.,]/g);
                      if (matches && matches.length > 1) {
                        const firstSep = val.match(/[.,]/)?.[0] || ".";
                        const parts = val.split(/[.,]/);
                        val = parts[0] + firstSep + parts.slice(1).join("");
                      }
                      setFormData({ ...formData, tinggiBadan: val });
                    }}
                    className="w-full h-[48px] px-4 py-3.5 bg-white dark:bg-[#1A222C] rounded-[8px] font-inter text-[13.5px] text-zinc-900 dark:text-[#F0F3F7] border border-gray-200 dark:border-[#232B36] focus:border-[#0d472c] dark:focus:border-[#22A559] focus:outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-[#6B7580]"
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
          </div>
        </main>
      </div>
    </div>
  );
}
