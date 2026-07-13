"use client";

import { useState } from "react";

async function post(payload: Record<string, unknown>) {
  const response = await fetch("/api/development/actions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Experiment update failed.");
}

export function ExperimentControls({
  experimentId,
  status,
  persistence,
}: {
  experimentId: string;
  status: string;
  persistence: "database" | "unavailable";
}) {
  const [message, setMessage] = useState<string | null>(null);
  async function observation(formData: FormData) {
    const optionalScore = (name: string) => {
      const value = formData.get(name);
      return value ? Number(value) : null;
    };
    try {
      await post({
        action: "add_observation",
        experimentId,
        observationType: formData.get("observationType"),
        observedAt: new Date(String(formData.get("observedAt"))).toISOString(),
        notes: formData.get("notes") || null,
        colorScore: optionalScore("colorScore"),
        aromaStrengthScore: optionalScore("aromaStrengthScore"),
        absorptionScore: optionalScore("absorptionScore"),
        greasinessScore: optionalScore("greasinessScore"),
        slipScore: optionalScore("slipScore"),
        hairFeelScore: optionalScore("hairFeelScore"),
        beardFeelScore: optionalScore("beardFeelScore"),
        skinFeelScore: optionalScore("skinFeelScore"),
        stainingObserved: formData.get("stainingObserved") === "on",
        separationObserved: formData.get("separationObserved") === "on",
        sedimentObserved: formData.get("sedimentObserved") === "on",
        cloudinessObserved: formData.get("cloudinessObserved") === "on",
      });
      setMessage("Observation recorded. Refresh to view updated evidence.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Observation failed.",
      );
    }
  }
  async function complete(formData: FormData) {
    try {
      await post({
        action: "complete_experiment",
        experimentId,
        result: formData.get("result"),
        conclusion: formData.get("conclusion"),
        nextChange: formData.get("nextChange") || null,
      });
      setMessage("Experiment completed. Refresh to view its final state.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Completion failed.");
    }
  }
  async function updateStatus(next: string) {
    try {
      await post({
        action: "update_experiment_status",
        experimentId,
        status: next,
      });
      window.location.reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Status update failed.",
      );
    }
  }
  return (
    <div className="experiment-forms">
      {message ? (
        <p role="status" className="inline-feedback">
          {message}
        </p>
      ) : null}
      <div className="memory-form">
        <h2>Experiment status</h2>
        <p>
          Start and advance this experiment explicitly; no timer changes
          controlled state.
        </p>
        <label>
          <span>Status</span>
          <select
            value={status}
            onChange={(event) => updateStatus(event.target.value)}
            disabled={persistence !== "database" || status === "completed"}
          >
            {[
              "planned",
              "in_progress",
              "resting",
              "observation_period",
              "abandoned",
              "archived",
            ].map((value) => (
              <option value={value} key={value}>
                {value.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
      </div>
      <form action={observation} className="memory-form">
        <h2>Record observation</h2>
        <p>
          Scores are sensory working observations—not medical or safety
          validation.
        </p>
        <label>
          <span>Observation point</span>
          <select name="observationType">
            <option value="immediate">Immediate</option>
            <option value="24_hours">24 Hours</option>
            <option value="7_days">7 Days</option>
            <option value="14_days">14 Days</option>
            <option value="30_days">30 Days</option>
            <option value="custom">Custom</option>
          </select>
        </label>
        <label>
          <span>Observed at</span>
          <input type="datetime-local" name="observedAt" required />
        </label>
        <label>
          <span>Notes</span>
          <textarea name="notes" rows={5} />
        </label>
        <fieldset className="score-grid">
          <legend>Optional sensory scores · 1 low to 5 high</legend>
          {[
            ["colorScore", "Color"],
            ["aromaStrengthScore", "Aroma strength"],
            ["absorptionScore", "Absorption"],
            ["greasinessScore", "Greasiness"],
            ["slipScore", "Slip"],
            ["hairFeelScore", "Hair feel"],
            ["beardFeelScore", "Beard feel"],
            ["skinFeelScore", "Skin feel"],
          ].map(([name, label]) => (
            <label key={name}>
              <span>{label}</span>
              <select name={name} defaultValue="">
                <option value="">Not scored</option>
                {[1, 2, 3, 4, 5].map((score) => (
                  <option value={score} key={score}>
                    {score}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </fieldset>
        <div className="observation-flags">
          {[
            "stainingObserved",
            "separationObserved",
            "sedimentObserved",
            "cloudinessObserved",
          ].map((name) => (
            <label className="inline-checkbox" key={name}>
              <input type="checkbox" name={name} />
              {name.replace("Observed", " observed")}
            </label>
          ))}
        </div>
        <button className="button" disabled={persistence !== "database"}>
          Record observation
        </button>
      </form>
      <form action={complete} className="memory-form">
        <h2>Complete experiment</h2>
        <label>
          <span>Result</span>
          <select name="result">
            <option value="passed">Passed</option>
            <option value="needs_revision">Needs Revision</option>
            <option value="failed">Failed</option>
            <option value="inconclusive">Inconclusive</option>
          </select>
        </label>
        <label>
          <span>Conclusion</span>
          <textarea name="conclusion" required rows={5} />
        </label>
        <label>
          <span>Next proposed change</span>
          <textarea name="nextChange" rows={3} />
        </label>
        <button className="button" disabled={persistence !== "database"}>
          Complete experiment
        </button>
      </form>
    </div>
  );
}
