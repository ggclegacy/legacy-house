"use client";

import { useMemo, useState } from "react";
import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";

type Decision = DevelopmentSnapshot["decisions"][number];

export function DecisionJournal({
  decisions,
  persistence,
}: {
  decisions: readonly Decision[];
  persistence: "database" | "unavailable";
}) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [message, setMessage] = useState<string | null>(null);
  const visible = useMemo(
    () =>
      decisions
        .filter((item) => filter === "all" || item.status === filter)
        .sort((left, right) =>
          sort === "oldest"
            ? left.decisionDate.localeCompare(right.decisionDate)
            : right.decisionDate.localeCompare(left.decisionDate),
        ),
    [decisions, filter, sort],
  );
  async function review(decisionId: string, formData: FormData) {
    const response = await fetch("/api/development/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "review_product_decision",
        decisionId,
        status: formData.get("status"),
        actualOutcome: formData.get("actualOutcome") || null,
      }),
    });
    const body = (await response.json()) as { error?: string };
    if (response.ok) window.location.reload();
    else setMessage(body.error ?? "Decision review failed.");
  }
  return (
    <>
      <div className="view-toolbar compact">
        <select
          aria-label="Filter decisions"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All decisions</option>
          {["recorded", "validated", "reversed", "superseded"].map((status) => (
            <option key={status} value={status}>
              {labelFor(status)}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort decisions"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
      <div className="decision-list">
        {visible.map((decision) => (
          <article key={decision.id}>
            <span>{labelFor(decision.status)}</span>
            <h3>{decision.title}</h3>
            <p>
              <strong>Decision:</strong> {decision.decision}
            </p>
            <p>
              <strong>Reason:</strong> {decision.reason}
            </p>
            {decision.evidence ? (
              <p>
                <strong>Evidence:</strong> {decision.evidence}
              </p>
            ) : null}
            {decision.expectedOutcome ? (
              <p>
                <strong>Expected:</strong> {decision.expectedOutcome}
              </p>
            ) : null}
            {decision.actualOutcome ? (
              <p>
                <strong>Actual:</strong> {decision.actualOutcome}
              </p>
            ) : null}
            <time>{decision.decisionDate}</time>
            <details>
              <summary>Review outcome</summary>
              <form
                action={review.bind(null, decision.id)}
                className="form-stack"
              >
                <label>
                  <span>Status</span>
                  <select name="status" defaultValue={decision.status}>
                    {["recorded", "validated", "reversed", "superseded"].map(
                      (status) => (
                        <option key={status} value={status}>
                          {labelFor(status)}
                        </option>
                      ),
                    )}
                  </select>
                </label>
                <label>
                  <span>Actual outcome</span>
                  <textarea
                    name="actualOutcome"
                    defaultValue={decision.actualOutcome ?? ""}
                  />
                </label>
                <button
                  className="button"
                  disabled={persistence !== "database"}
                >
                  Save review
                </button>
              </form>
            </details>
          </article>
        ))}
      </div>
      {message ? (
        <p className="inline-feedback" role="status">
          {message}
        </p>
      ) : null}
    </>
  );
}
