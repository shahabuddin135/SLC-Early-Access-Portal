"use server";

import { getAuthToken } from "@/lib/auth";
import { submitReview } from "@/lib/api";

export async function reviewAction(data: {
  project_link: string;
  review_text: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };

  return submitReview(token, data);
}
