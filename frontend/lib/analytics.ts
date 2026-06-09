// Thin wrapper around posthog-js so components can fire events without each one
// worrying about whether analytics is configured. All calls no-op safely when
// NEXT_PUBLIC_POSTHOG_KEY is unset or PostHog hasn't initialised yet.
import posthog from "posthog-js";

export function capture(
  event: string,
  properties?: Record<string, unknown>
): void {
  try {
    if (typeof window === "undefined") return;
    if (!posthog.__loaded) return;
    posthog.capture(event, properties);
  } catch {
    // analytics must never break the app
  }
}

export function identify(
  distinctId: string,
  properties?: Record<string, unknown>
): void {
  try {
    if (typeof window === "undefined") return;
    if (!posthog.__loaded) return;
    posthog.identify(distinctId, properties);
  } catch {
    /* noop */
  }
}

export function resetIdentity(): void {
  try {
    if (typeof window === "undefined") return;
    if (!posthog.__loaded) return;
    posthog.reset();
  } catch {
    /* noop */
  }
}
