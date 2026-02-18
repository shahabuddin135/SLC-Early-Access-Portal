import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { readFile } from "fs/promises";
import path from "path";
import { getAuthToken } from "@/lib/auth";

function validateKey(userKey: string): boolean {
  const expected = process.env.DOWNLOAD_KEY ?? "";
  if (!expected) return false;
  // Constant-time comparison via SHA-256 hashing
  const a = createHash("sha256").update(userKey).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function GET(req: NextRequest) {
  // 1. Validate auth cookie — user must be logged in
  const token = await getAuthToken();
  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. Validate download key — prevents unauthenticated file access
  const key = req.nextUrl.searchParams.get("key") ?? "";
  if (!validateKey(key)) {
    return new NextResponse("Forbidden: invalid download key", { status: 403 });
  }

  // 3. Stream the file — only reachable with valid auth + valid key
  try {
    // Path is relative to project root (outside public/ — never statically served)
    const filePath = path.join(process.cwd(), "files", "slc-framework.zip");
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="slc-framework.zip"',
        "Content-Length": fileBuffer.byteLength.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
