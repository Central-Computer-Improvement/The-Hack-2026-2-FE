# SimGizi — Sistem Informasi & Monitoring Gizi Balita Terintegrasi

<p align="center">
  <strong>Platform Pemantauan Status Antropometri & Deteksi Dini Stunting Balita Berbasis Standar WHO dan Rekomendasi AI</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.0-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Gemini_API-2.5_Flash-4285F4?style=flat-square&logo=google" alt="Gemini API" />
  <img src="https://img.shields.io/badge/PDF_Renderer-4.6.0-FF4154?style=flat-square&logo=adobe-acrobat-reader" alt="React PDF" />
</p>

---

## 1. Tentang Proyek

**SimGizi** merupakan aplikasi web kesehatan yang terintegrasi AI yang dirancang khusus untuk mempermudah tenaga kesehatan, kader Posyandu, dan pengelola program gizi masyarakat dalam melakukan pencatatan antropometri balita (0–59 bulan), evaluasi status gizi secara real-time berbasis tabel referensi resmi WHO / Permenkes RI No. 2 Tahun 2020, deteksi dini risiko stunting, rekomendasi tindak lanjut gizi cerdas berbasis Google Gemini API, serta pelaporan otomatis (Export PDF).

---

## 2. Fitur Utama

- **Dashboard Eksekutif & Ringkasan Indikator Kesehatan**:
  - Kartu metrik total balita, balita gizi normal, total sesi pemeriksaan, dan persentase cakupan gizi sehat.
  - Grafik distribusi status gizi interaktif 4 kategori (Normal, Gizi Kurang, Gizi Buruk, Stunting).
  - Panel Peringatan Dini balita yang memerlukan tindakan intervensi segera.
- **Kalkulasi Z-Score Presisi Standar WHO / Permenkes No. 2 Tahun 2020**:
  - Perhitungan Z-score antropometri lengkap (BB/U, TB/U atau PB/U, BB/TB atau BB/PB) berbasis 730 baris data referensi resmi.
  - Algoritma _Exact Rational Banker's Rounding_ berbasis dekonstruksi bit IEEE 754 dan aritmatika BigInt (murni tanpa toleransi float) yang identik 100% dengan Python 3 `round(val, 2)`.
  - Interpolasi linear otomatis dan penentuan posisi ukur telentang/berdiri.
- **Rekomendasi Analisis AI (Google Gemini API)**:
  - Integrasi server-side API route (`/api/rekomendasi-ai`) memanfaatkan model Google Gemini 2.5 Flash.
  - Guardrail medis ketat: rekomendasi edukatif dihasilkan langsung dari parameter Z-score riil pasien tanpa mengubah diagnosis baku.
  - Fallback aman: jika API key belum dikonfigurasi atau jaringan offline, sistem otomatis menyusun analisis lokal berbasis Z-score nyata sehingga proses penyimpanan data anak tetap aman dan tidak pernah gagal.
- **Pencatatan Data Antropometri Anak**:
  - Validasi formulir real-time (NIK 16 digit unik anti-duplikat, batas umur 0–59 bulan, validasi desimal berat badan dan tinggi badan tanpa fallback fiktif).
  - Feedback notifikasi toast informatif saat form berhasil disimpan atau terjadi input di luar rentang standar.
- **Rekapitulasi Data Gizi & Tabel Responsif**:
  - Arsitektur Dual-Tbody Murni CSS.
  - Pencarian live terpadu (Nama/NIK) dan filter dropdown status gizi.
  - Pagination model kapsul segmented.
- **Riwayat Sesi Pemeriksaan**:
  - Filter interaktif berbasis tanggal pemeriksaan menggunakan Custom DatePicker.
- **Export Laporan PDF Dinamis**:
  - Pembuatan dokumen laporan rekapitulasi data gizi resmi siap cetak langsung dari sisi server via endpoint `@react-pdf/renderer`.
- **Modal Panduan Aturan & Rumus WHO**:
  - Penjelasan matematis rumus Z-Score WHO ($Z = \frac{\text{Nilai Riil} - \text{Median}}{\text{Standar Deviasi}}$) beserta tabel ambang batas deviasi baku.
- **Zero-Blink Dark & Light Mode**:
  - Toggle tema instan bebas kedipan dengan persistensi sinkron via `useSyncExternalStore`.
- **Autentikasi & Proteksi Rute Terpusat**:
  - Sistem pengamanan rute berbasis proxy Next.js (`src/proxy.ts`) dengan cookie sesi `simgizi-auth`.

---

## 3. Tech Stack Frontend

Aplikasi ini dibangun menggunakan arsitektur frontend modern dengan spesifikasi teknologi sebagai berikut:

| Kategori                   | Teknologi                                 | Deskripsi & Kegunaan                                                                                                                                         |
| :------------------------- | :---------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework Inti**         | **Next.js 16.3.0**                        | App Router, Turbopack compiler, Server Components, API Route Handlers, dan Next.js Proxy Middleware.                                                         |
| **UI Library**             | **React 19.2.8**                          | Pustaka antarmuka deklaratif dengan dukungan React Compiler dan Concurrent Features.                                                                         |
| **Bahasa Pemrograman**     | **TypeScript 6.0.3**                      | Strict type safety, custom interface data balita (`AnakRecord`), dan pengecekan tipe kompilasi menyeluruh.                                                   |
| **CSS & Styling**          | **Tailwind CSS v4**                       | Framework utilitas CSS generasi terbaru dengan `@tailwindcss/postcss`, Native CSS Variables, dan variant dark mode `@variant dark`.                          |
| **Kalkulasi Antropometri** | **Custom WHO Z-Score Engine**             | Engine kalkulasi Z-score antropometri 5 indeks (BB/U, PB/U, TB/U, BB/PB, BB/TB) berdasar 730 baris data Permenkes No. 2/2020 dengan Exact Banker's Rounding. |
| **Generative AI**          | **Google Gemini API**                     | Model `gemini-2.5-flash` untuk analisis tindak lanjut edukasi gizi dan deteksi risiko kesehatan balita.                                                      |
| **State Management**       | **Custom Store (`useSyncExternalStore`)** | Arsitektur state terpusat reaktif bebas hidrasi mismatch (`data-anak-store.ts`) dengan memori cache lokal dan listener cross-tab.                            |
| **PDF Generation**         | **@react-pdf/renderer 4.6.0**             | Engine rendering dokumen PDF dinamis sisi server untuk mengunduh rekap data balita terfilter.                                                                |
| **Ikonografi**             | **Lucide React 1.31.0**                   | Paket ikon SVG modern, bersih, dan konsisten (Book, Calendar, Check, Search, Shield, Zap, Sparkles, dll).                                                    |
| **Notifikasi Toast**       | **Sonner 2.0.8**                          | Toast manager ringan dengan custom template badge rounded 14px (Success, Error, Delete).                                                                     |
| **Tipografi**              | **Inter & AG Fonts**                      | Font sans-serif modern yang dioptimalkan untuk keterbacaan data medis dan angka metrik.                                                                      |

---

## 4. Struktur Direktori

```text
SimGizi/
├── .agents/
│   └── AGENTS.md                  # Single Source of Truth: Aturan Desain & Layout Terkunci
├── public/                        # Aset statis & logo
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── export-pdf/        # Endpoint API pembuatan PDF rekap gizi
│   │   │   └── rekomendasi-ai/    # Endpoint API integrasi Google Gemini API
│   │   ├── login/                 # Halaman Autentikasi Pengguna
│   │   ├── pencatatan-anak/       # Halaman Formulir Input Antropometri Balita
│   │   ├── rekap-data-gizi/       # Halaman Rekapitulasi Data & Tabel Analisis
│   │   ├── riwayat-pemeriksaan/   # Halaman Riwayat Sesi Pemeriksaan Posyandu
│   │   ├── layout.tsx             # Root Layout, Font Provider & Toaster
│   │   └── page.tsx               # Halaman Utama (Dashboard Monitoring)
│   ├── components/
│   │   ├── _shared/               # Modal WHO, Detail Dialog, dan Skeletons
│   │   │   └── skeletons/         # SkeletonBase, Table, StatCard, Chart, AlertCard
│   │   ├── charts/                # Komponen Visualisasi Bar Chart Distribusi Gizi
│   │   ├── dashboard/             # HealthSummary dan StuntingAlerts
│   │   ├── forms/                 # CustomDatePicker, CustomSelect, LoginForm
│   │   ├── layouts/               # Sidebar Desktop/Mobile, Topbar, ThemeToggle
│   │   └── pdf/                   # Template Dokumen PDF (LaporanGiziDocument)
│   ├── hooks/                     # Custom Hooks (useTheme, useDataAnak, useHasMounted, useSidebarCollapse)
│   ├── lib/
│   │   ├── data/
│   │   │   └── zscore-reference.json  # 730 baris data referensi antropometri WHO Permenkes 2020
│   │   ├── custom-toast.tsx       # Wrapper notifikasi toast badge custom
│   │   ├── data-anak-store.ts     # Persistent store data anak (localStorage + listeners)
│   │   ├── data-anak.ts           # Data seed master anak dan interface AnakRecord
│   │   └── zscore.ts              # Engine kalkulasi Z-score WHO & Exact Banker's Rounding
│   ├── styles/
│   │   └── globals.css            # Token palet warna, CSS variables, & keyframe anim
│   ├── types/                     # Definisi TypeScript Interface & Data Models
│   └── proxy.ts                   # Next.js 16 Route Guard & Session Proxy
├── .env.local                     # Konfigurasi Environment Variable (Private, diabaikan Git)
├── package.json                   # Konfigurasi dependensi & npm scripts
├── tsconfig.json                  # Konfigurasi TypeScript compiler
└── next.config.mjs                # Konfigurasi Next.js
```

---

## 5. Klasifikasi Standar Status Gizi (WHO / Permenkes No. 2/2020)

SimGizi menerapkan pemetaan Z-Score baku berdasarkan petunjuk teknis antropometri anak:

| Status Gizi     | Ambang Batas Z-Score (SD)                     | Indeks Acuan               |
| :-------------- | :-------------------------------------------- | :------------------------- |
| **Normal**      | $-2.00 \text{ SD} \le Z \le +2.00 \text{ SD}$ | BB/U, TB/U, BB/TB          |
| **Gizi Kurang** | $-3.00 \text{ SD} \le Z < -2.00 \text{ SD}$   | BB/TB (_Wasted_) atau BB/U |
| **Gizi Buruk**  | $Z < -3.00 \text{ SD}$                        | BB/TB (_Severely Wasted_)  |
| **Stunting**    | $Z < -2.00 \text{ SD}$                        | TB/U atau PB/U (_Stunted_) |

---

## 6. Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat Sistem

Pastikan perangkat Anda telah terpasang:

- **Node.js** versi `18.18.0` atau yang lebih baru
- **npm** (atau package manager pilihan: `pnpm` / `yarn`)

### 2. Kloning & Masuk ke Direktori

```bash
git clone https://github.com/Central-Computer-Improvement/The-Hack-2026-2-FE.git
cd The-Hack-2026-2-FE
```

### 3. Konfigurasi Environment Variables

Buat file `.env.local` di root proyek untuk mengaktifkan fitur Rekomendasi AI:

```env
# Google Gemini API Key
GEMINI_API_KEY=AQ...

# (Opsional) Model Gemini Default
GEMINI_MODEL=gemini-2.5-flash
```

_(Catatan: Jika API key belum diisi atau koneksi API terganggu, aplikasi tetap berjalan normal karena dilengkapi mekanisme Fail-Safe agar fitur rekomendasi tetap bisa berjalan)._

### 4. Instalasi Dependensi

```bash
npm install
```

### 5. Menjalankan Server Pengembangan (Development)

```bash
npm run dev
```

Buka browser dan akses `http://localhost:3000`.

### 6. Kompilasi & Build Produksi

Untuk memastikan seluruh kode bebas error dan teroptimasi secara penuh:

```bash
npm run build
npm run start
```

---

## 7. Login Demo

Untuk masuk ke dalam dashboard aplikasi:

- **Username**: `kelompok2`
- **Password**: `simgizi2026`

---
