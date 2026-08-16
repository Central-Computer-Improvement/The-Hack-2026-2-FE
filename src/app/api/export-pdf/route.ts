import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import LaporanGiziDocument, {
  ReportItem,
} from "@/components/pdf/LaporanGiziDocument";
import { dataAnak, AnakRecord } from "@/lib/data-anak";

const parseZScoreSafe = (val: unknown): number => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (typeof val === "string") {
    const cleaned = val.replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

async function generatePdfFromRecords(
  records: AnakRecord[],
  searchFilter: string,
) {
  // 1. Filter jika ada status gizi spesifik yang diminta
  let filteredData = [...records];
  if (searchFilter && searchFilter !== "Semua Kategori") {
    filteredData = filteredData.filter(
      (i) => i.statusGizi?.toLowerCase() === searchFilter.toLowerCase(),
    );
  }

  // 2. Urutkan data berdasarkan prioritas status gizi (paling bahaya ke paling aman)
  const statusPriority: Record<string, number> = {
    stunting: 1,
    "gizi buruk": 2,
    "gizi kurang": 3,
    normal: 4,
  };

  filteredData.sort((a, b) => {
    const pA = statusPriority[String(a.statusGizi || "").toLowerCase()] || 99;
    const pB = statusPriority[String(b.statusGizi || "").toLowerCase()] || 99;
    return pA - pB;
  });

  // 3. Format data ke ReportItem dengan normalisasi aman
  const reportItems: ReportItem[] = [];
  let counter = 1;

  for (const anak of filteredData) {
    const rawJK = String(anak.jenisKelamin || "").trim().toUpperCase();
    const jk: "L" | "P" = rawJK.startsWith("L") ? "L" : "P";
    const rawUsia = (anak as any).usiaBulan ?? (anak as any).umurBulan ?? 0;
    const usiaNum = typeof rawUsia === "number" ? rawUsia : parseInt(String(rawUsia), 10);

    reportItems.push({
      no: counter++,
      namaAnak: anak.nama || "Tanpa Nama",
      usiaBulan: isNaN(usiaNum) ? 0 : usiaNum,
      jenisKelamin: jk,
      beratBadan: Number(anak.beratBadan) || 0,
      tinggiBadan: Number(anak.tinggiBadan) || 0,
      zScoreBBU: parseZScoreSafe(anak.zScoreBBU),
      zScoreTBU: parseZScoreSafe(anak.zScoreTBU),
      zScoreBBTB: parseZScoreSafe(anak.zScoreBBTB),
      statusGizi: anak.statusGizi || "Normal",
      tanggalPengukuran:
        anak.tanggalPeriksa || new Date().toISOString().split("T")[0],
    });
  }

  // 4. Generate Tanggal Cetak & PDF Buffer
  const now = new Date();
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
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
  const filename = `rekap-gizi-mekar-sari-${months[now.getMonth()].toLowerCase()}-${now.getFullYear()}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-cache",
    },
  });
}

// Handler POST: Menerima data dinamis dari localStorage client
export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Payload JSON tidak valid" },
        { status: 400 },
      );
    }

    if (!body || !Array.isArray(body.data)) {
      return NextResponse.json(
        { error: "Data balita harus berupa array valid" },
        { status: 400 },
      );
    }

    const records: AnakRecord[] = body.data;
    const filter = typeof body.filter === "string" ? body.filter : "";

    return await generatePdfFromRecords(records, filter);
  } catch (error) {
    console.error("Gagal membuat PDF via POST:", error);
    return NextResponse.json(
      { error: "Gagal membuat dokumen PDF gizi" },
      { status: 500 },
    );
  }
}

// Handler GET: Fallback opsional
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchFilter = searchParams.get("filter") || "";
    return await generatePdfFromRecords(dataAnak, searchFilter);
  } catch (error) {
    console.error("Gagal membuat PDF via GET:", error);
    return NextResponse.json(
      { error: "Gagal membuat dokumen PDF gizi" },
      { status: 500 },
    );
  }
}
