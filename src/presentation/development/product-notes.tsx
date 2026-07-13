"use client";

import { useMemo, useState } from "react";

import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";

type ProductNote = DevelopmentSnapshot["notes"][number];

const noteTypes = [
  "research",
  "product_idea",
  "sourcing",
  "packaging",
  "testing",
  "launch",
  "market_feedback",
  "general",
] as const;

export function ProductNotes({
  notes,
  persistence,
}: {
  notes: readonly ProductNote[];
  persistence: "database" | "unavailable";
}) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [message, setMessage] = useState<string | null>(null);
  const visible = useMemo(
    () =>
      [...notes]
        .filter((note) => filter === "all" || note.noteType === filter)
        .sort((left, right) => {
          if (sort === "title") return left.title.localeCompare(right.title);
          return sort === "oldest"
            ? left.createdAt.localeCompare(right.createdAt)
            : right.createdAt.localeCompare(left.createdAt);
        }),
    [filter, notes, sort],
  );

  async function editNote(note: ProductNote, formData: FormData) {
    const response = await fetch("/api/development/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_product_note",
        noteId: note.id,
        noteType: formData.get("noteType"),
        title: formData.get("title"),
        content: formData.get("content"),
        expectedUpdatedAt: note.updatedAt,
      }),
    });
    const body = (await response.json()) as { error?: string };
    if (response.ok) window.location.reload();
    else setMessage(body.error ?? "Product note was not updated.");
  }

  return (
    <div className="product-notes-workspace">
      <div className="view-toolbar compact">
        <select
          aria-label="Filter product notes"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All note types</option>
          {noteTypes.map((type) => (
            <option key={type} value={type}>
              {labelFor(type)}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort product notes"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title</option>
        </select>
      </div>
      {message ? (
        <p className="inline-feedback" role="status">
          {message}
        </p>
      ) : null}
      <div className="memory-list">
        {visible.map((note) => (
          <article key={note.id}>
            <p className="card-eyebrow">{labelFor(note.noteType)}</p>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <time dateTime={note.createdAt}>
              {new Date(note.createdAt).toLocaleDateString()}
            </time>
            <details>
              <summary>Open and edit note</summary>
              <form action={editNote.bind(null, note)} className="form-stack">
                <label>
                  <span>Type</span>
                  <select name="noteType" defaultValue={note.noteType}>
                    {noteTypes.map((type) => (
                      <option key={type} value={type}>
                        {labelFor(type)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Title</span>
                  <input name="title" defaultValue={note.title} required />
                </label>
                <label>
                  <span>Content</span>
                  <textarea
                    name="content"
                    defaultValue={note.content}
                    rows={5}
                    required
                  />
                </label>
                <button
                  className="button"
                  disabled={persistence !== "database"}
                >
                  Save note edit
                </button>
              </form>
            </details>
          </article>
        ))}
      </div>
      {!visible.length ? (
        <div className="record-empty">
          <strong>No product notes match this filter.</strong>
          <p>Missing product memory remains explicit.</p>
        </div>
      ) : null}
    </div>
  );
}
