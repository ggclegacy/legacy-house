import Link from "next/link";
import type { Route } from "next";

export function CommercialRecord({
  eyebrow,
  title,
  fields,
  back,
}: {
  eyebrow: string;
  title: string;
  fields: readonly [string, unknown][];
  back: string;
}) {
  return (
    <div className="destination-page">
      <header className="destination-header">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>Entered commercial facts and explicit unknowns.</p>
      </header>
      <section className="commercial-panel">
        <dl className="record-facts">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                {value === null || value === undefined || value === ""
                  ? "Not entered"
                  : value instanceof Date
                    ? value.toLocaleDateString()
                    : String(value).replaceAll("_", " ")}
              </dd>
            </div>
          ))}
        </dl>
        <Link className="button-secondary" href={back as Route}>
          Back to directory
        </Link>
      </section>
    </div>
  );
}
