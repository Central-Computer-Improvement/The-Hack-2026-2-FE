// src/lib/broker/events.ts
// Single Source of Truth untuk Kontrak Event & Topologi Message Broker SimGizi

export const BROKER_EXCHANGE = "simgizi.events";

export const BROKER_ROUTING_KEYS = {
  PENGUKURAN_CREATED: "pengukuran.created",
  RUJUKAN_CREATED: "rujukan.created",
  RUJUKAN_UPDATED: "rujukan.updated",
} as const;

export const BROKER_QUEUES = {
  PUSKESMAS_TRIAGE: "simgizi.puskesmas.triage",
  ORANGTUA_NOTIFIKASI: "simgizi.orangtua.notifikasi",
  AUDIT_LAPORAN: "simgizi.audit.laporan",
} as const;

export interface BaseEventPayload<T = unknown> {
  eventId: string;
  eventType: string;
  timestamp: string;
  producer: "posyandu" | "puskesmas" | "sistem";
  data: T;
}

export interface PengukuranEventData {
  idPengukuran: string;
  idAnak: string;
  namaAnak: string;
  nikAnak: string;
  usiaBulan: number;
  beratKg: number;
  tinggiCm: number;
  statusGizi: "normal" | "gizi_kurang" | "gizi_buruk" | "stunting";
  zTbu: number;
  zBbu: number;
  zBbtb: number;
  idPosyandu: string;
  namaPosyandu?: string;
  rekomendasiAI?: string;
  isStuntingOrWasted: boolean;
}

export interface RujukanEventData {
  idRujukan: string;
  idAnak: string;
  namaAnak: string;
  nikAnak: string;
  idPengukuran: string;
  status: "diajukan" | "diterima" | "ditindaklanjuti" | "selesai" | "ditolak";
  catatan: string;
  alasanPenolakan?: string;
  catatanTindakan?: string;
  idPosyandu: string;
  namaPosyandu?: string;
  idPuskesmas?: string;
  namaPuskesmas?: string;
  diperbaruiOleh?: string;
}
