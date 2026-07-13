export function PersistenceBanner({
  persistence,
}: {
  persistence: "database" | "unavailable";
}) {
  if (persistence === "database")
    return (
      <div className="development-banner available" role="status">
        <strong>PostgreSQL connected</strong>
        <span>Controlled changes and activity history are available.</span>
      </div>
    );
  return (
    <div className="development-banner unavailable" role="status">
      <strong>Canonical source view · persistence unavailable</strong>
      <span>
        Supplied Phase 02 records are visible for review, but they are not
        represented as persisted. Configure `DATABASE_URL`, migrate, and seed to
        enable controlled changes.
      </span>
    </div>
  );
}
