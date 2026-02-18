"use server";

import { getAuthToken } from "@/lib/auth";
import { agreeToTerms } from "@/lib/api";

export async function agreeToTermsAction(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };

  const result = await agreeToTerms(token);
  if (!result)
    return { ok: false, error: "Failed to record agreement. Please try again." };

  return { ok: true };
}
