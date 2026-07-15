import Link from "next/link";

import { BatchMode } from "@/src/presentation/production/batch-mode";
import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";

export default async function BatchModePage({
  searchParams,
}: {
  searchParams: Promise<{
    formula?: string;
    count?: string;
    size?: string;
    unit?: "us_fluid_ounces" | "milliliters" | "grams";
    overage?: string;
    precision?: string;
  }>;
}) {
  const query = await searchParams;
  const development = await loadDevelopmentSnapshot();
  const formula = development.formulas.find(
    (item) => item.versionId === query.formula,
  );
  const count = Number(query.count);
  const precision = Number(query.precision);
  const valid =
    formula &&
    Number.isInteger(count) &&
    count > 0 &&
    query.size &&
    query.unit &&
    query.overage &&
    Number.isInteger(precision) &&
    precision >= 0 &&
    precision <= 12;

  if (!valid)
    return (
      <div className="production-builder-page">
        <section className="production-setup-state">
          <h1>Batch Mode setup is incomplete.</h1>
          <p>Return to the Batch Builder and confirm the batch inputs.</p>
          <Link className="button" href="/production/batch-builder">
            Open Batch Builder
          </Link>
        </section>
      </div>
    );

  return (
    <BatchMode
      formula={formula}
      configuration={{
        count,
        size: query.size!,
        unit: query.unit!,
        overage: query.overage!,
        precision,
      }}
    />
  );
}
