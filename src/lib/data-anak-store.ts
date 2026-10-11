"use client";

import { useSyncExternalStore } from "react";
import { dataAnak as defaultDataAnak, AnakRecord } from "./data-anak";

const STORAGE_KEY = "simgizi_data_anak";
const EMPTY_SNAPSHOT: AnakRecord[] = [];

// Module-level in-memory cache
let memoryCache: AnakRecord[] | null = null;
const listeners = new Set<() => void>();

function deduplicateAnakRecords(records: AnakRecord[]): {
  deduped: AnakRecord[];
  hasChanged: boolean;
} {
  const nikMap = new Map<string, AnakRecord>();
  const nonNik: AnakRecord[] = [];
  let hasDuplicate = false;

  for (const item of records) {
    if (!item.nik) {
      nonNik.push(item);
      continue;
    }

    const existing = nikMap.get(item.nik);
    if (!existing) {
      nikMap.set(item.nik, item);
    } else {
      hasDuplicate = true;
      // Jika ada duplikasi data balita: satukan dan prioritaskan nilai penimbangan terbaru
      const itemIsNewer =
        (item.id.startsWith("anak-") && !existing.id.startsWith("anak-")) ||
        (item.tanggalPeriksa && existing.tanggalPeriksa && item.tanggalPeriksa >= existing.tanggalPeriksa);

      if (itemIsNewer) {
        nikMap.set(item.nik, {
          ...existing,
          ...item,
          id: existing.id, // Pertahankan id agar navigasi stabil
        });
      } else {
        nikMap.set(item.nik, {
          ...item,
          ...existing,
        });
      }
    }
  }

  const deduped = [...nikMap.values(), ...nonNik];
  return { deduped, hasChanged: hasDuplicate || deduped.length !== records.length };
}

function loadFromLocalStorage(): AnakRecord[] {
  if (typeof window === "undefined") {
    return EMPTY_SNAPSHOT;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    // KASUS 1: Belum pernah ada di localStorage sama sekali (First visit)
    if (raw === null) {
      const { deduped } = deduplicateAnakRecords(defaultDataAnak);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
      return deduped;
    }

    // KASUS 2: Sudah pernah ada data (termasuk jika datanya adalah "[]" karena semua dihapus)
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const { deduped, hasChanged } = deduplicateAnakRecords(parsed);
      if (hasChanged) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
        } catch (e) {
          console.error("Gagal memperbarui dedup localStorage:", e);
        }
      }
      return deduped;
    }
  } catch (e) {
    console.error("Gagal membaca data anak dari localStorage:", e);
  }

  return defaultDataAnak;
}

function ensureCacheReady(): AnakRecord[] {
  if (typeof window === "undefined") {
    return EMPTY_SNAPSHOT;
  }
  if (memoryCache === null) {
    memoryCache = loadFromLocalStorage();
  }
  return memoryCache;
}

function persistAndNotify(newData: AnakRecord[]): void {
  memoryCache = newData;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage:", e);
    }
  }
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);

  // Cross-tab sync support
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      memoryCache = loadFromLocalStorage();
      callback();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getSnapshot(): AnakRecord[] {
  return ensureCacheReady();
}

function getServerSnapshot(): AnakRecord[] {
  return EMPTY_SNAPSHOT;
}

export function useDataAnak(): AnakRecord[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function addDataAnak(record: AnakRecord): AnakRecord {
  const current = ensureCacheReady();
  const existingIdx = current.findIndex(
    (c) => c.nik === record.nik || c.id === record.id,
  );
  let updated: AnakRecord[];
  if (existingIdx !== -1) {
    // Jika data balita dengan NIK ini sudah ada, perbarui data penimbangannya (tidak membuat entri ganda)
    updated = [...current];
    updated[existingIdx] = {
      ...updated[existingIdx],
      ...record,
      id: updated[existingIdx].id, // pertahankan id asli agar stabil
    };
  } else {
    // Balita baru
    updated = [record, ...current];
  }
  persistAndNotify(updated);
  return record;
}

export function updateDataAnak(
  id: string,
  fields: Partial<AnakRecord>,
): void {
  const current = ensureCacheReady();
  const updated = current.map((item) =>
    item.id === id ? { ...item, ...fields } : item,
  );
  persistAndNotify(updated);
}

export function deleteDataAnak(id: string): void {
  const current = ensureCacheReady();
  const updated = current.filter((item) => item.id !== id);
  persistAndNotify(updated);
}

export function resetDataAnak(): void {
  persistAndNotify(defaultDataAnak);
}

export { subscribe, getSnapshot, getServerSnapshot };

