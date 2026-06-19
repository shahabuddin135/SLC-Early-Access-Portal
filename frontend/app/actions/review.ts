"use server";

import { getAuthToken } from "@/lib/auth";
import { submitReview, submitReviewByKey } from "@/lib/api";

export async function reviewAction(data: {
  project_link: string;
  review_text: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };

  return submitReview(token, data);
}

// No login required — the download key proves the author is a real SLC user.
export async function reviewByKeyAction(data: {
  key_value: string;
  project_link: string;
  review_text: string;
}): Promise<{ ok: true; name: string } | { ok: false; error: string }> {
  return submitReviewByKey(data);
}
