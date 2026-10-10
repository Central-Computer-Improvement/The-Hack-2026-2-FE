import { NextResponse } from "next/server";
import { getBrokerStatus } from "@/lib/broker/rabbitmq";

export async function GET() {
  try {
    const status = await getBrokerStatus();
    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
