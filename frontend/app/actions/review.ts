"use server";

import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/lib/auth";
import { getDashboard, submitReview } from "@/lib/api";

export type ReviewSession =
  | { signedIn: false }
  | { signedIn: true; name: string; emailVerified: boolean };

// Called by the Builder Archive modal when it opens. The landing page itself
// stays static — the session is only read on demand, inside this action.
export async function reviewSessionAction(): Promise<ReviewSession> {
  const token = await getAuthToken();
  if (!token) return { signedIn: false };

  const user = await getDashboard(token);
  if (!user) return { signedIn: false };

  return { signedIn: true, name: user.name, emailVerified: user.email_verified };
}

export async function reviewAction(data: {
  project_link: string;
  review_text: string;
}): Promise<{ ok: true; name: string } | { ok: false; error: string }> {
  const token = await getAuthToken();
  if (!token) return { ok: false, error: "Please sign in to file a review." };

  const result = await submitReview(token, data);
  // The archive on the landing page is cached — let the new record through.
  if (result.ok) revalidatePath("/");
  return result;
}
