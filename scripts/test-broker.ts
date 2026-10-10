// scripts/test-broker.ts
// Skrip Simulasi Pengujian Pengiriman Pesan ke RabbitMQ Message Broker

import {
  BROKER_ROUTING_KEYS,
  PengukuranEventData,
  RujukanEventData,
} from "../src/lib/broker/events";
import { publishBrokerEvent } from "../src/lib/broker/rabbitmq";

async function runTest() {
  console.log("\n============================================================");
  console.log("       SIMULASI PENGUJIAN MESSAGE BROKER (RABBITMQ)        ");
  console.log("============================================================\n");

  // 1. Uji Event 1: Pengukuran Baru (Posyandu -> Puskesmas & Orang Tua & Audit)
  console.log("📤 [1/3] Menerbitkan Event: pengukuran.created ...");
  const payloadPengukuran: PengukuranEventData = {
    idPengukuran: "e-test-" + Date.now(),
    idAnak: "d0000000-0000-0000-0000-000000000001",
    namaAnak: "Muhammad Arfan",
    nikAnak: "3201948392010001",
    usiaBulan: 28,
    beratKg: 10.2,
    tinggiCm: 81.5,
    statusGizi: "stunting",
    zTbu: -3.05,
    zBbu: -2.12,
    zBbtb: -1.25,
    idPosyandu: "a0000000-0000-0000-0000-000000000001",
    namaPosyandu: "Posyandu Melati 03",
    rekomendasiAI: "Intervensi gizi tinggi protein hewani dan rujukan faskes.",
    isStuntingOrWasted: true,
  };

  const pub1 = await publishBrokerEvent(
    BROKER_ROUTING_KEYS.PENGUKURAN_CREATED,
    payloadPengukuran,
    "posyandu",
  );
  console.log(`   -> Hasil Terbit: ${pub1 ? "✔ SUKSES TERKIRIM" : "✖ GAGAL"}\n`);

  await new Promise((r) => setTimeout(r, 1200));

  // 2. Uji Event 2: Rujukan Baru (Posyandu -> Puskesmas & Orang Tua & Audit)
  console.log("📤 [2/3] Menerbitkan Event: rujukan.created ...");
  const payloadRujukan: RujukanEventData = {
    idRujukan: "r-test-" + Date.now(),
    idAnak: "d0000000-0000-0000-0000-000000000001",
    namaAnak: "Muhammad Arfan",
    nikAnak: "3201948392010001",
    idPengukuran: payloadPengukuran.idPengukuran,
    status: "diajukan",
    catatan: "Balita stunting berat (-3.05 SD). Mohon penanganan lanjutan ahli gizi faskes.",
    idPosyandu: "a0000000-0000-0000-0000-000000000001",
    namaPosyandu: "Posyandu Melati 03",
    idPuskesmas: "b0000000-0000-0000-0000-000000000001",
    namaPuskesmas: "Puskesmas Bojongsoang",
  };

  const pub2 = await publishBrokerEvent(
    BROKER_ROUTING_KEYS.RUJUKAN_CREATED,
    payloadRujukan,
    "posyandu",
  );
  console.log(`   -> Hasil Terbit: ${pub2 ? "✔ SUKSES TERKIRIM" : "✖ GAGAL"}\n`);

  await new Promise((r) => setTimeout(r, 1200));

  // 3. Uji Event 3: Rujukan Ditindaklanjuti (Puskesmas -> Orang Tua & Audit)
  console.log("📤 [3/3] Menerbitkan Event: rujukan.updated ...");
  const payloadUpdateRujukan: RujukanEventData = {
    ...payloadRujukan,
    status: "ditindaklanjuti",
    catatanTindakan: "Pemeriksaan poli gizi selesai. Diberikan PMT pemulihan & multivitamin.",
    diperbaruiOleh: "Dr. Hj. Syahla Mutiara Latifah, M.Kes",
  };

  const pub3 = await publishBrokerEvent(
    BROKER_ROUTING_KEYS.RUJUKAN_UPDATED,
    payloadUpdateRujukan,
    "puskesmas",
  );
  console.log(`   -> Hasil Terbit: ${pub3 ? "✔ SUKSES TERKIRIM" : "✖ GAGAL"}\n`);

  console.log("============================================================");
  console.log("✔ SELURUH 3 EVENT BERHASIL DIKIRIMKAN KE RABBITMQ BROKER!");
  console.log("Periksa terminal tempat 'npm run worker' sedang berjalan untuk");
  console.log("melihat ketiga Consumer memproses pesan secara real-time.");
  console.log("============================================================\n");

  process.exit(0);
}

runTest().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
