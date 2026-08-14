// src/types/index.ts

export interface Petugas {
  id: string;
  nama: string;
  namaPosyandu: string;
  username: string;
  password: string; // hanya dipakai saat validasi login di server, TIDAK PERNAH ikut di response
}

// Bentuk Petugas yang aman untuk dikirim balik ke frontend (tanpa password)
export type PetugasSafe = Omit<Petugas, "password">;

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  petugas: PetugasSafe;
}

export type JenisKelamin = "L" | "P";

export interface Anak {
  id: string;
  nama: string;
  tanggalLahir: string;   // ISO date, contoh: "2023-05-12"
  jenisKelamin: JenisKelamin;
  namaOrangTua: string;
  idPetugas: string;      // FK -> Petugas.id
}

export interface CreateAnakPayload {
  nama: string;
  tanggalLahir: string;
  jenisKelamin: JenisKelamin;
  namaOrangTua: string;
  idPetugas: string;
}

export interface Pengukuran {
  id: string;
  idAnak: string;         // FK -> Anak.id
  beratBadan: number;     // kg
  tinggiBadan: number;    // cm
  tanggalPengukuran: string; // ISO date
  zScoreBBU: number;      // dihitung otomatis oleh sistem
  zScoreTBU: number;
  zScoreBBTB: number;
}

export interface CreatePengukuranPayload {
  idAnak: string;
  beratBadan: number;
  tinggiBadan: number;
  tanggalPengukuran: string;
}

export type StatusGizi = "normal" | "berisiko" | "stunting";
export type TingkatRisiko = "rendah" | "sedang" | "tinggi";

export interface RekomendasiAI {
  id: string;
  idPengukuran: string;   // FK -> Pengukuran.id (relasi 1:1)
  statusGizi: StatusGizi;
  tingkatRisiko: TingkatRisiko;
  saranTindakLanjut: string;
  rekomendasi?: string;
  indikator?: string[];
  isAlert: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
