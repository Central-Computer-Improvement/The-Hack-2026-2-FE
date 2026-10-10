import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { pengukuranRepository } from "@/lib/repositories/pengukuran.repository";
import { createPengukuranSchema } from "@/lib/validation/schemas";
import { publishBrokerEvent } from "@/lib/broker/rabbitmq";
import { BROKER_ROUTING_KEYS } from "@/lib/broker/events";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Sesi tidak valid." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const idAnak = searchParams.get("idAnak");

    let data;
    if (idAnak) {
      data = await pengukuranRepository.getByAnakId(idAnak);
    } else {
      data = await pengukuranRepository.getAll();
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/pengukuran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil riwayat pengukuran." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Sesi tidak valid." },
        { status: 401 },
      );
    }

    if (user.role !== "posyandu") {
      return NextResponse.json(
        { success: false, error: "Hanya petugas Posyandu yang berwenang mencatat hasil pengukuran." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const parsed = createPengukuranSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Input tidak valid",
        },
        { status: 400 },
      );
    }

    const result = await pengukuranRepository.create(parsed.data, user.id);

    // Producer: Terbitkan event pengukuran.created ke RabbitMQ Message Broker
    publishBrokerEvent(
      BROKER_ROUTING_KEYS.PENGUKURAN_CREATED,
      {
        idPengukuran: result.id,
        idAnak: result.idAnak,
        namaAnak: result.anak?.nama || "Balita",
        nikAnak: result.anak?.nik || "",
        usiaBulan: result.usiaBulan,
        beratKg: result.beratKg,
        tinggiCm: result.tinggiCm,
        statusGizi: result.statusGizi,
        zTbu: result.zTbu,
        zBbu: result.zBbu,
        zBbtb: result.zBbtb,
        idPosyandu: user.idPosyandu || "",
        namaPosyandu: user.namaPosyandu,
        rekomendasiAI: result.rekomendasi,
        isStuntingOrWasted:
          result.statusGizi === "stunting" ||
          result.statusGizi === "gizi_buruk" ||
          result.statusGizi === "gizi_kurang",
      },
      "posyandu",
    ).catch((err) => console.warn("[Message Broker] Publish pengukuran error:", err));

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Hasil pengukuran balita berhasil dianalisis & disimpan.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/pengukuran error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data pengukuran." },
      { status: 500 },
    );
  }
}
