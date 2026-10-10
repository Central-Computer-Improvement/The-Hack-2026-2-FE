# Indeks Dokumen & Panduan Resmi — SimGizi

Folder ini memuat seluruh dokumen teknis, panduan operasional, master data pengujian, dan spesifikasi arsitektur resmi untuk sistem **SimGizi**.

---

## Daftar Panduan & Dokumen

| No | Nama Dokumen | Tautan Dokumen | Deskripsi & Kegunaan |
| :---: | :--- | :--- | :--- |
| **1** | **Panduan Akun & Data CRUD** | [PANDUAN_AKUN_DAN_DATA_CRUD.md](./PANDUAN_AKUN_DAN_DATA_CRUD.md) | Daftar 6 akun pengguna (2 Posyandu, 2 Puskesmas, 2 Orang Tua), master data faskes, NIK balita binaan, dan langkah simulasi pengujian CRUD. |
| **2** | **Panduan Message Broker (RabbitMQ)** | [PANDUAN_MESSAGE_BROKER_RABBITMQ.md](./PANDUAN_MESSAGE_BROKER_RABBITMQ.md) | Panduan arsitektur terdistribusi RabbitMQ via Docker, antrean (*queues*), worker daemon (`npm run worker`), dan skrip simulasi event broker. |
| **3** | **Spesifikasi Kasus Uji (Test Case)** | [testcase.md](./testcase.md) | Dokumen formal pengujian QA mencakup 7 modul fungsional dan 25 kasus uji (pre-kondisi, step-by-step, expected result, actual result, status PASS). |
| **4** | **Cetak Biru Arsitektur (Architecture Blueprint)** | [PLAN_ARSITEKTUR.md](./PLAN_ARSITEKTUR.md) | Cetak biru arsitektur Clean Architecture, skema basis data PostgreSQL/Supabase, RBAC, dan keputusan teknologi. |

---

## Ringkasan Kredensial Pengujian (Cepat)

> 🔑 **Kata Sandi Seluruh Akun**: `simgizi2026`

- **Posyandu 1**: `kelompok2` (Bidan Sri Wahyuni — Posyandu Melati 03)
- **Posyandu 2**: `posyandu_mekarsari01` (Kader Siti Nurhaliza — Posyandu Mekar Sari 01)
- **Puskesmas 1**: `puskesmas_bojongsoang` (Dr. Hj. Syahla Mutiara Latifah, M.Kes — Puskesmas Bojongsoang)
- **Puskesmas 2**: `puskesmas_dayeuhkolot` (Dr. Ahmad Fauzi, Sp.A — Puskesmas Dayeuhkolot)
- **Orang Tua 1**: `orangtua_arfan` (Rahmat Hidayat — Wali Muhammad Arfan)
- **Orang Tua 2**: `orangtua_aisyah` (Hendra Wijaya — Wali Aisyah Putri Humaira)

---

## Perintah Penting untuk Pengujian

```bash
# 1. Menjalankan Docker RabbitMQ
docker compose up -d

# 2. Menjalankan Worker Daemon Message Broker
npm run worker

# 3. Menjalankan Simulasi Pengujian Event Broker
npm run test:broker

# 4. Menjalankan Otomasi Pengujian Vitest
npm test

# 5. Menjalankan Web Server Dev
npm run dev
```
