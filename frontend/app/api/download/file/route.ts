import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

/**
 * Proxy route — requires:
 *  1. Valid slc_token httpOnly cookie (user is authenticated)
 *  2. Valid single-use download token from /api/v1/redeem (60s TTL)
 *
 * The real file URL is NEVER sent to the client. It lives only in
 * DOWNLOAD_FILE_URL on the FastAPI server.
 */
export async function GET(req: NextRequest) {
  // 1. Auth check
  const authToken = await getAuthToken();
  if (!authToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. Download token
  const downloadToken = req.nextUrl.searchParams.get("token");
  if (!downloadToken) {
    return new NextResponse("Missing download token", { status: 400 });
  }

  // 3. Proxy to FastAPI — which validates token + streams the file
  try {
    const backendRes = await fetch(
      `${BACKEND_URL}/api/v1/download?token=${encodeURIComponent(downloadToken)}`,
      { cache: "no-store" }
    );

    if (!backendRes.ok) {
      const msg =
        backendRes.status === 403
          ? "Download token expired or already used."
          : "File download failed.";
      return new NextResponse(msg, { status: backendRes.status });
    }

    // Pipe stream directly to client
    return new NextResponse(backendRes.body, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="slc-framework.zip"',
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Internal error during download", { status: 500 });
  }
}

