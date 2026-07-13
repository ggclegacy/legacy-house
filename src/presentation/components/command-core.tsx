import { LegacyHouseMark } from "@/src/presentation/brand/legacy-house-mark";

export function CommandCore() {
  return (
    <div className="intelligence-core">
      <div className="core-atmosphere" aria-hidden="true" />
      <div className="core-ring core-ring-outer" aria-hidden="true" />
      <div className="core-ring core-ring-middle" aria-hidden="true" />
      <div className="core-ring core-ring-inner" aria-hidden="true" />
      <div className="core-radial-marks" aria-hidden="true" />
      <div className="core-reactor-frame">
        <span
          className="core-reactor-lock core-reactor-lock-north"
          aria-hidden="true"
        />
        <span
          className="core-reactor-lock core-reactor-lock-east"
          aria-hidden="true"
        />
        <span
          className="core-reactor-lock core-reactor-lock-south"
          aria-hidden="true"
        />
        <span
          className="core-reactor-lock core-reactor-lock-west"
          aria-hidden="true"
        />
        <div className="core-emblem">
          <span className="core-energy" aria-hidden="true" />
          <LegacyHouseMark
            size={2000}
            priority
            className="command-core-emblem"
          />
        </div>
      </div>
    </div>
  );
}
