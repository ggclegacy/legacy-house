import { productLineSeedDefinitions } from "@/src/domain/product-lines/product-line-seeds";
import { CommandHero } from "@/src/presentation/command/command-hero";
import { DevelopmentPortfolio } from "@/src/presentation/command/development-portfolio";
import { ProductBuildWorkspace } from "@/src/presentation/command/product-build-workspace";
import { buildDevelopmentPortfolioModel } from "@/src/services/command/development-portfolio";
import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";
import { loadCommercialSnapshot } from "@/src/services/commercial/load-commercial";

export default async function HomePage() {
  const [snapshot, commercial] = await Promise.all([
    loadDevelopmentSnapshot(),
    loadCommercialSnapshot(),
  ]);
  const portfolio = buildDevelopmentPortfolioModel(snapshot, commercial);
  return (
    <div className="command-page">
      <CommandHero />

      <ProductBuildWorkspace development={snapshot} commercial={commercial} />
      <DevelopmentPortfolio model={portfolio} />

      <section
        className="foundation-dashboard"
        aria-labelledby="foundation-dashboard-title"
      >
        <div className="section-heading compact-heading">
          <p className="eyebrow">Foundation view</p>
          <h2 id="foundation-dashboard-title">
            Known context. Honest readiness.
          </h2>
          <p>
            The command surface shows configured identity and system state
            without manufacturing product activity or performance.
          </p>
        </div>
        <div className="foundation-grid">
          <article className="readiness-panel">
            <div className="panel-heading">
              <span>01</span>
              <div>
                <p className="card-eyebrow">Product-line identity</p>
                <h3>Established lines</h3>
              </div>
            </div>
            <div className="product-line-list">
              {productLineSeedDefinitions.map((line) => (
                <div
                  className={`product-line-identity theme-${line.accentTheme}`}
                  key={line.id}
                >
                  <span aria-hidden="true" />
                  <div>
                    <strong>{line.name}</strong>
                    <p>{line.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
          <article className="readiness-panel">
            <div className="panel-heading">
              <span>02</span>
              <div>
                <p className="card-eyebrow">Phase status</p>
                <h3>Phase 02 authorized</h3>
              </div>
            </div>
            <dl className="readiness-list">
              <div>
                <dt>Application</dt>
                <dd>
                  <span className="status-dot positive" aria-hidden="true" />
                  Operational
                </dd>
              </div>
              <div>
                <dt>Documentation</dt>
                <dd>
                  <span className="status-dot positive" aria-hidden="true" />
                  Established
                </dd>
              </div>
              <div>
                <dt>Database</dt>
                <dd>
                  <span className="status-dot caution" aria-hidden="true" />
                  Configuration required
                </dd>
              </div>
              <div>
                <dt>Business records</dt>
                <dd>
                  <span className="status-dot neutral" aria-hidden="true" />
                  Canonical definitions loaded
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <section className="foundation-note" aria-labelledby="foundation-title">
        <p className="eyebrow">Create phase</p>
        <h2 id="foundation-title">Product memory before operational scale.</h2>
        <p>
          Phase 02 connects supplied product planning, formulas, ingredients,
          calculations, experiments, notes, and decisions without entering
          sourcing, inventory, quality, commerce, or fabricated history.
        </p>
      </section>
      <footer>
        <p>Legacy House</p>
        <p>Private operating system · Groomed Gent Co.</p>
      </footer>
    </div>
  );
}
