# Panduan Pengujian Satu Alur Lengkap (End-to-End Testing) — SimGizi

Dokumen ini adalah **panduan pengujian langsung dalam satu garis lurus (1 Alur Berurutan)** tanpa terpisah-pisah. Anda cukup mengikuti **Langkah 1 sampai Langkah 10** secara berurutan untuk menguji seluruh sistem: dari **Posyandu**, diteruskan ke **Puskesmas**, masuk ke **Orang Tua**, hingga verifikasi **Message Broker (RabbitMQ)**.

---

## 📋 Ringkasan Alur Cerita Pengujian
> **Kasus yang Diuji**: Pasien balita bernama **Muhammad Arfan** (usia 28 bulan, terindikasi stunting).
> 
> `1. Posyandu input penimbangan Arfan` ➔ `2. Posyandu cek rujukan` ➔ `3. Puskesmas triage Arfan` ➔ `4. Puskesmas beri tindakan dokter` ➔ `5. Orang Tua terima notifikasi & cek kurva WHO`.

---

## ⚡ Prasyarat: Pastikan 2 Terminal Ini Sedang Berjalan
1. **Terminal 1**: `npm run dev` (Aplikasi web berjalan di [http://localhost:3000](http://localhost:3000))
2. **Terminal 2**: `npm run worker` (Daemon 3 Consumer RabbitMQ aktif mendengarkan pesan)
*(Container Docker `simgizi-rabbitmq` sudah aktif)*

---

# 🚀 LANGKAH PENGUJIAN 1 ALUR LURUS (STEP-BY-STEP)

### 🟢 TAHAP 1: DI POSYANDU (Input Penimbangan & Deteksi Dini)

#### Langkah 1: Login sebagai Kader Posyandu
1. Buka browser: [http://localhost:3000/login](http://localhost:3000/login)
2. Masukkan akun:
   - **Username**: `kelompok2`
   - **Password**: `simgizi2026`
3. Klik tombol **"Masuk"** ➔ Masuk ke Dashboard Posyandu Melati 03.

#### Langkah 2: Input Penimbangan Balita Muhammad Arfan
1. Di sidebar kiri, klik menu **"Pencatatan Data Anak"** ([http://localhost:3000/pencatatan-anak](http://localhost:3000/pencatatan-anak)).
2. Masukkan data penimbangan Arfan persis seperti ini:
   - **Nama Balita**: `Muhammad Arfan`
   - **NIK (16 Digit)**: `3201948392010001`
   - **Nama Orang Tua**: `Rahmat Hidayat`
   - **Jenis Kelamin**: Pilih **Laki-laki**
   - **Umur (Bulan)**: `28`
   - **Berat Badan (kg)**: `10.1`
   - **Tinggi Badan (cm)**: `78.5`
   - **Alamat**: `Jl. Sukabirus No. 14, RT 02/03`
3. Klik tombol hijau di bawah: **"Tambah data balita"**.
4. **Apa yang terlihat di layar**:
   - Muncul notifikasi toast hijau: *"Data Balita berhasil ditambahkan"*.
   - Status gizi terhitung otomatis: **`Stunting`** (Z-Score TB/U: `-3.10 SD`).
5. **Cek Terminal `npm run worker` Anda**:
   Consumer langsung mencatat:
   `[Consumer 1 - Puskesmas Triage] [Peringatan Dini Epidemiologi] Kasus STUNTING: Muhammad Arfan (TB/U: -3.10 SD)`

#### Langkah 3: Periksa Daftar Rujukan Posyandu
1. Di sidebar kiri, klik menu **"Rujukan"** ([http://localhost:3000/rujukan](http://localhost:3000/rujukan)).
2. Anda melihat tiket rujukan pasien **Muhammad Arfan** sudah terkirim ke Puskesmas Bojongsoang dengan status **`Diajukan`**.
3. Klik tombol profil di kanan atas, pilih **"Keluar"** (Logout).

---

### 🔵 TAHAP 2: DI PUSKESMAS (Triage Medis & Resep Tindakan Dokter)

#### Langkah 4: Login sebagai Dokter Puskesmas
1. Buka halaman login: [http://localhost:3000/login](http://localhost:3000/login)
2. Masukkan akun:
   - **Username**: `puskesmas_bojongsoang`
   - **Password**: `simgizi2026`
3. Klik tombol **"Masuk"** ➔ Anda masuk ke Dashboard Puskesmas Bojongsoang.

#### Langkah 5: Cek Triage Kasus Arfan
1. Di sidebar kiri, klik menu **"Balita Berisiko"** ([http://localhost:3000/puskesmas/balita-berisiko](http://localhost:3000/puskesmas/balita-berisiko)).
2. Anda melihat nama **Muhammad Arfan** otomatis masuk ke dalam daftar pengawasan **Prioritas 2 (Stunting)** faskes.

#### Langkah 6: Terima & Tindak Lanjut Rujukan Arfan
1. Di sidebar kiri, klik menu **"Rujukan"** ([http://localhost:3000/puskesmas/rujukan](http://localhost:3000/puskesmas/rujukan)).
2. Pada tabel rujukan, cari nama **Muhammad Arfan** (status `Diajukan`):
   - **Aksi 1**: Klik tombol **"Terima"** ➔ Status rujukan berubah menjadi **`Diterima`**.
   - **Aksi 2**: Klik tombol **"Tindak Lanjut"** ➔ Muncul modal popup catatan dokter.
   - Ketikkan catatan tindakan medis:
     > *"Pemeriksaan poli gizi anak selesai. Diberikan paket PMT Pemulihan biskuit tinggi protein, multivitamin zat besi, dan konseling MPASI kepada orang tua. Jadwal kontrol ulang 14 hari ke depan."*
   - Klik tombol **"Simpan Tindakan"**.
3. **Apa yang terlihat di layar**:
   - Status rujukan Muhammad Arfan berubah menjadi **`Ditindaklanjuti`**.
   - Muncul notifikasi toast: *"Status rujukan berhasil diubah menjadi ditindaklanjuti"*.
4. **Cek Terminal `npm run worker` Anda**:
   Event `rujukan.updated` otomatis terkirim:
   `[Consumer 2 - Notifikasi Orang Tua] Status rujukan Muhammad Arfan diperbarui menjadi: DITINDAKLANJUTI`
5. Klik tombol profil di kanan atas, pilih **"Keluar"** (Logout).

---

### 🟣 TAHAP 3: DI ORANG TUA (Cek Notifikasi & Kurva Tumbuh Kembang WHO)

#### Langkah 7: Login sebagai Orang Tua Arfan
1. Buka halaman login: [http://localhost:3000/login](http://localhost:3000/login)
2. Masukkan akun orang tua Arfan:
   - **Username**: `orangtua_arfan`
   - **Password**: `simgizi2026`
3. Klik tombol **"Masuk"** ➔ Anda langsung masuk ke Beranda Portal Orang Tua ([http://localhost:3000/orang-tua](http://localhost:3000/orang-tua)).

#### Langkah 8: Lihat Notifikasi Tindakan Dokter
1. Lihat bagian **Pojok Kanan Atas (Topbar)**.
2. Klik **Ikon Lonceng Notifikasi** (atau buka menu `/orang-tua/notifikasi`).
3. **Apa yang terlihat di layar**:
   Orang tua langsung membaca pemberitahuan resmi bahwa rujukan medis ananda **Muhammad Arfan telah ditindaklanjuti oleh Dokter Puskesmas Bojongsoang** lengkap dengan instruksi PMT Pemulihan dan jadwal kontrol!

#### Langkah 9: Pantau Kurva Standar Pertumbuhan WHO
1. Di menu navigasi, klik **"Perkembangan"** ([http://localhost:3000/orang-tua/perkembangan](http://localhost:3000/orang-tua/perkembangan)).
2. **Apa yang terlihat di layar**:
   - Grafik interaktif kurva standar WHO (Pita Median, -2 SD, -3 SD).
   - Titik posisi fisik riil Muhammad Arfan (TB 78.5 cm pada usia 28 bulan) terpetakan secara presisi pada kurva baku WHO.
   - Rekomendasi nutrisi harian yang disajikan dengan bahasa awam yang ramah untuk ayah dan bunda.

---

### 🎯 Langkah 10: Pengujian Selesai 100%!

Selamat! Seluruh alur sistem telah teruji secara penuh dalam satu garis lurus:
- ✅ **Posyandu**: Berhasil input penimbangan & deteksi dini stunting Z-Score Permenkes 2020.
- ✅ **Puskesmas**: Berhasil triage balita berisiko & meresepkan tindakan medis pada rujukan.
- ✅ **Orang Tua**: Berhasil menerima notifikasi tindak lanjut medis & memantau kurva WHO.
- ✅ **Message Broker RabbitMQ**: Berhasil mendistribusikan event `pengukuran.created` dan `rujukan.updated` secara *real-time* ke 3 Consumer.

---

> 💡 **Info Tambahan**: Jika ingin melihat visualisasi grafik antrean pesan di browser, buka Dashboard RabbitMQ di [http://localhost:15672](http://localhost:15672) (User: `simgizi` / Pass: `simgizi2026`).
