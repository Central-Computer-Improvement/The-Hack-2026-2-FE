import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { pdfStyles as styles } from "./pdfStyles";

export interface ReportItem {
  no: number;
  namaAnak: string;
  usiaBulan: number;
  jenisKelamin: "L" | "P";
  beratBadan: number;
  tinggiBadan: number;
  zScoreBBU: number;
  zScoreTBU: number;
  zScoreBBTB: number;
  statusGizi: string;
  tanggalPengukuran: string;
}

export interface LaporanGiziDocumentProps {
  namaPosyandu?: string;
  namaDinas?: string;
  namaKecamatan?: string;
  alamat?: string;
  alamatSekretariat?: string;
  periode?: string;
  tanggalCetak?: string;
  namaKepala?: string;
  nipKepala?: string;
  items: ReportItem[];
}

const getRealTimeIndonesianDate = () => {
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
  return {
    tanggal: `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
    periode: `${months[now.getMonth()]} ${now.getFullYear()}`,
  };
};

export const LaporanGiziDocument: React.FC<LaporanGiziDocumentProps> = ({
  namaPosyandu = "POSYANDU MEKAR SARI 01",
  namaDinas = "DINAS KESEHATAN KOTA BANDUNG",
  namaKecamatan = "KECAMATAN BOJONGSOANG - KOTA BANDUNG",
  alamat = "Jl. Sukabirus No. 123, Bojongsoang, Kota Bandung | Telp: (022) 2501234",
  periode,
  tanggalCetak,
  namaKepala = "Dr. Hj. Syahla Mutiara Latifah, M.Kes",
  nipKepala = "19780512 200501 2 004",
  items = [],
}) => {
  const realTime = getRealTimeIndonesianDate();
  const displayTanggalCetak = tanggalCetak || realTime.tanggal;
  const displayPeriode = periode || realTime.periode;
  // Hitung statistik ringkasan
  const totalAnak = items.length;
  const countStunting = items.filter(
    (i) => i.statusGizi.toLowerCase() === "stunting",
  ).length;
  const countBerisiko = items.filter(
    (i) => i.statusGizi.toLowerCase() === "berisiko",
  ).length;
  const countNormal = totalAnak - countStunting - countBerisiko;

  return (
    <Document title={`Laporan Rekap Data Gizi - ${namaPosyandu} Kota Bandung`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* 1. KOP SURAT RESMI KOTA BANDUNG */}
        <View style={styles.kopContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.kopLine1}>{namaPosyandu}</Text>
            <Text style={styles.kopLine2}>{namaDinas}</Text>
            <Text
              style={styles.kopLine3}
            >{`${namaKecamatan} | ${alamat}`}</Text>
          </View>
        </View>

        {/* Garis Pembatas Kop Surat Hitam Resmi */}
        <View style={styles.kopDividerThick} />
        <View style={styles.kopDividerThin} />

        {/* 2. JUDUL LAPORAN */}
        <View style={styles.titleContainer}>
          <Text style={styles.reportTitle}>
            LAPORAN REKAPITULASI DATA GIZI BALITA
          </Text>
          <Text style={styles.reportSubTitle}>
            {`${namaPosyandu} — Periode ${displayPeriode}`}
          </Text>
        </View>

        {/* 3. TABEL MONOKROM HITAM PUTIH RESMI */}
        <View style={styles.table}>
          {/* Table Header (fixed=true) */}
          <View style={styles.tableHeader} fixed>
            <Text style={[styles.tableHeaderCell, styles.colNo]}>No</Text>
            <Text style={[styles.tableHeaderCell, styles.colNama]}>
              Nama Anak
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colUsia]}>
              Usia (bln)
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colJK]}>JK</Text>
            <Text style={[styles.tableHeaderCell, styles.colBB]}>BB (kg)</Text>
            <Text style={[styles.tableHeaderCell, styles.colTB]}>TB (cm)</Text>
            <Text style={[styles.tableHeaderCell, styles.colZBBU]}>
              Z-Score BB/U
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colZTBU]}>
              Z-Score TB/U
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colZBBTB]}>
              Z-Score BB/TB
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colStatus]}>
              Status Gizi
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colTgl]}>
              Tgl Periksa
            </Text>
          </View>

          {/* Table Rows (Seragam Hitam Putih) */}
          {items.map((item, index) => {
            const statusLower = item.statusGizi.toLowerCase();
            const isStunting = statusLower === "stunting";
            const isBerisiko = statusLower === "berisiko";

            return (
              <View key={index} style={styles.tableRow} wrap={false}>
                <Text style={[styles.tableCell, styles.colNo]}>{item.no}</Text>
                <Text style={[styles.tableCell, styles.colNama]}>
                  {item.namaAnak}
                </Text>
                <Text style={[styles.tableCell, styles.colUsia]}>
                  {item.usiaBulan}
                </Text>
                <Text style={[styles.tableCell, styles.colJK]}>
                  {item.jenisKelamin}
                </Text>
                <Text style={[styles.tableCell, styles.colBB]}>
                  {item.beratBadan.toFixed(1)}
                </Text>
                <Text style={[styles.tableCell, styles.colTB]}>
                  {item.tinggiBadan.toFixed(1)}
                </Text>
                <Text style={[styles.tableCell, styles.colZBBU]}>
                  {item.zScoreBBU.toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.colZTBU]}>
                  {item.zScoreTBU.toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.colZBBTB]}>
                  {item.zScoreBBTB.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    styles.colStatus,
                    {
                      fontWeight: isStunting || isBerisiko ? "bold" : "normal",
                      color: "#000000", // Murni hitam (tanpa warna)
                    },
                  ]}
                >
                  {item.statusGizi}
                </Text>
                <Text style={[styles.tableCell, styles.colTgl]}>
                  {item.tanggalPengukuran}
                </Text>
              </View>
            );
          })}
        </View>

        {/* 4. BLOK TANDA TANGAN RESMI KOTA BANDUNG */}

        {/* 5. BLOK TANDA TANGAN RESMI KOTA BANDUNG */}
        <View style={styles.ttdContainer} wrap={false}>
          <View style={styles.ttdBox}>
            <Text
              style={styles.ttdText}
            >{`Kota Bandung, ${displayTanggalCetak}`}</Text>
            <Text style={styles.ttdText}>Mengetahui,</Text>
            <Text style={styles.ttdText}>Kepala Posyandu</Text>
            <View style={styles.ttdSpacer} />
            <Text style={styles.ttdNama}>{namaKepala}</Text>
            <Text style={styles.ttdNip}>{`NIP. ${nipKepala}`}</Text>
          </View>
        </View>

        {/* 6. FOOTER HALAMAN */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Halaman ${pageNumber} dari ${totalPages} — SimGizi System (Kota Bandung)`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default LaporanGiziDocument;
