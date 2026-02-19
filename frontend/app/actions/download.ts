"use server";

import { getAuthToken } from "@/lib/auth";
import { redeemKey } from "@/lib/api";

/**
 * Redeem a one-time download key.
 * On success, returns a short-lived (60s) download token the client
 * passes to /api/download/file?token=<value>.
 */
export async function downloadAction(
  keyValue: string
): Promise<{ ok: true; downloadToken: string } | { ok: false; error: string }> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };

  const result = await redeemKey(token, keyValue);
  if (!result) {
    return {
      ok: false,
      error: "Invalid or already used download key. Contact wewiselabs@gmail.com for a new key.",
    };
  }

  return { ok: true, downloadToken: result.download_token };
}
