"use server";

import { getAuthToken } from "@/lib/auth";
import { getRequestBaseUrl } from "@/lib/base-url";
import {
  requestAccess,
  sendVerificationEmail,
  verifyEmail,
} from "@/lib/api";

export async function sendVerificationAction(): Promise<
  { ok: true; message: string } | { ok: false; error: string }
> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };
  return sendVerificationEmail(token, await getRequestBaseUrl());
}

export async function verifyEmailAction(
  verificationToken: string
): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
  // No auth required — the verification token itself carries identity.
  return verifyEmail(verificationToken);
}

export async function requestAccessAction(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };
  return requestAccess(token);
}
