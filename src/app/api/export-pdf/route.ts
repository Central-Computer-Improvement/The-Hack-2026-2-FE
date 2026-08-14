import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import LaporanGiziDocument, {
  ReportItem,
} from "@/components/pdf/LaporanGiziDocument";
import { dataAnak } from "@/lib/data-anak";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchFilter = searchParams.get("filter") || "";

    // 1. Fetch data dari dataAnak
    let filteredData = dataAnak;

    // Filter jika ada status gizi spesifik yang diminta
    if (searchFilter && searchFilter !== "Semua Kategori") {
      filteredData = filteredData.filter(
        (i) => i.statusGizi.toLowerCase() === searchFilter.toLowerCase(),
      );
    }

    // Urutkan data berdasarkan prioritas status gizi (paling bahaya ke paling aman)
    const statusPriority: Record<string, number> = {
      stunting: 1,
      "gizi buruk": 2,
      "gizi kurang": 3,
      obesitas: 4,
      normal: 5,
    };

    filteredData = [...filteredData].sort((a, b) => {
      const pA = statusPriority[a.statusGizi.toLowerCase()] || 99;
      const pB = statusPriority[b.statusGizi.toLowerCase()] || 99;
      return pA - pB;
    });

    // 2. Format data ke ReportItem
    let reportItems: ReportItem[] = [];
    let counter = 1;

    for (const anak of filteredData) {
      // Parse Z-Score strings to numbers (e.g. "-3.1 SD" -> -3.1)
      const parseZScore = (str: string) => {
        const parsed = parseFloat(str.replace(" SD", ""));
        return isNaN(parsed) ? 0 : parsed;
      };

      reportItems.push({
        no: counter++,
        namaAnak: anak.nama,
        usiaBulan: anak.usiaBulan,
        jenisKelamin: anak.jenisKelamin,
        beratBadan: anak.beratBadan,
        tinggiBadan: anak.tinggiBadan,
        zScoreBBU: parseZScore(anak.zScoreBBU),
        zScoreTBU: parseZScore(anak.zScoreTBU),
        zScoreBBTB: parseZScore(anak.zScoreBBTB),
        statusGizi: anak.statusGizi,
        tanggalPengukuran: anak.tanggalPeriksa,
      });
    }

    // 3. Generate Real-time Date & PDF Buffer
    const now = new Date();
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const realTimeTanggalCetak = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const realTimePeriode = `${months[now.getMonth()]} ${now.getFullYear()}`;

    const pdfElement = React.createElement(LaporanGiziDocument, {
      namaPosyandu: "POSYANDU MEKAR SARI 01",
      namaDinas: "DINAS KESEHATAN KOTA BANDUNG",
      namaKecamatan: "KECAMATAN BOJONGSOANG - KOTA BANDUNG",
      alamat:
        "Jl. Sukabirus No. 123, Bojongsoang, Kota Bandung | Telp: (022) 2501234",
      periode: realTimePeriode,
      tanggalCetak: realTimeTanggalCetak,
      namaKepala: "Dr. Hj. Syahla Mutiara Latifah, M.Kes",
      nipKepala: "19780512 200501 2 004",
      items: reportItems,
    });

    const pdfBuffer = await renderToBuffer(pdfElement as any);

    // 4. Return PDF File Stream with Inline Disposition (Open in New Tab)
    const filename = `rekap-gizi-mekar-sari-agustus-2026.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Gagal membuat PDF:", error);
    return NextResponse.json(
      { error: "Gagal membuat dokumen PDF    gizi" },
      { status: 500 },
    );
  }
}
