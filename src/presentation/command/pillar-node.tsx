import Link from "next/link";

import { asRoute } from "@/src/navigation/as-route";

import type { CommandPillarId } from "./command-hero-config";

function PillarIcon({ pillar }: { pillar: CommandPillarId }) {
  if (pillar === "create") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M11 4h10M13 4v7L7 23a3 3 0 0 0 3 4h12a3 3 0 0 0 3-4l-6-12V4" />
        <path d="M9.5 20.5h13M12 17c2 1.4 5.5-1.4 8 .2" />
      </svg>
    );
  }
  if (pillar === "build") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m6 11 10-6 10 6-10 6-10-6Z" />
        <path d="m6 16 10 6 10-6M6 21l10 6 10-6" />
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
      <path d="M7 24 24 7M14 7h10v10" />
      <path d="M7 15v9h9" />
    </svg>
  );
}

interface PillarNodeProps {
  id: CommandPillarId;
  label: string;
  descriptor: string;
  href: string;
}

export function PillarNode({ id, label, descriptor, href }: PillarNodeProps) {
  return (
    <Link
      className={`command-pillar command-pillar-${id}`}
      href={asRoute(href)}
      aria-label={`${label}: ${descriptor}`}
    >
      <span className="pillar-label">{label}</span>
      <span className="pillar-orb" aria-hidden="true">
        <span className="pillar-orb-rail" />
        <span className="pillar-orb-energy" />
        <span className="pillar-orb-icon">
          <PillarIcon pillar={id} />
        </span>
      </span>
      <span className="pillar-descriptor">{descriptor}</span>
    </Link>
  );
}
