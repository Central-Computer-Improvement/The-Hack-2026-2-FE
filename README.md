# SimGizi — Sistem Informasi & Monitoring Gizi Balita Terintegrasi

<p align="center">
  <strong>Platform Pemantauan Status Antropometri & Deteksi Dini Stunting Balita Berbasis Standar WHO</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.0-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PDF_Renderer-4.6.0-FF4154?style=flat-square&logo=adobe-acrobat-reader" alt="React PDF" />
</p>

---

## 1. Tentang Proyek

**SimGizi** adalah aplikasi web yang dirancang khusus untuk mempermudah tenaga kesehatan, kader Posyandu, dan pengelola program gizi masyarakat dalam melakukan pencatatan antropometri, evaluasi status gizi secara real-time berdasarkan standar Z-Score WHO, deteksi dini risiko stunting, serta pelaporan otomatis (Export PDF).

Aplikasi ini dibangun dengan antarmuka yang presisi (_pixel-perfect_), performa instan (_zero-blink navigation_), dan adaptasi layar cerdas baik untuk mode laptop padat (_zero-scroll viewport_) maupun monitor desktop luas.

---

## 2. Fitur Utama

- **Dashboard Eksekutif & Ringkasan Indikator Kesehatan**:
  - Kartu metrik total balita, balita gizi normal, total sesi pemeriksaan, dan persentase cakupan gizi sehat.
  - Grafik distribusi status gizi interaktif 4 kategori (Normal, Gizi Kurang, Gizi Buruk, Stunting).
  - Panel Peringatan Dini balita yang membutuhkan tindakan intervensi segera.
- **Pencatatan Data Antropometri Anak**:
  - Validasi formulir real-time (NIK 16 digit unik anti-duplikat, batas umur 0–59 bulan, validasi angka desimal berat badan dan tinggi badan).
  - Klasifikasi status gizi otomatis menggunakan kalkulasi standar WHO.
- **Rekapitulasi Data Gizi & Tabel Responsif**:
  - Arsitektur Dual-Tbody Murni CSS (3 baris per halaman untuk Laptop `< 850px`, 8 baris per halaman untuk Monitor `≥ 850px`).
  - Pencarian live terpadu (Nama/NIK) dan filter dropdown status gizi.
  - Pagination model kapsul segmented `[ < ] [ N ] [ > ]` dengan fitur jump-to-page.
- **Riwayat Sesi Pemeriksaan**:
  - Filter interaktif berbasis tanggal pemeriksaan menggunakan Custom DatePicker.
- **Export Laporan PDF Dinamis**:
  - Pembuatan dokumen laporan rekapitulasi data gizi resmi siap cetak langsung dari sisi server via endpoint `@react-pdf/renderer`.
- **Modal Panduan Aturan & Rumus WHO**:
  - Penjelasan matematis rumus Z-Score WHO ($Z = \frac{\text{Nilai Riil} - \text{Median}}{\text{Standar Deviasi}}$) beserta tabel ambang batas deviasi.
- **Zero-Blink Dark & Light Mode**:
  - Toggle tema instan bebas kedipan dengan persistensi sinkron via `useSyncExternalStore`.
- **Autentikasi & Proteksi Rute Terpusat**:
  - Sistem pengamanan rute berbasis proxy Next.js (`src/proxy.ts`) dengan cookie sesi `simgizi-auth`.

---

## 3. Tech Stack Frontend

Aplikasi ini dibangun menggunakan arsitektur frontend modern dengan spesifikasi teknologi sebagai berikut:

| Kategori               | Teknologi                                 | Deskripsi & Kegunaan                                                                                                                |
| :--------------------- | :---------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| **Framework Inti**     | **Next.js 16.3.0**                        | App Router, Turbopack compiler, Server Components, API Route Handlers, dan Next.js Proxy Middleware.                                |
| **UI Library**         | **React 19.2.8**                          | Pustaka antarmuka deklaratif dengan dukungan React Compiler dan Concurrent Features.                                                |
| **Bahasa Pemrograman** | **TypeScript 6.0.3**                      | Strict type safety, custom interface data balita (`AnakRecord`), dan pengecekan tipe kompilasi menyeluruh.                          |
| **CSS & Styling**      | **Tailwind CSS v4**                       | Framework utilitas CSS generasi terbaru dengan `@tailwindcss/postcss`, Native CSS Variables, dan variant dark mode `@variant dark`. |
| **State Management**   | **Custom Store (`useSyncExternalStore`)** | Arsitektur state terpusat reaktif bebas hidrasi mismatch (`data-anak-store.ts`) dengan memori cache lokal dan listener cross-tab.   |
| **PDF Generation**     | **@react-pdf/renderer 4.6.0**             | Engine rendering dokumen PDF dinamis sisi server untuk mengunduh rekap data balita terfilter.                                       |
| **Ikonografi**         | **Lucide React 1.31.0**                   | Paket ikon SVG modern, bersih, dan konsisten (Book, Calendar, Check, Search, Shield, Zap, dll).                                     |
| **Notifikasi Toast**   | **Sonner 2.0.8**                          | Toast manager ringan dengan custom template badge rounded 14px (Success, Error, Delete).                                            |
| **Tipografi**          | **Inter & AG Fonts**                      | Font sans-serif modern yang dioptimalkan untuk keterbacaan data medis dan angka metrik.                                             |

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
│   │   │   └── export-pdf/        # Endpoint API pembuatan PDF rekap gizi
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
│   ├── lib/                       # Store data, custom toast, data master antropometri
│   ├── styles/
│   │   └── globals.css            # Token palet warna, CSS variables, & keyframe anim
│   ├── types/                     # Definisi TypeScript Interface & Data Models
│   └── proxy.ts                   # Next.js 16 Route Guard & Session Proxy
├── package.json                   # Konfigurasi dependensi & npm scripts
├── tsconfig.json                  # Konfigurasi TypeScript compiler
└── next.config.mjs                # Konfigurasi Next.js
```

---

## 5. Klasifikasi Standar Status Gizi (WHO)

SimGizi menerapkan pemetaan Z-Score baku berdasarkan petunjuk teknis antropometri anak:

| Status Gizi     | Ambang Batas Z-Score (SD)                     | Kode Warna Light Mode        | Kode Warna Dark Mode            |
| :-------------- | :-------------------------------------------- | :--------------------------- | :------------------------------ |
| **Normal**      | $-2.00 \text{ SD} \le Z \le +2.00 \text{ SD}$ | `#368364` (Badge: `#eaf5ec`) | `#368364` (Badge: `#064e3b/40`) |
| **Gizi Kurang** | $-3.00 \text{ SD} \le Z < -2.00 \text{ SD}$   | `#FFEA00` (Badge: `#fef6dc`) | `#FFEA00` (Badge: `#332b00`)    |
| **Gizi Buruk**  | $Z < -3.00 \text{ SD}$ (BB/U atau BB/TB)      | `#FFA382` (Badge: `#fff0eb`) | `#FFA382` (Badge: `#3a1d17`)    |
| **Stunting**    | $Z < -2.00 \text{ SD}$ (TB/U)                 | `#ef4444` (Badge: `#fde8e8`) | `#ef4444` (Badge: `#3b1212`)    |

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

### 3. Instalasi Dependensi

```bash
npm install
```

### 4. Menjalankan Server Pengembangan (Development)

```bash
npm run dev
```

Buka browser dan akses `http://localhost:3000`.

### 5. Kompilasi & Build Produksi

Untuk memastikan seluruh kode bebas error dan teroptimasi secara penuh:

```bash
npm run build
npm run start
```

---

## 7. Kredensial Uji Coba (Demo Access)

Untuk masuk ke dalam dashboard aplikasi:

- **Username**: _(dapat diisi nama pengguna atau identitas penguji apa saja)_
- **Password**: _(minimal 4 karakter)_

---

## 8. Lisensi

Proyek ini dikembangkan untuk keperluan kompetisi dan pengembangan sistem kesehatan masyarakat digital. Hak cipta dilindungi undang-undang.
