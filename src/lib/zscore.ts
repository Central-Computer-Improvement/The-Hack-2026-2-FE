/**
 * Kalkulasi Z-score status gizi anak (0-59 bulan) berdasar Permenkes No. 2 Tahun 2020.
 * Porting 100% dari module zscore.py (Divisi Data Research SimGizi).
 */

import zscoreData from "./data/zscore-reference.json";

export type IndeksAntropometri = "BB/U" | "PB/U" | "TB/U" | "BB/PB" | "BB/TB";
export type JenisKelamin = "laki-laki" | "perempuan";
export type PosisiUkur = "telentang" | "berdiri";

export interface ZScoreReferenceRow {
  x: number;
  sd3neg: number;
  sd2neg: number;
  sd1neg: number;
  median: number;
  sd1pos: number;
  sd2pos: number;
  sd3pos: number;
}

export type ZScoreReferenceMap = Record<string, ZScoreReferenceRow[]>;

export interface ZScoreItemResult {
  z_score: number;
  status: string;
}

export interface NilaiGiziResult {
  [indeks: string]: ZScoreItemResult;
}

/**
 * Konversi IEEE 754 float64 ke representasi rasional BigInt eksak (num / den).
 */
export function floatToBigIntRatio(val: number): { num: bigint; den: bigint } {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, val, false);
  const high = view.getUint32(0, false);
  const low = view.getUint32(4, false);

  const sign = high >>> 31;
  const exp = (high >>> 20) & 0x7ff;
  let mantissa = (BigInt(high & 0xfffff) << BigInt(32)) | BigInt(low);

  if (exp === 0) {
    // Subnormal number
    return { num: sign ? -mantissa : mantissa, den: BigInt(1) << BigInt(1074) };
  } else {
    // Normal number
    mantissa |= BigInt(1) << BigInt(52);
    const shift = exp - 1023 - 52;
    if (shift >= 0) {
      return { num: (sign ? -mantissa : mantissa) * (BigInt(1) << BigInt(shift)), den: BigInt(1) };
    } else {
      return { num: sign ? -mantissa : mantissa, den: BigInt(1) << BigInt(-shift) };
    }
  }
}

/**
 * Emulasi eksak Python 3 round(val, ndigits) dengan Banker's Rounding (Round-Half-To-Even).
 * Murni rasional integer arithmetic tanpa epsilon/toleransi.
 */
export function pythonRound(val: number, ndigits: number = 2): number {
  if (!Number.isFinite(val)) return val;
  const { num, den } = floatToBigIntRatio(val);
  const isNegative = num < BigInt(0);
  const absNum = isNegative ? -num : num;

  const pow10 = BigInt(10) ** BigInt(ndigits);
  const scaledNum = absNum * pow10;

  const div = scaledNum / den;
  const rem = scaledNum % den;
  const doubleRem = rem * BigInt(2);

  let roundedInt = div;
  if (doubleRem > den) {
    roundedInt = div + BigInt(1);
  } else if (doubleRem < den) {
    roundedInt = div;
  } else {
    // Exact tie (rem / den === 0.5): round to even
    roundedInt = div % BigInt(2) === BigInt(0) ? div : div + BigInt(1);
  }

  const result = Number(roundedInt) / Number(pow10);
  return isNegative ? -result : result;
}

// Module-level singleton cache
let cachedReference: ZScoreReferenceMap | null = null;

/**
 * Load tabel referensi jadi dict {(indeks_jenis_kelamin): [baris...]} terurut nilai_x.
 * Menggunakan module-level memory cache agar pemrosesan hanya terjadi 1 kali saat runtime.
 */
export function loadReference(): ZScoreReferenceMap {
  if (cachedReference) {
    return cachedReference;
  }

  const ref: ZScoreReferenceMap = {};

  for (const item of zscoreData) {
    const key = `${item.indeks}_${item.jenisKelamin}`;
    if (!ref[key]) {
      ref[key] = [];
    }
    ref[key].push({
      x: item.nilaiX,
      sd3neg: item.sd3neg,
      sd2neg: item.sd2neg,
      sd1neg: item.sd1neg,
      median: item.median,
      sd1pos: item.sd1pos,
      sd2pos: item.sd2pos,
      sd3pos: item.sd3pos,
    });
  }

  for (const key of Object.keys(ref)) {
    ref[key].sort((a, b) => a.x - b.x);
  }

  cachedReference = ref;
  return ref;
}

/**
 * Interpolasi linear antar baris tabel terdekat kalau nilai_x gak persis ada di tabel.
 */
export function interpolasi(rows: ZScoreReferenceRow[], x: number): ZScoreReferenceRow {
  if (x <= rows[0].x) {
    return rows[0];
  }
  if (x >= rows[rows.length - 1].x) {
    return rows[rows.length - 1];
  }

  for (let i = 0; i < rows.length - 1; i++) {
    const lo = rows[i];
    const hi = rows[i + 1];
    if (lo.x <= x && x <= hi.x) {
      const frac = hi.x === lo.x ? 0.0 : (x - lo.x) / (hi.x - lo.x);
      return {
        x: x,
        sd3neg: lo.sd3neg + frac * (hi.sd3neg - lo.sd3neg),
        sd2neg: lo.sd2neg + frac * (hi.sd2neg - lo.sd2neg),
        sd1neg: lo.sd1neg + frac * (hi.sd1neg - lo.sd1neg),
        median: lo.median + frac * (hi.median - lo.median),
        sd1pos: lo.sd1pos + frac * (hi.sd1pos - lo.sd1pos),
        sd2pos: lo.sd2pos + frac * (hi.sd2pos - lo.sd2pos),
        sd3pos: lo.sd3pos + frac * (hi.sd3pos - lo.sd3pos),
      };
    }
  }

  return rows[rows.length - 1];
}

/**
 * Hitung Z-score status gizi anak sesuai Permenkes No. 2/2020.
 *
 * @param ref Tabel referensi hasil loadReference()
 * @param indeks 'BB/U' | 'PB/U' | 'TB/U' | 'BB/PB' | 'BB/TB'
 * @param jenisKelamin 'laki-laki' | 'perempuan'
 * @param nilaiX Umur (bulan) untuk BB/U,PB/U,TB/U -- atau panjang/tinggi (cm) untuk BB/PB,BB/TB
 * @param nilaiUkur Hasil ukur aktual anak (kg untuk *berat, cm untuk *panjang/tinggi)
 */
export function hitungZScore(
  ref: ZScoreReferenceMap,
  indeks: IndeksAntropometri | string,
  jenisKelamin: JenisKelamin | string,
  nilaiX: number | null | undefined,
  nilaiUkur: number | null | undefined
): number {
  const key = `${indeks}_${jenisKelamin}`;
  if (!ref[key]) {
    throw new Error(`Tidak ada data referensi untuk indeks=${indeks}, jenis_kelamin=${jenisKelamin}`);
  }

  if (nilaiX === null || nilaiX === undefined || nilaiUkur === null || nilaiUkur === undefined) {
    throw new Error(
      `Input tidak boleh kosong (nilai_x=${nilaiX}, nilai_ukur=${nilaiUkur}) untuk indeks=${indeks}`
    );
  }

  const numX = Number(nilaiX);
  const numUkur = Number(nilaiUkur);

  if (!Number.isFinite(numX) || !Number.isFinite(numUkur)) {
    throw new Error(`nilai_x dan nilai_ukur harus berupa angka, dapat: ${nilaiX}, ${nilaiUkur}`);
  }

  const xMin = ref[key][0].x;
  const xMax = ref[key][ref[key].length - 1].x;

  if (numX < xMin || numX > xMax) {
    throw new Error(
      `nilai_x=${numX} di luar rentang tabel referensi ${indeks} (${xMin}-${xMax}). ` +
      `Cek kembali input umur/tinggi -- bisa jadi typo atau anak di luar target usia (0-59 bulan).`
    );
  }

  const baris = interpolasi(ref[key], numX);
  const median = baris.median;

  let sd: number;
  if (numUkur >= median) {
    sd = baris.sd1pos - median;
  } else {
    sd = median - baris.sd1neg;
  }

  if (sd === 0) {
    return 0.0;
  }

  return pythonRound((numUkur - median) / sd, 2);
}

/**
 * Klasifikasi status gizi sesuai ambang batas Permenkes No. 2/2020.
 */
export function klasifikasiStatusGizi(indeks: string, z: number): string {
  if (indeks === "BB/U") {
    if (z < -3) {
      return "Berat badan sangat kurang (severely underweight)";
    }
    if (z < -2) {
      return "Berat badan kurang (underweight)";
    }
    if (z <= 1) {
      return "Berat badan normal";
    }
    return "Risiko berat badan lebih";
  }

  if (indeks === "PB/U" || indeks === "TB/U") {
    if (z < -3) {
      return "Sangat pendek (severely stunted)";
    }
    if (z < -2) {
      return "Pendek (stunted)";
    }
    if (z <= 3) {
      return "Normal";
    }
    return "Tinggi";
  }

  if (indeks === "BB/PB" || indeks === "BB/TB") {
    if (z < -3) {
      return "Gizi buruk (severely wasted)";
    }
    if (z < -2) {
      return "Gizi kurang (wasted)";
    }
    if (z <= 1) {
      return "Gizi baik (normal)";
    }
    if (z <= 2) {
      return "Risiko gizi lebih";
    }
    if (z <= 3) {
      return "Gizi lebih";
    }
    return "Obesitas";
  }

  throw new Error(`Indeks tidak dikenal: ${indeks}`);
}

/**
 * Hitung status gizi lengkap (BB/U, TB-atau-PB/U, BB/TB-atau-BB/PB) dari satu sesi pengukuran.
 *
 * @param ref Tabel referensi hasil loadReference()
 * @param umurBulan Umur balita dalam bulan (0-59)
 * @param jenisKelamin 'laki-laki' | 'perempuan'
 * @param beratKg Berat badan balita dalam kg
 * @param panjangTinggiCm Panjang badan (PB) atau tinggi badan (TB) dalam cm
 * @param posisiUkur 'telentang' atau 'berdiri'. Kalau tidak diberikan, dipilih otomatis dari umur
 *                    (< 24 bulan -> telentang/PB, >= 24 bulan -> berdiri/TB), sesuai keterangan tabel resmi.
 */
export function nilaiGiziAnak(
  ref: ZScoreReferenceMap,
  umurBulan: number,
  jenisKelamin: JenisKelamin | string,
  beratKg: number,
  panjangTinggiCm: number,
  posisiUkur?: PosisiUkur | null
): NilaiGiziResult {
  const pos = posisiUkur || (umurBulan < 24 ? "telentang" : "berdiri");

  const indeksPanjang = pos === "telentang" ? "PB/U" : "TB/U";
  const indeksBbPanjang = pos === "telentang" ? "BB/PB" : "BB/TB";

  const zBbu = hitungZScore(ref, "BB/U", jenisKelamin, umurBulan, beratKg);
  const zPbu = hitungZScore(ref, indeksPanjang, jenisKelamin, umurBulan, panjangTinggiCm);
  const zBbpb = hitungZScore(ref, indeksBbPanjang, jenisKelamin, panjangTinggiCm, beratKg);

  return {
    "BB/U": { z_score: zBbu, status: klasifikasiStatusGizi("BB/U", zBbu) },
    [indeksPanjang]: { z_score: zPbu, status: klasifikasiStatusGizi(indeksPanjang, zPbu) },
    [indeksBbPanjang]: { z_score: zBbpb, status: klasifikasiStatusGizi(indeksBbPanjang, zBbpb) },
  };
}
