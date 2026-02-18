import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/api";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await registerUser(data);

  if (result.ok) {
    return NextResponse.json({ ok: true, user: result.user }, { status: 201 });
  }
  return NextResponse.json(
    { ok: false, error: result.error },
    { status: result.status || 400 }
  );
}
