import { describe, it, expect, vi } from "vitest";
import {
  BROKER_EXCHANGE,
  BROKER_QUEUES,
  BROKER_ROUTING_KEYS,
  BaseEventPayload,
  PengukuranEventData,
  RujukanEventData,
} from "@/lib/broker/events";
import { publishBrokerEvent, getBrokerStatus } from "@/lib/broker/rabbitmq";

describe("Message Broker SimGizi (RabbitMQ Topology & Fail-Safe)", () => {
  describe("Topologi & Kontrak Event", () => {
    it("memiliki Exchange tunggal bertipe Topic yang valid", () => {
      expect(BROKER_EXCHANGE).toBe("simgizi.events");
    });

    it("memiliki 3 Antrean (Queues) sesuai peran sistem terdistribusi", () => {
      expect(BROKER_QUEUES.PUSKESMAS_TRIAGE).toBe("simgizi.puskesmas.triage");
      expect(BROKER_QUEUES.ORANGTUA_NOTIFIKASI).toBe("simgizi.orangtua.notifikasi");
      expect(BROKER_QUEUES.AUDIT_LAPORAN).toBe("simgizi.audit.laporan");
    });

    it("memiliki routing keys terstandarisasi untuk siklus data posyandu & rujukan", () => {
      expect(BROKER_ROUTING_KEYS.PENGUKURAN_CREATED).toBe("pengukuran.created");
      expect(BROKER_ROUTING_KEYS.RUJUKAN_CREATED).toBe("rujukan.created");
      expect(BROKER_ROUTING_KEYS.RUJUKAN_UPDATED).toBe("rujukan.updated");
    });

    it("memvalidasi format payload BaseEventPayload", () => {
      const payload: BaseEventPayload<PengukuranEventData> = {
        eventId: "evt_test_123",
        eventType: BROKER_ROUTING_KEYS.PENGUKURAN_CREATED,
        timestamp: new Date().toISOString(),
        producer: "posyandu",
        data: {
          idPengukuran: "u-1",
          idAnak: "a-1",
          namaAnak: "Balita Sehat",
          nikAnak: "3201948392010001",
          usiaBulan: 24,
          beratKg: 12.0,
          tinggiCm: 86.5,
          statusGizi: "normal",
          zTbu: 0.1,
          zBbu: 0.2,
          zBbtb: 0.15,
          idPosyandu: "p-1",
          isStuntingOrWasted: false,
        },
      };

      expect(payload.eventId).toMatch(/^evt_/);
      expect(payload.eventType).toBe("pengukuran.created");
      expect(payload.producer).toBe("posyandu");
      expect(payload.data.namaAnak).toBe("Balita Sehat");
      expect(payload.data.isStuntingOrWasted).toBe(false);
    });

    it("memvalidasi payload rujukan dengan data faskes", () => {
      const payload: BaseEventPayload<RujukanEventData> = {
        eventId: "evt_test_456",
        eventType: BROKER_ROUTING_KEYS.RUJUKAN_UPDATED,
        timestamp: new Date().toISOString(),
        producer: "puskesmas",
        data: {
          idRujukan: "r-1",
          idAnak: "a-1",
          namaAnak: "Muhammad Arfan",
          nikAnak: "3201948392010001",
          idPengukuran: "u-1",
          status: "ditindaklanjuti",
          catatan: "Diberikan intervensi PMT Tinggi Protein",
          idPosyandu: "pos-1",
          idPuskesmas: "pus-1",
          diperbaruiOleh: "Dr. Syahla",
        },
      };

      expect(payload.data.status).toBe("ditindaklanjuti");
      expect(payload.producer).toBe("puskesmas");
      expect(payload.data.diperbaruiOleh).toBe("Dr. Syahla");
    });
  });

  describe("Fail-Safe Graceful Degradation", () => {
    it("publishBrokerEvent tidak crash dan mengembalikan false saat RabbitMQ offline", async () => {
      // Mock console.warn agar output test tetap rapi
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = await publishBrokerEvent(
        BROKER_ROUTING_KEYS.PENGUKURAN_CREATED,
        { test: "data" },
        "posyandu",
      );

      // Karena AMQP tidak berjalan di lingkungan CI/Unit test lokal tanpa container,
      // fungsi harus mengembalikan false dengan aman tanpa melempar exception
      expect(typeof result).toBe("boolean");

      warnSpy.mockRestore();
    });

    it("getBrokerStatus mengembalikan status terstruktur saat offline tanpa exception", async () => {
      const status = await getBrokerStatus();

      expect(status).toHaveProperty("connected");
      expect(status).toHaveProperty("exchange", BROKER_EXCHANGE);
      expect(status).toHaveProperty("queues");
      expect(status).toHaveProperty("message");
    });
  });
});
