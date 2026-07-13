import Link from "next/link";

import type { CommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";
import { asRoute } from "@/src/navigation/as-route";
import { buildProductWorkspaceModel } from "@/src/services/command/build-workspace";

import { QuickCreateButton } from "./quick-create-button";

interface DatedMemory {
  date: string;
  label: string;
  title: string;
  detail: string;
  href: string;
}

export function ProductMemory({
  development,
  commercial,
}: {
  development: DevelopmentSnapshot;
  commercial: CommercialSnapshot;
}) {
  const continuation = buildProductWorkspaceModel(
    development,
    commercial,
  ).continuation;
  const product = continuation?.product ?? null;
  const configuration = continuation?.configuration ?? null;
  const formulas = product
    ? development.formulas.filter((item) => item.productId === product.id)
    : [];
  const experiments = product
    ? development.experiments.filter((item) => item.productId === product.id)
    : [];
  const notes = product
    ? development.notes.filter((item) => item.productId === product.id)
    : [];
  const decisions = product
    ? development.decisions.filter((item) => item.productId === product.id)
    : [];
  const entityIds = new Set(
    [
      product?.id,
      configuration?.id,
      ...formulas.map((item) => item.versionId),
      ...experiments.map((item) => item.id),
    ].filter((value): value is string => Boolean(value)),
  );
  const linkedDocumentIds = new Set(
    commercial.documentLinks
      .filter((item) => entityIds.has(item.entityId))
      .map((item) => item.documentId),
  );
  const documents = commercial.documents.filter(
    (item) => linkedDocumentIds.has(item.id) && !item.archivedAt,
  );

  const datedMemories: DatedMemory[] = [
    ...notes.map((note) => ({
      date: note.createdAt,
      label: labelFor(note.noteType),
      title: note.title,
      detail: note.content,
      href: product ? `/products/${product.slug}#development` : "/",
    })),
    ...decisions.map((decision) => ({
      date: decision.decisionDate,
      label: "Founder decision",
      title: decision.title,
      detail: decision.decision,
      href: product ? `/products/${product.slug}#decisions` : "/",
    })),
    ...experiments
      .filter((experiment) => experiment.productionDate)
      .map((experiment) => ({
        date: experiment.productionDate!,
        label: "Experiment observation",
        title: experiment.name,
        detail: experiment.conclusion ?? experiment.result,
        href: `/experiments/${experiment.id}`,
      })),
    ...formulas
      .filter((formula) => formula.updatedAt && formula.changeReason)
      .map((formula) => ({
        date: formula.updatedAt!,
        label: "Formula change",
        title: `${formula.familyName} ${formula.version}`,
        detail: formula.changeReason!,
        href: `/formulas/${formula.versionId}`,
      })),
    ...documents.map((document) => ({
      date: document.uploadedAt.toISOString(),
      label: "Document",
      title: document.title,
      detail: `${labelFor(document.documentType)} · ${labelFor(document.status)}`,
      href: `/documents/${document.id}`,
    })),
  ].sort((left, right) => Date.parse(right.date) - Date.parse(left.date));
  const featured = datedMemories[0] ?? null;

  return (
    <section
      className="command-workspace command-memory"
      aria-labelledby="product-memory-title"
    >
      <header className="command-section-heading">
        <div>
          <p className="eyebrow">Control · Institutional archive</p>
          <h2 id="product-memory-title">Product Memory</h2>
        </div>
        <p>
          Preserve meaningful product knowledge without a low-value activity
          feed.
        </p>
      </header>

      <div
        className="command-workspace-grid memory-grid"
        role="region"
        aria-label="Product memory modules"
        tabIndex={0}
      >
        <article className="command-feature memory-feature">
          <span className="command-feature-index" aria-hidden="true">
            04
          </span>
          <div>
            <p className="card-eyebrow">Recent meaningful memory</p>
            {featured ? (
              <>
                <time dateTime={featured.date}>
                  {new Date(featured.date).toLocaleDateString()}
                </time>
                <h3>{featured.title}</h3>
                <p>
                  {featured.label} · {featured.detail}
                </p>
                <Link
                  className="command-inline-action"
                  href={asRoute(featured.href)}
                >
                  Open memory
                </Link>
              </>
            ) : (
              <div className="command-honest-empty">
                <h3>No dated product memory recorded.</h3>
                <p>
                  Canonical definitions are not presented as recent notes,
                  decisions, or activity.
                </p>
              </div>
            )}
          </div>
        </article>

        <article className="command-instrument memory-instrument">
          <span className="instrument-icon" aria-hidden="true">
            ≡
          </span>
          <p className="card-eyebrow">Notes</p>
          <h3>
            {notes.length
              ? `${notes.length} product notes`
              : "No notes recorded"}
          </h3>
          <p>
            {notes[0]?.title ??
              "Research and product-development notes remain empty until recorded."}
          </p>
          {product ? (
            <Link href={asRoute(`/products/${product.slug}#development`)}>
              View notes
            </Link>
          ) : null}
        </article>

        <article className="command-instrument memory-instrument">
          <span className="instrument-icon" aria-hidden="true">
            ◆
          </span>
          <p className="card-eyebrow">Decisions</p>
          <h3>
            {decisions.length
              ? `${decisions.length} founder decisions`
              : "No decisions recorded"}
          </h3>
          <p>
            {decisions[0]?.title ??
              "No founder decision, reason, or supporting evidence is recorded."}
          </p>
          {product ? (
            <Link href={asRoute(`/products/${product.slug}#decisions`)}>
              View decisions
            </Link>
          ) : null}
        </article>

        <article className="command-instrument memory-instrument">
          <span className="instrument-icon" aria-hidden="true">
            ▤
          </span>
          <p className="card-eyebrow">Documents / history</p>
          <h3>
            {documents.length
              ? `${documents.length} linked documents`
              : "No documents linked"}
          </h3>
          <p>
            {documents[0]?.title ??
              (formulas[0]
                ? `Formula ${formulas[0].version} history · ${formulas[0].changeReason ?? "No change reason recorded"}`
                : "No formula or document history is linked.")}
          </p>
          <Link href="/modules/documents">Open documents</Link>
        </article>
      </div>

      <nav className="command-tool-rail" aria-label="Product memory tools">
        <span>Archive tools</span>
        <QuickCreateButton kind="product-note" className="command-rail-button">
          Add Product Note
        </QuickCreateButton>
        <QuickCreateButton
          kind="product-decision"
          className="command-rail-button"
        >
          Record Decision
        </QuickCreateButton>
        <Link href="/modules/documents">Open Documents</Link>
        {product ? (
          <Link href={asRoute(`/products/${product.slug}#development`)}>
            View Product History
          </Link>
        ) : (
          <span aria-disabled="true">Product history unavailable</span>
        )}
      </nav>
    </section>
  );
}
