"use server";

import { getAuthToken } from "@/lib/auth";
import { generateAdminKeys, listAdminKeys, KeysResponse, DownloadKey } from "@/lib/api";

export async function listKeysAction(): Promise<
  { ok: true; data: KeysResponse } | { ok: false; error: string }
> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };

  const result = await listAdminKeys(token);
  if (!result) return { ok: false, error: "Failed to load keys. Are you an admin?" };

  return { ok: true, data: result };
}

export async function generateKeysAction(
  count: number
): Promise<{ ok: true; keys: DownloadKey[] } | { ok: false; error: string }> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };

  const result = await generateAdminKeys(token, count);
  if (!result) return { ok: false, error: "Failed to generate keys. Are you an admin?" };

  return { ok: true, keys: result };
}
