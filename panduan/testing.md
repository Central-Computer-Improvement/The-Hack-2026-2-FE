# Panduan Alur Pengujian End-to-End (Testing Guide) — SimGizi

Dokumen ini memuat panduan pengujian terpadu (*End-to-End Walkthrough*) dari peran **Kader Posyandu**, berlanjut ke **Dokter Puskesmas**, hingga ke portal **Orang Tua**, lengkap dengan data inputan, tombol aksi, tampilan hasil yang diharapkan, serta pemantauan integrasi **Message Broker (RabbitMQ)**.

---

## 1. Prasyarat & Lingkungan Pengujian

Sebelum memulai pengujian, pastikan ketiga layanan berikut aktif di terminal Anda:

| Layanan | Perintah Terminal | Status yang Diharapkan |
| :--- | :--- | :--- |
| **1. Docker RabbitMQ** | `docker compose up -d` | Container `simgizi-rabbitmq` Running |
| **2. Message Broker Worker** | `npm run worker` | 3 Consumer aktif mendengarkan antrean |
| **3. Server Web SimGizi** | `npm run dev` | Berjalan di `http://localhost:3000` |

> 🔑 **Kata Sandi (Password) Seluruh Akun**: `simgizi2026`  
> 🌐 **URL RabbitMQ Management UI**: [http://localhost:15672](http://localhost:15672) (User: `simgizi` / Pass: `simgizi2026`)

---

## 2. Ringkasan Akun yang Digunakan

| Peran (Role) | Username | Password | Nama Profil / Jabatan | Akses Halaman |
| :--- | :--- | :--- | :--- | :--- |
| **Posyandu** | `kelompok2` | `simgizi2026` | Bidan Sri Wahyuni, S.Tr.Keb | `/`, `/pencatatan-anak`, `/rekap-data-gizi`, `/rujukan` |
| **Puskesmas** | `puskesmas_bojongsoang` | `simgizi2026` | Dr. Hj. Syahla Mutiara Latifah, M.Kes | `/puskesmas`, `/puskesmas/balita-berisiko`, `/puskesmas/rujukan`, `/puskesmas/laporan` |
| **Orang Tua 1** | `orangtua_arfan` | `simgizi2026` | Rahmat Hidayat (Wali Muhammad Arfan) | `/orang-tua`, `/orang-tua/perkembangan`, `/orang-tua/jadwal` |
| **Orang Tua 2** | `orangtua_aisyah` | `simgizi2026` | Hendra Wijaya (Wali Aisyah) | `/orang-tua/klaim` (Uji fitur penautan anak) |

---

## 3. FASE 1: Pengujian Role Kader Posyandu (Input Balita & Deteksi Dini)

### Langkah 1.1: Login sebagai Kader Posyandu
1. Buka browser: [http://localhost:3000/login](http://localhost:3000/login)
2. Masukkan:
   - **Username**: `kelompok2`
   - **Password**: `simgizi2026`
3. Klik tombol **"Masuk"**.
4. **Hasil**: Anda berhasil login dan diarahkan ke Dashboard Posyandu (`http://localhost:3000/`).

---

### Langkah 1.2: Input Pengukuran Balita Baru (Data 1 — Indikasi Stunting)
1. Di sidebar kiri, klik menu **"Pencatatan Data Anak"** (URL: [http://localhost:3000/pencatatan-anak](http://localhost:3000/pencatatan-anak)).
2. Isi formulir dengan data persis berikut:

| Kolom Form | Nilai yang Harus Diinput | Keterangan |
| :--- | :--- | :--- |
| **Nama Balita** | `Bilal Pratama` | Nama lengkap balita |
| **NIK (16 Digit)** | `3201948392010006` | Wajib tepat 16 digit angka |
| **Nama Orang Tua** | `Budi Pratama` | Nama wali balita |
| **Jenis Kelamin** | Pilih **Laki-laki** | Radio button |
| **Umur (Bulan)** | `24` | Usia dalam satuan bulan |
| **Berat Badan (kg)** | `9.5` | Gunakan titik untuk desimal |
| **Tinggi Badan (cm)** | `78.0` | TB di bawah standar kurva usia 24 bulan |
| **Alamat** | `Jl. Melati RW 03, Bojongsoang` | Alamat domisili balita |

3. Klik tombol hijau besar di bagian bawah: **"Tambah data balita"**.
4. **Apa yang Terlihat di Layar Browser**:
   - Muncul notifikasi toast hijau: *"Data Balita berhasil ditambahkan"*.
   - Status gizi terhitung otomatis: **`Stunting`** (Badge merah).
   - Analisis naratif klinis AI / WHO otomatis terlampir.
   - Formulir kembali bersih (reset).
5. **Apa yang Terlihat di Terminal `npm run worker` Anda**:
   Event `pengukuran.created` otomatis diterbitkan ke RabbitMQ dan diproses oleh 3 Consumer secara serentak:
   ```text
   [Consumer 1 - Puskesmas Triage] Menerima event pengukuran.created:
     -> [Peringatan Dini Epidemiologi] Kasus STUNTING: Bilal Pratama (TB/U: -2.85 SD)
   [Consumer 2 - Notifikasi Orang Tua] Menerima event pengukuran.created:
     -> [Pesan Orang Tua] Notifikasi pertumbuhan dikirim untuk Bilal Pratama: BB 9.5 kg, TB 78 cm (stunting)
   [Consumer 3 - Audit Dinkes] [timestamp] Event: pengukuran.created | Producer: posyandu
   ```

---

### Langkah 1.3: Melihat Rekapitulasi Data Anak
1. Klik menu **"Rekap Data Gizi"** (URL: [http://localhost:3000/rekap-data-gizi](http://localhost:3000/rekap-data-gizi)).
2. Pada dropdown filter status, pilih **"Stunting"**.
3. Klik salah satu baris balita (misal: `Muhammad Arfan` atau `Bilal Pratama`).
4. **Hasil**: Terbuka **Modal Detail Anak** yang memuat grafik indikator antropometri (BB/U, TB/U, BB/TB) serta telaah klinis.

---

### Langkah 1.4: Mengajukan / Memantau Rujukan Faskes
1. Klik menu **"Rujukan"** (URL: [http://localhost:3000/rujukan](http://localhost:3000/rujukan)).
2. Anda akan melihat daftar tiket rujukan balita yang diajukan ke **Puskesmas Bojongsoang** beserta status terkininya (`Diajukan`, `Diterima`, atau `Selesai`).

---

## 4. FASE 2: Pengujian Role Dokter Puskesmas (Triage Medis & Tindak Lanjut Rujukan)

### Langkah 2.1: Login sebagai Petugas Puskesmas
1. Buka tab baru browser atau mode *Incognito*: [http://localhost:3000/login](http://localhost:3000/login)
   *(Atau keluar terlebih dahulu dari akun Posyandu melalui tombol Logout di pojok kanan atas).*
2. Masukkan akun Puskesmas:
   - **Username**: `puskesmas_bojongsoang`
   - **Password**: `simgizi2026`
3. Klik **"Masuk"**.
4. **Hasil**: Masuk ke Dashboard Puskesmas (`http://localhost:3000/puskesmas`) yang menampilkan prevalensi gizi agregat seluruh posyandu binaan.

---

### Langkah 2.2: Melakukan Triage Balita Berisiko
1. Di sidebar kiri, klik menu **"Balita Berisiko"** (URL: [http://localhost:3000/puskesmas/balita-berisiko](http://localhost:3000/puskesmas/balita-berisiko)).
2. **Apa yang Terlihat**:
   Sistem secara otomatis mengelompokkan balita berisiko ke dalam daftar prioritas triase klinis:
   - 🔴 **Prioritas 1 (Gizi Buruk)**: Kasus severely wasted yang butuh penanganan formula F-75/F-100 segera.
   - 🟠 **Prioritas 2 (Stunting)**: Balita stunting (seperti `Muhammad Arfan` dan `Bilal Pratama` yang baru Anda inputkan) langsung tampil di daftar pengawasan faskes.
   - 🟡 **Prioritas 3 (Gizi Kurang)**: Balita underweight.

---

### Langkah 2.3: Menindaklanjuti Rujukan Medis Masuk
1. Di sidebar kiri, klik menu **"Rujukan"** (URL: [http://localhost:3000/puskesmas/rujukan](http://localhost:3000/puskesmas/rujukan)).
2. Cari rujukan pasien **Muhammad Arfan** yang berstatus **"Diajukan"**.
3. Lakukan dua aksi bertahap berikut:

#### Aksi A: Menerima Rujukan
- Klik tombol **"Terima"** pada baris rujukan Arfan.
- Status rujukan langsung diperbarui menjadi **`Diterima`**.

#### Aksi B: Memberikan Tindakan Medis Dokter
- Klik tombol **"Tindak Lanjut"**.
- Sebuah jendela dialog/modal aksi akan terbuka.
- Masukkan catatan tindakan medis dokter:
  > *"Pemeriksaan poli gizi anak selesai. Diberikan paket PMT Pemulihan biskuit tinggi protein, multivitamin zat besi, serta konseling MPASI kepada orang tua. Jadwal kontrol ulang 14 hari ke depan."*
- Klik tombol **"Simpan Tindakan"**.

4. **Apa yang Terlihat di Layar Browser**:
   - Status rujukan berubah menjadi **`Ditindaklanjuti`**.
   - Muncul toast notifikasi sukses: *"Status rujukan berhasil diubah menjadi ditindaklanjuti"*.
5. **Apa yang Terlihat di Terminal `npm run worker` Anda**:
   Event `rujukan.updated` otomatis terkirim ke antrean Orang Tua dan Audit:
   ```text
   [Consumer 2 - Notifikasi Orang Tua] Menerima event rujukan.updated:
     -> [Pesan Orang Tua] Status rujukan Muhammad Arfan diperbarui menjadi: DITINDAKLANJUTI
   [Consumer 3 - Audit Dinkes] [timestamp] Event: rujukan.updated | Producer: puskesmas
   ```

---

## 5. FASE 3: Pengujian Role Orang Tua (Kurva WHO, Notifikasi, & Klaim Balita)

### Langkah 3.1: Login sebagai Orang Tua Arfan
1. Buka browser / tab incognito baru: [http://localhost:3000/login](http://localhost:3000/login)
2. Masukkan akun:
   - **Username**: `orangtua_arfan`
   - **Password**: `simgizi2026`
3. Klik **"Masuk"**.
4. **Hasil**: Masuk ke Beranda Orang Tua (`http://localhost:3000/orang-tua`) yang didesain *mobile-first* ramah pengguna.

---

### Langkah 3.2: Memeriksa Notifikasi Terkini dari Puskesmas
1. Amati bagian **Topbar (Pojok Kanan Atas)**.
2. Klik ikon lonceng notifikasi (atau buka halaman notifikasi).
3. **Hasil**:
   Orang tua langsung menerima pemberitahuan resmi bahwa status rujukan anak ananda Muhammad Arfan telah ditindaklanjuti oleh dokter Puskesmas Bojongsoang beserta catatan medisnya.

---

### Langkah 3.3: Memeriksa Grafik Kurva Standar WHO
1. Di navigasi menu, klik **"Perkembangan"** / **"Kurva WHO"** (URL: [http://localhost:3000/orang-tua/perkembangan](http://localhost:3000/orang-tua/perkembangan)).
2. **Apa yang Terlihat**:
   - Kurva baku standar WHO (Pita Median Hijau, Garis Kuning -2 SD, Garis Merah -3 SD).
   - Titik posisi riil tinggi badan dan berat badan Muhammad Arfan dipetakan secara presisi pada grafik kurva pertumbuhan.
   - Rekomendasi nutrisi harian yang disajikan dengan bahasa awam yang mudah dipahami orang tua.

---

### Langkah 3.4: Menguji Fitur "Klaim Data Balita Baru"
1. Logout dari akun Arfan, lalu login menggunakan akun Orang Tua kedua:
   - **Username**: `orangtua_aisyah`
   - **Password**: `simgizi2026`
2. Buka menu **"Klaim Balita"** (URL: [http://localhost:3000/orang-tua/klaim](http://localhost:3000/orang-tua/klaim)).
3. Masukkan data verifikasi identitas anak berikut:
   - **Kode Klaim Balita**: `ASYH2026`
   - **Tanggal Lahir Anak**: `11-06-2025` *(atau pilih 11 Juni 2025 di kalender)*
4. Klik tombol **"Verifikasi & Tautkan Anak"**.
5. **Hasil**:
   - Sistem memvalidasi kode unik balita.
   - Muncul notifikasi sukses: *"Data anak Aisyah Putri Humaira berhasil ditautkan!"*.
   - Halaman otomatis memuat profil tumbuh kembang ananda Aisyah ke akun orang tua.

---

## 6. FASE 4: Pengujian & Pemantauan Message Broker (RabbitMQ)

### 6.1 Uji Simulasi Otomatis via Terminal (CLI)
Kapan pun Anda ingin melakukan demonstrasi pengiriman event tanpa membuka browser:
```bash
npm run test:broker
```
Output terminal akan menampilkan 3/3 event terkirim sukses:
- `pengukuran.created` $\rightarrow$ Sukses
- `rujukan.created` $\rightarrow$ Sukses
- `rujukan.updated` $\rightarrow$ Sukses

### 6.2 Memantau Antrean di Dashboard Web RabbitMQ
1. Buka browser: [http://localhost:15672](http://localhost:15672)
2. Login:
   - **User**: `simgizi`
   - **Password**: `simgizi2026`
3. Masuk ke tab **Queues**:
   - Anda akan melihat ketiga antrean aktif:
     - `simgizi.puskesmas.triage`
     - `simgizi.orangtua.notifikasi`
     - `simgizi.audit.laporan`
   - Kolom *Consumers* bernilai **1** (menandakan worker `npm run worker` Anda sedang aktif mendengarkan).

### 6.3 Memantau Endpoint API Kesehatan Broker
Buka URL berikut di browser: [http://localhost:3000/api/broker/status](http://localhost:3000/api/broker/status)
Mengembalikan status JSON real-time:
```json
{
  "success": true,
  "data": {
    "connected": true,
    "url": "amqp://simgizi:****@localhost:5672",
    "exchange": "simgizi.events",
    "message": "RabbitMQ Message Broker aktif & siap menyalurkan event."
  }
}
```

---

## 7. Matriks Ceklis Keberhasilan Pengujian (Testing Checklist)

| No | Modul / Skenario Pengujian | Aktor | Status Sukses |
| :---: | :--- | :--- | :---: |
| 1 | Login Berhasil Akun Posyandu (`kelompok2`) | Posyandu | ✅ PASS |
| 2 | Input Balita Stunting (`Bilal Pratama`) & Kalkulasi Z-Score | Posyandu | ✅ PASS |
| 3 | Penerbitan Event `pengukuran.created` ke RabbitMQ | Posyandu | ✅ PASS |
| 4 | Consumer 1 (Puskesmas Triage) Menangkap Peringatan Stunting | Worker | ✅ PASS |
| 5 | Filter & Detail Anak di Rekap Data Gizi | Posyandu | ✅ PASS |
| 6 | Login Berhasil Akun Puskesmas (`puskesmas_bojongsoang`) | Puskesmas | ✅ PASS |
| 7 | Triage Otomatis Balita Berisiko Prioritas 1, 2, 3 | Puskesmas | ✅ PASS |
| 8 | Dokter Terima & Input Catatan Tindakan Medis Rujukan | Puskesmas | ✅ PASS |
| 9 | Penerbitan Event `rujukan.updated` ke RabbitMQ | Puskesmas | ✅ PASS |
| 10 | Login Berhasil Akun Orang Tua (`orangtua_arfan`) | Orang Tua | ✅ PASS |
| 11 | Penerimaan Notifikasi Hasil Rujukan Medis di Topbar | Orang Tua | ✅ PASS |
| 12 | Visualisasi Kurva Pertumbuhan Baku WHO Anak | Orang Tua | ✅ PASS |
| 13 | Klaim Balita Baru via Kode Unik (`ASYH2026`) | Orang Tua | ✅ PASS |
| 14 | Verifikasi Antrean di RabbitMQ Management UI (`localhost:15672`) | Admin | ✅ PASS |
