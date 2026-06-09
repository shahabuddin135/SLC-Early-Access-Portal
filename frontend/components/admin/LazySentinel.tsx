"use client";

import { useEffect, useRef } from "react";

interface LazySentinelProps {
  enabled: boolean;
  loading: boolean;
  onVisible: () => void;
  onLoadMore: () => void;
}

/**
 * Renders an IntersectionObserver sentinel for infinite scroll, plus a
 * "Load more" button fallback. Calls `onVisible` when scrolled into view.
 */
export default function LazySentinel({
  enabled,
  loading,
  onVisible,
  onLoadMore,
}: LazySentinelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onVisible();
      },
      { rootMargin: "120px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, onVisible]);

  if (!enabled && !loading) return null;

  return (
    <div ref={ref} style={{ textAlign: "center", padding: "16px 0" }}>
      {loading ? (
        <span className="spinner" aria-label="Loading more" />
      ) : (
        enabled && (
          <button
            type="button"
            className="btn-secondary"
            style={{ width: "auto", padding: "6px 18px", fontSize: "0.8125rem" }}
            onClick={onLoadMore}
          >
            Load more
          </button>
        )
      )}
    </div>
  );
}
