import { NextRequest, NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/api";
import { baseUrlFromHeaders } from "@/lib/base-url";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await requestPasswordReset(data, baseUrlFromHeaders(req.headers));

  if (result.ok) {
    return NextResponse.json(
      { ok: true, message: result.message, resetUrl: result.resetUrl ?? null },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { ok: false, error: result.error },
    { status: result.status || 400 }
  );
}