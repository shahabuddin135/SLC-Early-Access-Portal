"use server";

import { getAuthToken } from "@/lib/auth";
import { getRequestBaseUrl } from "@/lib/base-url";
import {
  adminKeySuggestions,
  adminRequestSuggestions,
  denyAdminRequest,
  generateAdminKeys,
  grantAdminRequest,
  listAdminKeys,
  listAdminRequests,
  DownloadKey,
  KeysResponse,
  RequestsResponse,
  SearchParams,
} from "@/lib/api";

// ── Keys ──────────────────────────────────────────────────────────────────────

export async function listKeysAction(
  params: SearchParams = {}
): Promise<{ ok: true; data: KeysResponse } | { ok: false; error: string }> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };

  const result = await listAdminKeys(token, params);
  if (!result) return { ok: false, error: "Failed to load keys. Are you an admin?" };

  return { ok: true, data: result };
}

export async function keySuggestionsAction(q: string): Promise<string[]> {
  const token = await getAuthToken();
  if (!token) return [];
  return adminKeySuggestions(token, q);
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

// ── Access requests ───────────────────────────────────────────────────────────

export async function listRequestsAction(
  params: SearchParams = {}
): Promise<{ ok: true; data: RequestsResponse } | { ok: false; error: string }> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };

  const result = await listAdminRequests(token, params);
  if (!result) return { ok: false, error: "Failed to load requests. Are you an admin?" };

  return { ok: true, data: result };
}

export async function requestSuggestionsAction(q: string): Promise<string[]> {
  const token = await getAuthToken();
  if (!token) return [];
  return adminRequestSuggestions(token, q);
}

export async function grantRequestAction(
  id: number
): Promise<
  | { ok: true; keyValue: string; emailSent: boolean }
  | { ok: false; error: string }
> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };
  return grantAdminRequest(token, id, await getRequestBaseUrl());
}

export async function denyRequestAction(
  id: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };
  return denyAdminRequest(token, id);
}
