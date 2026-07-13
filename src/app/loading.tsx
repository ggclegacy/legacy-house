import { LegacyHouseMark } from "@/src/presentation/brand/legacy-house-mark";
import { LoadingSkeleton } from "@/src/presentation/ui/loading-skeleton";

export default function Loading() {
  return (
    <div
      className="state-page loading-state"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <LegacyHouseMark size={96} decorative />
      <p>Preparing Legacy House…</p>
      <LoadingSkeleton label="Loading workspace" />
    </div>
  );
}
