"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";

interface StatusOption {
  value: string;
  label: string;
}

interface SmartSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  status: string;
  onStatusChange: (s: string) => void;
  statusOptions: StatusOption[];
  fetchSuggestions: (q: string) => Promise<string[]>;
  placeholder?: string;
  loading?: boolean;
}

export default function SmartSearch({
  query,
  onQueryChange,
  status,
  onStatusChange,
  statusOptions,
  fetchSuggestions,
  placeholder = "Search…",
  loading = false,
}: SmartSearchProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounced = useDebouncedValue(query, 250);
  const reqId = useRef(0);

  // Fetch suggestions for the debounced query (race-safe).
  useEffect(() => {
    const term = debounced.trim();
    if (term.length < 1) {
      // Clear stale suggestions when the query is emptied.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }
    const id = ++reqId.current;
    fetchSuggestions(term).then((res) => {
      if (id !== reqId.current) return; // stale response
      setSuggestions(res);
      setActiveIndex(-1);
    });
  }, [debounced, fetchSuggestions]);

  // Close the dropdown on outside click.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(value: string) {
    onQueryChange(value);
    setOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      pick(suggestions[activeIndex]);
    }
  }

  const showDropdown = open && suggestions.length > 0;

  return (
    <div className="smart-search" style={{ marginBottom: 16 }}>
      <div ref={containerRef} style={{ position: "relative" }}>
        <div style={{ position: "relative" }}>
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-muted)",
              fontSize: "0.875rem",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            className="input"
            style={{ paddingLeft: 34, paddingRight: 30 }}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
            role="combobox"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
            }
          />
          {loading && (
            <span
              className="spinner"
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}
            />
          )}
        </div>

        {showDropdown && (
          <ul id={listboxId} role="listbox" className="suggestions-dropdown">
            {suggestions.map((s, i) => (
              <li
                key={s}
                id={`${listboxId}-opt-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className={`suggestion-item${i === activeIndex ? " active" : ""}`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault(); // keep focus, avoid input blur first
                  pick(s);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Status filter chips */}
      <div className="filter-chips">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`filter-chip${status === opt.value ? " active" : ""}`}
            onClick={() => onStatusChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
