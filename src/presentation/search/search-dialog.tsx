"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useRef, useState } from "react";

import { searchEntries, type SearchGroup } from "@/src/search/search-registry";
import { developmentSearchEntries } from "@/src/search/search-registry";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";

const groupOrder: readonly SearchGroup[] = [
  "Navigation",
  "Products",
  "Formulas",
  "Ingredients",
  "Experiments",
  "Product notes",
  "Product decisions",
  "Product lines",
  "Settings",
  "Documentation",
];

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [liveEntries, setLiveEntries] = useState<
    ReturnType<typeof developmentSearchEntries>
  >([]);
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    const base = searchEntries(query);
    const dynamic = liveEntries.filter((entry) =>
      [entry.label, entry.description, ...entry.keywords]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalized),
    );
    return [
      ...new Map(
        [...base, ...dynamic].map((entry) => [entry.id, entry]),
      ).values(),
    ];
  }, [liveEntries, query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      window.setTimeout(() => inputRef.current?.focus(), 0);
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/development")
      .then(async (response) => (await response.json()) as DevelopmentSnapshot)
      .then((snapshot) => setLiveEntries(developmentSearchEntries(snapshot)))
      .catch(() => setLiveEntries([]));
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="command-dialog search-dialog"
      aria-labelledby="search-title"
      onClose={onClose}
      onCancel={onClose}
    >
      <div className="dialog-heading">
        <div>
          <p className="eyebrow">Global search</p>
          <h2 id="search-title">Find your way through the House.</h2>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Close search"
        >
          ×
        </button>
      </div>
      <label className="search-field">
        <span className="sr-only">Search destinations</span>
        <span aria-hidden="true">⌕</span>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products, formulas, ingredients, experiments…"
        />
        <kbd>Esc</kbd>
      </label>
      <div className="search-results" aria-live="polite">
        {results.length ? (
          groupOrder.map((group) => {
            const entries = results.filter((entry) => entry.group === group);
            if (!entries.length) return null;
            return (
              <section
                key={group}
                aria-labelledby={`search-${group.replace(" ", "-")}`}
              >
                <h3 id={`search-${group.replace(" ", "-")}`}>{group}</h3>
                <ul>
                  {entries.map((entry) => (
                    <li key={entry.id}>
                      <Link href={entry.href as Route} onClick={onClose}>
                        <strong>{entry.label}</strong>
                        <span>{entry.description}</span>
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })
        ) : (
          <div className="dialog-empty">
            <strong>No registered destination matches “{query}”.</strong>
            <p>Try a module, product line, setting, or documentation topic.</p>
          </div>
        )}
      </div>
    </dialog>
  );
}
