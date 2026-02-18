import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/api";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await loginUser(data);

  if (result.ok) {
    await setAuthCookie(result.token);
    return NextResponse.json({ ok: true, user: result.user }, { status: 200 });
  }
  return NextResponse.json(
    { ok: false, error: result.error },
    { status: result.status || 400 }
  );
}
