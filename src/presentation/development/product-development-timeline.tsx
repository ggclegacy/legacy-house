import Link from "next/link";

import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";
import { asRoute } from "@/src/navigation/as-route";

type ActivityEvent = DevelopmentSnapshot["activity"][number];
type Formula = DevelopmentSnapshot["formulas"][number];
type Experiment = DevelopmentSnapshot["experiments"][number];

export interface TimelineEntry {
  id: string;
  title: string;
  explanation: string;
  occurredAt: string;
  relatedRecord: string;
  href?: string;
  count: number;
}

export function buildDevelopmentTimeline({
  events,
  productName,
  productSlug,
  formulas,
  experiments,
}: {
  events: readonly ActivityEvent[];
  productName: string;
  productSlug: string;
  formulas: readonly Formula[];
  experiments: readonly Experiment[];
}): TimelineEntry[] {
  const entries = events.map((event) => {
    const formula = formulas.find(
      (item) =>
        item.versionId === event.entityId || item.familyId === event.entityId,
    );
    const experiment = experiments.find((item) => item.id === event.entityId);
    const productEvent = event.entityType === "product";
    return {
      id: event.id,
      title: event.title,
      explanation: event.description ?? labelFor(event.action),
      occurredAt: event.createdAt,
      relatedRecord: productEvent
        ? productName
        : formula
          ? `${formula.familyName} · Version ${formula.version}`
          : experiment
            ? `${experiment.experimentNumber} · ${experiment.name}`
            : labelFor(event.entityType),
      href: productEvent
        ? `/products/${productSlug}#overview`
        : formula
          ? `/formulas/${formula.versionId}`
          : experiment
            ? `/experiments/${experiment.id}`
            : undefined,
      count: 1,
      groupKey: `${event.entityType}:${event.entityId}:${event.action}:${event.title}:${event.createdAt.slice(0, 10)}`,
    };
  });

  const grouped = new Map<string, (typeof entries)[number]>();
  for (const entry of entries) {
    const existing = grouped.get(entry.groupKey);
    if (existing) existing.count += 1;
    else grouped.set(entry.groupKey, { ...entry });
  }
  return [...grouped.values()]
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
    .map((entry): TimelineEntry => ({
      id: entry.id,
      title: entry.title,
      explanation: entry.explanation,
      occurredAt: entry.occurredAt,
      relatedRecord: entry.relatedRecord,
      href: entry.href,
      count: entry.count,
    }));
}

export function ProductDevelopmentTimeline({
  events,
  productName,
  productSlug,
  formulas,
  experiments,
}: {
  events: readonly ActivityEvent[];
  productName: string;
  productSlug: string;
  formulas: readonly Formula[];
  experiments: readonly Experiment[];
}) {
  const timeline = buildDevelopmentTimeline({
    events,
    productName,
    productSlug,
    formulas,
    experiments,
  });

  if (!timeline.length)
    return (
      <div className="record-empty">
        <strong>No persisted development activity.</strong>
        <p>Seed definitions do not manufacture timeline history.</p>
      </div>
    );

  return (
    <ol className="activity-timeline product-development-timeline">
      {timeline.map((entry) => (
        <li key={entry.id}>
          <time dateTime={entry.occurredAt}>
            {new Date(entry.occurredAt).toLocaleString()}
          </time>
          <div>
            <strong>
              {entry.title}
              {entry.count > 1 ? ` · ${entry.count} events` : ""}
            </strong>
            <p>{entry.explanation}</p>
          </div>
          <div className="timeline-related-record">
            <span>{entry.relatedRecord}</span>
            {entry.href ? (
              <Link className="text-link" href={asRoute(entry.href)}>
                Open →
              </Link>
            ) : (
              <small>No direct route</small>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
