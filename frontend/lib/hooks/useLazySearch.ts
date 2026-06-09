import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";

export interface SearchPage<T, S> {
  items: T[];
  stats: S;
}

interface UseLazySearchArgs<T, S> {
  pageSize?: number;
  initial: SearchPage<T, S>;
  /** Fetches one page. Must be stable (wrap in useCallback). */
  fetcher: (params: {
    q: string;
    status: string;
    limit: number;
    offset: number;
  }) => Promise<SearchPage<T, S> | null>;
}

/**
 * Drives a debounced + filtered + lazy-loaded (offset paged) list. Page 0 reloads
 * whenever the debounced query or status filter changes; `loadMore` appends the next
 * page. `hasMore` uses a page-fill heuristic so it works regardless of whether the
 * endpoint reports a filtered total.
 */
export function useLazySearch<T, S>({
  pageSize = 20,
  initial,
  fetcher,
}: UseLazySearchArgs<T, S>) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const debouncedQuery = useDebouncedValue(query, 300);

  const [items, setItems] = useState<T[]>(initial.items);
  const [stats, setStats] = useState<S>(initial.stats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(initial.items.length >= pageSize);

  const firstRun = useRef(true);

  // (Re)load page 0 whenever the search criteria change.
  useEffect(() => {
    // Skip the first run for default criteria — SSR already gave us page 0.
    if (firstRun.current) {
      firstRun.current = false;
      if (debouncedQuery === "" && status === "all") return;
    }

    let cancelled = false;
    // Intentional: this effect fetches a fresh page 0 when the search criteria
    // change, and flips the loading flag while it's in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    fetcher({ q: debouncedQuery, status, limit: pageSize, offset: 0 }).then((res) => {
      if (cancelled) return;
      if (res) {
        setItems(res.items);
        setStats(res.stats);
        setHasMore(res.items.length >= pageSize);
      } else {
        setError("Failed to load. Are you still signed in as an admin?");
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, status, pageSize, fetcher]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const res = await fetcher({
      q: debouncedQuery,
      status,
      limit: pageSize,
      offset: items.length,
    });
    if (res) {
      setItems((prev) => [...prev, ...res.items]);
      setStats(res.stats);
      setHasMore(res.items.length >= pageSize);
    }
    setLoading(false);
  }, [loading, hasMore, fetcher, debouncedQuery, status, pageSize, items.length]);

  /** Reload the currently-loaded window in place (e.g. after grant/deny). */
  const refresh = useCallback(async () => {
    const limit = Math.max(pageSize, items.length);
    const res = await fetcher({ q: debouncedQuery, status, limit, offset: 0 });
    if (res) {
      setItems(res.items);
      setStats(res.stats);
      setHasMore(res.items.length >= limit);
    }
  }, [fetcher, debouncedQuery, status, pageSize, items.length]);

  return {
    query,
    setQuery,
    status,
    setStatus,
    items,
    stats,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
