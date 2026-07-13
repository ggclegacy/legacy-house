"use client";

import { useState } from "react";

async function postAction(payload: Record<string, unknown>) {
  const response = await fetch("/api/development/actions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(body.error ?? "Record was not saved.");
}

export function ProductMemoryForms({
  productId,
  persistence,
}: {
  productId: string;
  persistence: "database" | "unavailable";
}) {
  const [message, setMessage] = useState<string | null>(null);
  async function addNote(formData: FormData) {
    try {
      await postAction({
        action: "add_product_note",
        productId,
        noteType: formData.get("noteType"),
        title: formData.get("title"),
        content: formData.get("content"),
      });
      setMessage("Product note recorded. Refresh to view the timeline.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Note failed.");
    }
  }
  async function addDecision(formData: FormData) {
    try {
      await postAction({
        action: "record_product_decision",
        productId,
        title: formData.get("title"),
        decision: formData.get("decision"),
        reason: formData.get("reason"),
        evidence: formData.get("evidence") || null,
        expectedOutcome: formData.get("expectedOutcome") || null,
        decisionDate: formData.get("decisionDate"),
        reviewDate: formData.get("reviewDate") || null,
      });
      setMessage("Founder decision recorded. Refresh to view the timeline.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Decision failed.");
    }
  }
  return (
    <div className="memory-forms">
      {message ? (
        <p className="inline-feedback" role="status">
          {message}
        </p>
      ) : null}
      <form action={addNote} className="memory-form">
        <h3>Add product note</h3>
        <label>
          <span>Type</span>
          <select name="noteType" defaultValue="general">
            <option value="research">Research</option>
            <option value="product_idea">Product Idea</option>
            <option value="testing">Testing</option>
            <option value="general">General</option>
          </select>
        </label>
        <label>
          <span>Title</span>
          <input name="title" required />
        </label>
        <label>
          <span>Content</span>
          <textarea name="content" rows={4} required />
        </label>
        <button className="button" disabled={persistence !== "database"}>
          Add note
        </button>
      </form>
      <form action={addDecision} className="memory-form">
        <h3>Record founder decision</h3>
        <label>
          <span>Title</span>
          <input name="title" required />
        </label>
        <label>
          <span>Decision</span>
          <textarea name="decision" rows={3} required />
        </label>
        <label>
          <span>Reason</span>
          <textarea name="reason" rows={3} required />
        </label>
        <label>
          <span>Evidence or future document reference</span>
          <textarea name="evidence" rows={2} />
        </label>
        <label>
          <span>Expected outcome</span>
          <textarea name="expectedOutcome" rows={2} />
        </label>
        <label>
          <span>Decision date</span>
          <input type="date" name="decisionDate" required />
        </label>
        <label>
          <span>Review date</span>
          <input type="date" name="reviewDate" />
        </label>
        <button className="button" disabled={persistence !== "database"}>
          Record decision
        </button>
      </form>
    </div>
  );
}
