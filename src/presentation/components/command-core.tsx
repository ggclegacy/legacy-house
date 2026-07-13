import { LegacyHouseMark } from "@/src/presentation/brand/legacy-house-mark";

type Pillar = "create" | "build" | "control" | "scale";

const pillars: ReadonlyArray<{ id: Pillar; label: string; detail: string }> = [
  { id: "create", label: "Create", detail: "Research and R&D" },
  { id: "build", label: "Build", detail: "Sourcing and costing" },
  { id: "control", label: "Control", detail: "Operations and quality" },
  { id: "scale", label: "Scale", detail: "Launch and intelligence" },
];

function PillarIcon({ pillar }: { pillar: Pillar }) {
  if (pillar === "create") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M11 4h10M13 4v7L7 23a3 3 0 0 0 3 4h12a3 3 0 0 0 3-4l-6-12V4M10 21h12" />
      </svg>
    );
  }
  if (pillar === "build") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m8 24 8-17 8 17M11 18h10M5 27h22" />
      </svg>
    );
  }
  if (pillar === "control") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 4 26 8v7c0 6-4 10-10 13C10 25 6 21 6 15V8l10-4Z" />
        <path d="m11 16 3 3 7-7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 25 15 6l4 8 7 3-20 8Z" />
      <path d="m14 18 4-4" />
    </svg>
  );
}

export function CommandCore() {
  return (
    <div
      className="command-core"
      aria-label="Legacy House connects Create, Build, Control, and Scale"
    >
      <div className="orbit orbit-outer" aria-hidden="true" />
      <div className="orbit orbit-inner" aria-hidden="true" />
      <div className="signal signal-one" aria-hidden="true" />
      <div className="signal signal-two" aria-hidden="true" />
      <div className="core-emblem">
        <span className="core-halo" aria-hidden="true" />
        <LegacyHouseMark size={2000} priority />
        <span className="core-caption">Intelligence core</span>
      </div>
      {pillars.map((pillar) => (
        <div className={`pillar-node pillar-${pillar.id}`} key={pillar.id}>
          <span className="pillar-icon">
            <PillarIcon pillar={pillar.id} />
          </span>
          <span className="pillar-text">
            <strong>{pillar.label}</strong>
            <small>{pillar.detail}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
