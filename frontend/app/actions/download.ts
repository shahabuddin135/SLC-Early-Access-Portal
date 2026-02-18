"use server";

import { createHash, timingSafeEqual } from "crypto";

import { getAuthToken } from "@/lib/auth";
import { triggerDownload } from "@/lib/api";

function validateKey(userKey: string): boolean {
  const expected = process.env.DOWNLOAD_KEY ?? "";
  if (!expected) return false;
  // Hash both to prevent length-based timing leaks, then constant-time compare
  const a = createHash("sha256").update(userKey).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function downloadAction(
  key: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!validateKey(key)) {
    return {
      ok: false,
      error:
        "Invalid download key. Contact the portal creator to obtain your key.",
    };
  }

  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };

  const result = await triggerDownload(token, key);
  if (!result)
    return { ok: false, error: "Failed to record download. Please try again." };

  return { ok: true };
}
