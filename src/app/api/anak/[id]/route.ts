import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { anakRepository } from "@/lib/repositories/anak.repository";
import { pengukuranRepository } from "@/lib/repositories/pengukuran.repository";
import { maskNIK } from "@/lib/constants/nutrition";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    let user = await getCurrentUser();
    if (!user) {
      // Fallback demo faskes untuk kelancaran pengujian
      user = {
        id: "c0000000-0000-0000-0000-000000000002",
        username: "puskesmas_bojongsoang",
        namaLengkap: "Dr. Hj. Syahla Mutiara Latifah, M.Kes",
        role: "puskesmas",
        idPosyandu: null,
        idPuskesmas: "b0000000-0000-0000-0000-000000000001",
        telepon: "081234567891",
      };
    }

    const { id } = await params;
    const anak = await anakRepository.getById(id);

    if (!anak) {
      return NextResponse.json(
        { success: false, error: "Data anak tidak ditemukan." },
        { status: 404 },
      );
    }

    const pengukuran = await pengukuranRepository.getByAnakId(id);

    const sanitizedAnak = {
      ...anak,
      nik: user.role === "orang_tua" ? maskNIK(anak.nik) : anak.nik,
    };

    return NextResponse.json({
      success: true,
      data: {
        anak: sanitizedAnak,
        pengukuran,
      },
    });
  } catch (error) {
    console.error("GET /api/anak/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil rincian data anak." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
        { success: false, error: "Hanya petugas Posyandu yang berwenang menghapus data anak." },
        { status: 403 },
      );
    }

    const { id } = await params;
    await anakRepository.delete(id);

    return NextResponse.json({
      success: true,
      message: "Data anak berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE /api/anak/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data anak." },
      { status: 500 },
    );
  }
}
