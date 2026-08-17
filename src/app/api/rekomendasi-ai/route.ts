import { NextResponse } from "next/server";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `Kamu adalah asisten edukasi gizi untuk petugas posyandu dan tenaga kesehatan di Indonesia.

ATURAN KETAT:
1. Status gizi anak SUDAH FINAL dihitung berdasar standar WHO/Permenkes No. 2/2020. DILARANG mendiagnosis ulang atau mengubah angka Z-score.
2. Buatkan 1 paragraf ringkas (2-3 kalimat) saran tindak lanjut edukatif yang diawali dengan format persis:
   "[ANALISIS MEDIS KEMENKES RI & WHO] Pasien {nama} ({usia} Bulan) terindikasi status {status} dengan Z-Score BB/TB {zScoreBBTB} (BB {bb} kg pada TB {tb} cm). [Saran edukatif pola asuh/asupan dan anjuran rujukan faskes jika berisiko tinggi]."
3. DILARANG meresepkan obat atau dosis suplemen spesifik.
4. Jangan gunakan formatting markdown berlebih (tanpa bold/bintang-bintang).`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY belum dikonfigurasi di server." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      nama,
      usiaBulan,
      jenisKelamin,
      beratKg,
      tinggiCm,
      statusGizi,
      zScoreBBU,
      zScoreTBU,
      zScoreBBTB,
    } = body;

    const userPrompt = `Data Pasien:
- Nama: ${nama}
- Umur: ${usiaBulan} bulan
- Jenis Kelamin: ${jenisKelamin}
- Berat Badan: ${beratKg} kg
- Tinggi Badan: ${tinggiCm} cm
- Status Gizi Utama: ${statusGizi}
- Z-Score BB/U: ${zScoreBBU}
- Z-Score TB/U: ${zScoreTBU}
- Z-Score BB/TB: ${zScoreBBTB}

Buatkan rekomendasi tindak lanjut gizi sesuai format sistem.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.3,
        },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Gemini API Error: ${response.status} - ${errText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!generatedText) {
      return NextResponse.json(
        { error: "Model tidak menghasilkan teks rekomendasi." },
        { status: 500 }
      );
    }

    return NextResponse.json({ rekomendasi: generatedText }, { status: 200 });
  } catch (error) {
    const errMsg =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan internal pada endpoint AI.";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
