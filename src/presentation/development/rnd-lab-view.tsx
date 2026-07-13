"use client";

import Link from "next/link";
import { useState } from "react";

import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentExperiment } from "@/src/domain/development/snapshot";
import { asRoute } from "@/src/navigation/as-route";

export function RndLabView({
  experiments,
}: {
  experiments: readonly DevelopmentExperiment[];
}) {
  const [view, setView] = useState("all");
  const views = [
    "all",
    "planned",
    "in_progress",
    "resting",
    "observation_period",
    "completed",
    "needs_revision",
    "failed",
    "archived",
  ];
  const filtered = experiments.filter(
    (experiment) =>
      view === "all" ||
      (view === "needs_revision" || view === "failed"
        ? experiment.result === view
        : experiment.status === view),
  );
  return (
    <>
      <div className="vault-tabs" role="tablist" aria-label="Experiment views">
        {views.map((status) => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={view === status}
            onClick={() => setView(status)}
          >
            {status === "observation_period"
              ? "Observation Due"
              : labelFor(status)}
          </button>
        ))}
      </div>
      <div className="rnd-board">
        {filtered.length ? (
          filtered.map((experiment) => (
            <article key={experiment.id} className="experiment-card">
              <p className="card-eyebrow">{experiment.experimentNumber}</p>
              <h2>
                <Link href={asRoute(`/experiments/${experiment.id}`)}>
                  {experiment.name}
                </Link>
              </h2>
              <p>{experiment.objective}</p>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{labelFor(experiment.status)}</dd>
                </div>
                <div>
                  <dt>Result</dt>
                  <dd>{labelFor(experiment.result)}</dd>
                </div>
                <div>
                  <dt>Observations</dt>
                  <dd>{experiment.observationCount}</dd>
                </div>
              </dl>
            </article>
          ))
        ) : (
          <div className="record-empty">
            <strong>No experiments recorded.</strong>
            <p>
              Create an experiment only after selecting a persisted product and
              exact formula version. No observations are fabricated.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
