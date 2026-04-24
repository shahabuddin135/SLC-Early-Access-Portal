import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/lib/api";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await resetPassword(data);

  if (result.ok) {
    return NextResponse.json({ ok: true, message: result.message }, { status: 200 });
  }

  return NextResponse.json(
    { ok: false, error: result.error },
    { status: result.status || 400 }
  );
}