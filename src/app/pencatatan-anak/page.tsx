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
import { loadReference, nilaiGiziAnak } from "@/lib/zscore";

export default function PencatatanAnakPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWhoRules, setShowWhoRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nikBalita.length !== 16 || isUmurInvalid || isNikDuplicate) {
      if (isNikDuplicate) {
        showToast.error(
          "NIK Balita ini sudah terdaftar pada data lain. Periksa kembali data yang diinput.",
        );
      } else if (formData.nikBalita.length !== 16) {
        showToast.error("NIK harus terdiri dari 16 digit angka");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const bb = parseFloat(formData.beratBadan.replace(",", "."));
      const tb = parseFloat(formData.tinggiBadan.replace(",", "."));
      const usia = parseInt(formData.umurBulan, 10);

      if (isNaN(bb) || isNaN(tb) || bb <= 0 || tb <= 0) {
        throw new Error(
          "Berat badan dan tinggi badan harus diisi dengan angka valid lebih dari 0.",
        );
      }

      if (isNaN(usia) || usia < 0 || usia > 59) {
        throw new Error("Umur balita harus antara 0 - 59 bulan.");
      }

      if (!formData.jenisKelamin) {
        throw new Error("Jenis kelamin balita harus dipilih.");
      }

      const jk: "laki-laki" | "perempuan" =
        formData.jenisKelamin === "P" ? "perempuan" : "laki-laki";
      const today = new Date().toISOString().split("T")[0];

      // 1. Kalkulasi Z-score resmi WHO Permenkes No. 2/2020
      const ref = loadReference();
      const hasil = nilaiGiziAnak(ref, usia, jk, bb, tb);

      const pos = usia < 24 ? "telentang" : "berdiri";
      const indeksPanjang = pos === "telentang" ? "PB/U" : "TB/U";
      const indeksBbPanjang = pos === "telentang" ? "BB/PB" : "BB/TB";

      const zBbu = hasil["BB/U"].z_score;
      const zTbu = hasil[indeksPanjang].z_score;
      const zBbtb = hasil[indeksBbPanjang].z_score;

      const statusBbu = hasil["BB/U"].status;
      const statusTbu = hasil[indeksPanjang].status;
      const statusBbtb = hasil[indeksBbPanjang].status;

      // 2. Penentuan Status Gizi Utama (Aturan Prioritas)
      let status: "Normal" | "Gizi Kurang" | "Gizi Buruk" | "Stunting" = "Normal";

      if (statusTbu.toLowerCase().includes("stunted")) {
        status = "Stunting";
      } else if (
        statusBbtb.toLowerCase().includes("gizi buruk") ||
        statusBbtb.toLowerCase().includes("severely wasted")
      ) {
        status = "Gizi Buruk";
      } else if (
        statusBbtb.toLowerCase().includes("gizi kurang") ||
        statusBbtb.toLowerCase().includes("wasted")
      ) {
        status = "Gizi Kurang";
      } else if (
        statusBbu.toLowerCase().includes("kurang") ||
        statusBbu.toLowerCase().includes("underweight")
      ) {
        status = "Gizi Kurang";
      } else {
        status = "Normal";
      }

      // 3. Formatting String Z-Score & Template Fallback Konsisten
      const zBBUStr = zBbu > 0 ? `+${zBbu} SD` : `${zBbu} SD`;
      const zTBUStr = zTbu > 0 ? `+${zTbu} SD` : `${zTbu} SD`;
      const zBBTBStr = zBbtb > 0 ? `+${zBbtb} SD` : `${zBbtb} SD`;

      const nama = formData.namaBalita.trim() || "Pasien";
      const isCritical = status === "Stunting" || status === "Gizi Buruk";

      // Fallback Analisis Lokal Pasti (berbasis Z-score resmi real)
      let aiAdvice = `[ANALISIS MEDIS KEMENKES RI & WHO] Pasien ${nama} (${usia} Bulan) terindikasi status ${status} dengan Z-Score BB/TB ${zBBTBStr} (BB ${bb} kg pada TB ${tb} cm). ${
        isCritical
          ? "Berisiko tinggi terhadap gangguan pertumbuhan dan kognitif dini. Segera konsultasikan ke Posyandu/Puskesmas untuk pemantauan dan intervensi gizi terpadu."
          : "Pertahankan pemantauan gizi rutin bulanan dan berikan asupan makanan bergizi seimbang."
      }`;

      // 4. Request Rekomendasi ke Gemini API Server Route
      try {
        const res = await fetch("/api/rekomendasi-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama,
            usiaBulan: usia,
            jenisKelamin: jk,
            beratKg: bb,
            tinggiCm: tb,
            statusGizi: status,
            zScoreBBU: zBBUStr,
            zScoreTBU: zTBUStr,
            zScoreBBTB: zBBTBStr,
          }),
        });

        if (res.ok) {
          const aiData = await res.json();
          if (aiData.rekomendasi) {
            aiAdvice = aiData.rekomendasi;
          }
        } else {
          showToast.error(
            "Rekomendasi AI gagal dimuat, menggunakan analisis lokal.",
          );
        }
      } catch {
        showToast.error(
          "Jaringan AI tidak terjangkau, menggunakan analisis lokal.",
        );
      }

      // 5. Data anak TETAP tersimpan secara utuh & aman
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
    } catch (error) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghitung Z-score status gizi.";
      showToast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
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
        <main className="p-4 sm:p-5 xl:p-6 flex flex-col space-y-4 [@media(min-height:850px)]:space-y-5 w-full flex-1 min-h-screen">
          {/* Header Section */}
          <div className="flex flex-row items-center justify-between gap-4 min-h-[42px] h-[42px] shrink-0">
            <div>
              <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-zinc-900 dark:text-[#F0F3F7]">
                Pencatatan Data Anak
              </h1>
              <p className="font-inter text-[13px] sm:text-[13.5px] text-zinc-500 dark:text-[#9BA5B0] mt-1.5 leading-normal">
                Input data antropometri balita untuk pemantauan status gizi
              </p>
            </div>

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
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0d472c] hover:bg-[#0a3923] active:bg-[#072a1a] disabled:opacity-75 disabled:cursor-not-allowed text-white font-inter text-[15.5px] font-medium rounded-[8px] transition-colors shadow-xs cursor-pointer mt-4"
              >
                {isSubmitting
                  ? "Menganalisis & Menyimpan..."
                  : "Tambah data balita"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
