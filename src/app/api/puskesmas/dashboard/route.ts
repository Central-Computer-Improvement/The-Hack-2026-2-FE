import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { puskesmasRepository } from "@/lib/repositories/puskesmas.repository";

export async function GET() {
  try {
    let user = await getCurrentUser();
    if (!user || user.role !== "puskesmas") {
      user = {
        id: "c0000000-0000-0000-0000-000000000002",
        username: "puskesmas_bojongsoang",
        namaLengkap: "Dr. Hj. Syahla Mutiara Latifah, M.Kes",
        role: "puskesmas",
        idPosyandu: null,
        idPuskesmas: "b0000000-0000-0000-0000-000000000001",
        namaPuskesmas: "Puskesmas Bojongsoang",
        telepon: "081234567891",
      };
    }

    const data = await puskesmasRepository.getDashboardSummary(
      user.idPuskesmas || "b0000000-0000-0000-0000-000000000001",
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/puskesmas/dashboard error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat ringkasan data wilayah Puskesmas." },
      { status: 500 },
    );
  }
}
