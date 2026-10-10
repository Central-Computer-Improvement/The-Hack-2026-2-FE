# Dokumen Uji Kasus (Test Case Specification) — SimGizi

**Nama Sistem**: SimGizi (Sistem Terpadu Pemantauan Status Gizi & Deteksi Dini Stunting Balita)  
**Tahun / Versi**: 2026 / Versi 1.0.0 (Production Release)  
**Lingkungan Pengujian**: Next.js 16 (Turbopack), React 19, TypeScript, RabbitMQ (Docker AMQP 5672), Vitest, Playwright/Node  
**Standar Antropometri**: WHO Child Growth Standards & Permenkes RI No. 2 Tahun 2020  
**Kredensial Master Default**: Kata sandi seluruh akun: `simgizi2026`

---

## Ringkasan Eksekusi Pengujian (Test Execution Summary)

| Total Modul | Total Test Case | Status PASS | Status FAIL | Tingkat Keberhasilan |
| :---: | :---: | :---: | :---: | :---: |
| **7 Modul Utama** | **25 Kasus Uji** | **25 (100%)** | **0 (0%)** | **100% Lolos Uji** |

---

## MODUL 1: Autentikasi & Multi-Role Access Control (RBAC)

| ID Test Case | Nama Fitur / Skenario | Pre-Kondisi | Langkah Pengujian | Data Uji | Hasil yang Diharapkan (Expected Result) | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-AUTH-001** | Login Berhasil Role Posyandu | Aplikasi terbuka di `/login`, sesi kosong | 1. Input username Posyandu<br>2. Input kata sandi<br>3. Klik "Masuk" | **Username**: `kelompok2`<br>**Password**: `simgizi2026` | Berhasil login, cookie sesi tersimpan, redirect otomatis ke beranda Posyandu (`/`). | Redirect ke `/`, profil Bidan Sri Wahyuni aktif. | **PASS** |
| **TC-AUTH-002** | Login Berhasil Role Puskesmas | Aplikasi terbuka di `/login`, sesi kosong | 1. Input username Puskesmas<br>2. Input kata sandi<br>3. Klik "Masuk" | **Username**: `puskesmas_bojongsoang`<br>**Password**: `simgizi2026` | Berhasil login, redirect otomatis ke dashboard faskes wilayah (`/puskesmas`). | Redirect ke `/puskesmas`, data Puskesmas Bojongsoang aktif. | **PASS** |
| **TC-AUTH-003** | Login Berhasil Role Orang Tua | Aplikasi terbuka di `/login`, sesi kosong | 1. Input username Orang Tua<br>2. Input kata sandi<br>3. Klik "Masuk" | **Username**: `orangtua_arfan`<br>**Password**: `simgizi2026` | Berhasil login, redirect otomatis ke beranda orang tua (`/orang-tua`). | Redirect ke `/orang-tua`, nama anak terhubung: Muhammad Arfan. | **PASS** |
| **TC-AUTH-004** | Validasi Kredensial Salah | Aplikasi terbuka di `/login` | 1. Masukkan kata sandi salah<br>2. Klik tombol "Masuk" | **Username**: `kelompok2`<br>**Password**: `salah123` | Sistem menolak akses, menampilkan pesan error *"Kata sandi tidak valid."*, tetap di `/login`. | Pesan error muncul, sesi tidak dibuat (HTTP 401). | **PASS** |
| **TC-AUTH-005** | Pencegahan Akses Lintas Role (Route Guard) | Login sebagai `orangtua_arfan` | 1. Ketik URL `/pencatatan-anak` di address bar browser<br>2. Tekan Enter | Rute privat kader faskes | Middleware/Proxy mencegat akses, redirect otomatis kembali ke `/orang-tua`. | Tercegat dan dialihkan ke `/orang-tua`. | **PASS** |
| **TC-AUTH-006** | Logout & Penghapusan Sesi | Pengguna dalam status login | 1. Klik tombol "Keluar" di profil topbar/sidebar | Sesi aktif | Cookie `simgizi-auth` dan token dihapus, dialihkan ke `/login`. | Cookie terhapus, rute terlindungi tidak dapat diakses. | **PASS** |

---

## MODUL 2: Pencatatan Balita & Engine Z-Score WHO Permenkes 2020

| ID Test Case | Nama Fitur / Skenario | Pre-Kondisi | Langkah Pengujian | Data Uji | Hasil yang Diharapkan (Expected Result) | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-ZSC-001** | Validasi Panjang NIK & Batas Usia | Login sebagai Posyandu di `/pencatatan-anak` | 1. Input NIK < 16 digit<br>2. Input Usia > 59 bulan<br>3. Klik submit | **NIK**: `12345`<br>**Usia**: `65 bulan` | Form menampilkan border merah dan pesan validasi: *"NIK wajib 16 digit"* dan *"Usia maksimal 59 bulan"*. | Submit dicegah, error Zod ditampilkan. | **PASS** |
| **TC-ZSC-002** | Perhitungan Z-Score Baku Permenkes (Baseline) | Login sebagai Posyandu di `/pencatatan-anak` | 1. Input data anak laki-laki usia 30 bulan<br>2. BB: 10.5 kg, TB: 85.0 cm<br>3. Hitung Z-Score | **Anak**: Laki-laki<br>**Usia**: 30 bln<br>**BB**: 10.5 kg<br>**TB**: 85.0 cm | Engine Exact Rational Banker's Rounding menghasilkan:<br>• BB/U: **`-1.87 SD`**<br>• TB/U: **`-2.03 SD`**<br>• BB/TB: **`-1.33 SD`** | Hasil perhitungan identik 100% dengan standar rujukan Permenkes. | **PASS** |
| **TC-ZSC-003** | Klasifikasi Status Gizi Stunting | Input balita dengan TB/U < -2.00 SD | 1. Masukkan pengukuran Arfan<br>2. Usia 28 bulan, TB 78.5 cm | **Usia**: 28 bln, TB 78.5 cm (TB/U: `-3.10 SD`) | Sistem mengklasifikasikan status gizi utama: **`Stunting`** (Badge merah). | Status gizi: Stunting, badge `#ef4444`. | **PASS** |
| **TC-ZSC-004** | Klasifikasi Status Gizi Buruk (Severely Wasted) | Input balita dengan BB/TB < -3.00 SD | 1. Masukkan pengukuran Aisyah<br>2. Usia 14 bulan, BB 7.2 kg, TB 71.0 cm | **BB/TB**: `-3.25 SD` | Sistem menetapkan status gizi utama: **`Gizi Buruk`** (Badge oranye pekat). | Status gizi: Gizi Buruk, rekomendasi F-75/F-100. | **PASS** |
| **TC-ZSC-005** | Rekomendasi AI & Fail-Safe Fallback Lokal | Endpoint `/api/rekomendasi-ai` aktif / offline | 1. Simpan hasil penimbangan balita berisiko stunting | Balita status Stunting | Jika Gemini API aktif: analisis naratif kontekstual muncul. Jika offline: analisis lokal otomatis mengisi tanpa error simpan. | Data balita tersimpan sukses dengan rekomendasi klinis terpadu. | **PASS** |

---

## MODUL 3: Pembaruan Data Balita & Penimbangan Ulang (CRUD Update)

| ID Test Case | Nama Fitur / Skenario | Pre-Kondisi | Langkah Pengujian | Data Uji | Hasil yang Diharapkan (Expected Result) | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-UPD-001** | Pemulihan Status Stunting Menjadi Normal | Data anak `Muhammad Arfan` berstatus Stunting | 1. Buka `/pencatatan-anak`<br>2. Masukkan NIK `3201948392010001`<br>3. Input TB baru 88.5 cm (naik dari 78.5 cm)<br>4. Simpan penimbangan | **TB Baru**: 88.5 cm<br>**BB Baru**: 12.5 kg<br>**Usia**: 28 bln | Nilai Z-Score TB/U naik menjadi $\ge -2.00\text{ SD}$. Status balita otomatis diperbarui dari **`Stunting`** menjadi **`Normal`**. | Status terupdate menjadi Normal, badge hijau tampil di rekap. | **PASS** |
| **TC-UPD-002** | Akumulasi Riwayat Penimbangan | Data anak memiliki penimbangan sebelumnya | 1. Buka menu `/riwayat-pemeriksaan`<br>2. Periksa riwayat anak | **NIK**: `3201948392010001` | Seluruh rekaman penimbangan dari bulan ke bulan tersimpan urut secara kronologis. | Rekaman pemeriksaan bertambah tanpa menimpa data lama. | **PASS** |

---

## MODUL 4: Alur Rujukan Terpadu (Posyandu & Puskesmas)

| ID Test Case | Nama Fitur / Skenario | Pre-Kondisi | Langkah Pengujian | Data Uji | Hasil yang Diharapkan (Expected Result) | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-RJK-001** | Posyandu Mengajukan Rujukan Medis | Balita teridentifikasi stunting/gizi buruk | 1. Buka tab `/rujukan`<br>2. Pilih anak dan masukkan catatan rujukan<br>3. Klik "Ajukan Rujukan" | **Anak**: Muhammad Arfan<br>**Catatan**: *"TB/U -3.10 SD, perlu PMT"* | Rujukan tersimpan dengan status `diajukan`. Notifikasi rujukan baru terkirim ke Puskesmas. | Rujukan terbentuk, ID rujukan baru terbit di database lokal. | **PASS** |
| **TC-RJK-002** | Puskesmas Menerima & Meninjau Rujukan | Login sebagai `puskesmas_bojongsoang` | 1. Buka menu `/puskesmas/rujukan`<br>2. Cari rujukan berstatus `diajukan` | Rujukan ID baru | Puskesmas melihat rujukan masuk lengkap dengan identitas anak, asal posyandu, dan grafik Z-score. | Data rujukan tampil di antrean verifikasi faskes. | **PASS** |
| **TC-RJK-003** | Tindak Lanjut Rujukan oleh Puskesmas | Rujukan berstatus `diajukan` / `diterima` | 1. Klik tombol "Tindak Lanjuti"<br>2. Input catatan tindakan medis<br>3. Klik Simpan | **Catatan**: *"Diberikan PMT tinggi protein & edukasi MPASI"* | Status rujukan diperbarui menjadi `ditindaklanjuti`. Notifikasi pembaruan terkirim ke Orang Tua. | Status berubah di tabel, riwayat tindakan tercatat. | **PASS** |
| **TC-RJK-004** | Penolakan Rujukan dengan Alasan Wajib | Rujukan masuk dengan data tidak sesuai | 1. Pilih opsi "Tolak"<br>2. Kosongkan alasan penolakan<br>3. Klik Simpan | Form alasan kosong | Sistem menolak proses update dengan pesan: *"Alasan penolakan rujukan wajib diisi."* (HTTP 400). | Validasi berhasil memblokir penolakan tanpa alasan. | **PASS** |

---

## MODUL 5: Dashboard Orang Tua & Monitoring Perkembangan

| ID Test Case | Nama Fitur / Skenario | Pre-Kondisi | Langkah Pengujian | Data Uji | Hasil yang Diharapkan (Expected Result) | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-ORT-001** | Klaim Profil Balita via Kode Unik | Login sebagai `orangtua_arfan`, belum klaim anak kedua | 1. Buka menu `/orang-tua/klaim`<br>2. Masukkan kode klaim dan tgl lahir balita<br>3. Klik "Klaim Data Anak" | **Kode Klaim**: `ARFN2026`<br>**Tgl Lahir**: `2024-04-12` | Sistem memvalidasi kode klaim. Profil balita terhubung ke akun orang tua. | Balita berhasil terhubung ke akun orang tua. | **PASS** |
| **TC-ORT-002** | Visualisasi Kurva Pertumbuhan WHO | Balita sudah memiliki data pengukuran | 1. Buka menu `/orang-tua/perkembangan`<br>2. Pilih tab TB/U atau BB/U | Titik ukur anak riil | Grafik kurva interaktif menampilkan pita standar WHO (Median, -2 SD, -3 SD) dan titik tumbuh kembang anak. | Kurva WHO ter-render presisi tanpa error visual. | **PASS** |
| **TC-ORT-003** | Penerimaan Notifikasi di Topbar | Terdapat pembaruan status atau hasil ukur | 1. Amati ikon lonceng pada topbar orang tua<br>2. Klik ikon lonceng | Notifikasi terkirim | Badge jumlah notifikasi belum dibaca muncul, popover menampilkan pesan rujukan dan saran gizi. | Notifikasi rujukan dan gizi muncul di topbar. | **PASS** |

---

## MODUL 6: Message Broker Terdistribusi (RabbitMQ & 3 Consumers)

| ID Test Case | Nama Fitur / Skenario | Pre-Kondisi | Langkah Pengujian | Data Uji | Hasil yang Diharapkan (Expected Result) | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-MB-001** | Penerbitan Event Pengukuran Baru | Container Docker RabbitMQ aktif | 1. Simpan pengukuran di `/pencatatan-anak`<br>2. Pantau pengiriman pesan | Routing key `pengukuran.created` | Event diterbitkan ke Exchange `simgizi.events` dengan payload terstandarisasi `BaseEventPayload`. | Event berhasil diterbitkan ke broker AMQP. | **PASS** |
| **TC-MB-002** | Konsumsi oleh Consumer 1 (Puskesmas Triage) | Worker daemon `npm run worker` berjalan | 1. Terbitkan event anak stunting | Antrean `simgizi.puskesmas.triage` | Consumer 1 menerima pesan dan mencetak log peringatan dini triage medis kasus stunting. | Log triage muncul di terminal worker: `[Consumer 1 - Puskesmas Triage]`. | **PASS** |
| **TC-MB-003** | Konsumsi oleh Consumer 2 (Notifikasi Ortu) | Worker daemon berjalan | 1. Terbitkan event pengukuran / rujukan | Antrean `simgizi.orangtua.notifikasi` | Consumer 2 menerima pesan dan memformat notifikasi perkembangan balita untuk orang tua. | Log orang tua muncul: `[Consumer 2 - Notifikasi Orang Tua]`. | **PASS** |
| **TC-MB-004** | Konsumsi oleh Consumer 3 (Audit Dinkes) | Worker daemon berjalan | 1. Terbitkan sembarang event | Antrean `simgizi.audit.laporan` (Wildcard `#`) | Consumer 3 menerima seluruh topik event dan mencatat jejak audit waktu dan produsen data. | Log audit muncul: `[Consumer 3 - Audit Dinkes]`. | **PASS** |
| **TC-MB-005** | Penerbitan & Konsumsi Event Update Rujukan | Rujukan diperbarui Puskesmas | 1. Dokter update status rujukan | Routing key `rujukan.updated` | Event diterbitkan ke broker, didistribusikan ke antrean Orang Tua dan Audit. | Event diproses oleh antrean orang tua dan audit. | **PASS** |
| **TC-MB-006** | Ketahanan Fail-Safe saat Broker Offline | Container RabbitMQ dimatikan sementara | 1. Input data anak di web SimGizi<br>2. Amati respon UI dan server | Broker connection unreachable | Aplikasi web SimGizi **TIDAK CRASH/ERROR 500**. Data tetap tersimpan secara lokal dengan peringatan konsol aman. | HTTP 201 Created sukses, fail-safe berjalan sempurna. | **PASS** |
| **TC-MB-007** | Endpoint Health Check `/api/broker/status` | Server web SimGizi aktif | 1. Akses `GET /api/broker/status` via browser/curl | Endpoint monitoring | Menampilkan status koneksi broker, nama exchange, dan statistik antrean 3 consumer. | Mengembalikan JSON `{ connected: true, queues: { ... } }`. | **PASS** |

---

## MODUL 7: Rekapitulasi Data, Filtering, & Ekspor Laporan Resmi (PDF)

| ID Test Case | Nama Fitur / Skenario | Pre-Kondisi | Langkah Pengujian | Data Uji | Hasil yang Diharapkan (Expected Result) | Hasil Aktual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-RPT-001** | Pencarian Cepat NIK & Nama Balita | Berada di halaman `/rekap-data-gizi` | 1. Masukkan kata kunci pencarian di kolom search bar | Kata kunci: `Arfan` atau `3201948392010001` | Tabel memfilter data secara instan hanya menampilkan data balita yang cocok. | Hasil pencarian instan dan akurat. | **PASS** |
| **TC-RPT-002** | Filter Multi-Kategori Status Gizi | Berada di halaman `/rekap-data-gizi` | 1. Buka dropdown Filter Status<br>2. Pilih "Stunting" | Filter status: `Stunting` | Tabel hanya menampilkan balita berstatus stunting. | Daftar balita tersaring sesuai filter yang dipilih. | **PASS** |
| **TC-RPT-003** | Ekspor Laporan Resmi Berformat PDF | Terdapat data rekap balita di sistem | 1. Klik tombol "Unduh Laporan" di pojok kanan atas | Dokumen Rekapitulasi Gizi | Sistem menghasilkan dokumen PDF resmi lengkap dengan kop instansi, tabel balita, Z-Score, dan ttd faskes. | File PDF berhasil diunduh dan dapat dibuka secara utuh. | **PASS** |

---

## Matriks Pelaksana & Lingkungan Pengujian

- **Eksekutor Pengujian**: Tim Pengembang SimGizi (Central Computer Improvement)
- **Framework Otomasi**: Vitest (`npm test -- --run`) $\rightarrow$ **4 test suite (24 unit tests passed)**
- **Skrip Simulasi Broker**: `npm run test:broker` $\rightarrow$ **3/3 events transmitted and acknowledged**
- **Docker Compose Status**: `simgizi-rabbitmq` (RabbitMQ 3 Management Alpine, Ports 5672 & 15672) $\rightarrow$ **Up & Running**
- **Kesimpulan Akhir**: Seluruh 25 kasus uji pada dokumen ini telah diuji dan dinyatakan **MEMENUHI SELURUH SPESIFIKASI (PASSED)**.
