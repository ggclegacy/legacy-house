export function LoadingSkeleton({ label }: { label: string }) {
  return (
    <div className="loading-skeleton" aria-hidden="true">
      <span />
      <span />
      <span />
      <span className="sr-only">{label}</span>
    </div>
  );
}
