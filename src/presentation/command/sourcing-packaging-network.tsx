import Link from "next/link";

import type { CommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";
import { asRoute } from "@/src/navigation/as-route";
import { buildProductWorkspaceModel } from "@/src/services/command/build-workspace";

export function SourcingPackagingNetwork({
  development,
  commercial,
}: {
  development: DevelopmentSnapshot;
  commercial: CommercialSnapshot;
}) {
  const continuation = buildProductWorkspaceModel(
    development,
    commercial,
  ).continuation;
  const product = continuation?.product ?? null;
  const formula = continuation?.formula ?? null;
  const configuration = continuation?.configuration ?? null;
  const supplierSelections = formula
    ? commercial.supplierSelections.filter(
        (selection) => selection.formulaVersionId === formula.versionId,
      )
    : [];
  const selectedSupplierProducts = commercial.supplierProducts.filter((item) =>
    supplierSelections.some(
      (selection) => selection.supplierProductId === item.id,
    ),
  );
  const selectedSuppliers = commercial.suppliers.filter((supplier) =>
    selectedSupplierProducts.some((item) => item.supplierId === supplier.id),
  );
  const candidates = product
    ? commercial.candidates.filter((item) => item.productId === product.id)
    : [];
  const candidateManufacturers = commercial.manufacturers.filter(
    (manufacturer) =>
      candidates.some(
        (candidate) => candidate.manufacturerId === manufacturer.id,
      ),
  );
  const packagingLinks = configuration
    ? commercial.configurationPackaging.filter(
        (item) => item.finishedProductConfigurationId === configuration.id,
      )
    : [];
  const packagingRecords = commercial.packaging.filter((item) =>
    packagingLinks.some((link) => link.packagingComponentId === item.id),
  );
  const productQuotes = product
    ? commercial.quotes.filter((quote) => quote.productId === product.id)
    : [];

  return (
    <section
      className="command-workspace command-sourcing-network"
      aria-labelledby="sourcing-packaging-title"
    >
      <header className="command-section-heading">
        <div>
          <p className="eyebrow">Build · Materials network</p>
          <h2 id="sourcing-packaging-title">
            Sourcing &amp; Packaging Network
          </h2>
        </div>
        <p>
          Move from a real product source into suppliers, partners, and pack.
        </p>
      </header>

      <div
        className="command-workspace-grid sourcing-network-grid"
        role="region"
        aria-label="Sourcing and packaging modules"
        tabIndex={0}
      >
        <article className="command-feature sourcing-feature">
          <span className="command-feature-index" aria-hidden="true">
            02
          </span>
          <div>
            <p className="card-eyebrow">Current sourcing workspace</p>
            {product ? (
              <>
                <h3>{product.name}</h3>
                <p>
                  {product.productLineName} ·{" "}
                  {labelFor(product.developmentPath)}
                </p>
                <dl className="command-fact-row">
                  <div>
                    <dt>Supplier links</dt>
                    <dd>{supplierSelections.length}</dd>
                  </div>
                  <div>
                    <dt>Manufacturer options</dt>
                    <dd>{candidates.length}</dd>
                  </div>
                  <div>
                    <dt>Quotes</dt>
                    <dd>{productQuotes.length}</dd>
                  </div>
                  <div>
                    <dt>Configuration</dt>
                    <dd>{configuration ? "Recorded" : "Not recorded"}</dd>
                  </div>
                </dl>
                <Link
                  className="command-inline-action"
                  href={asRoute(`/products/${product.slug}#sourcing`)}
                >
                  Open sourcing workspace
                </Link>
              </>
            ) : (
              <div className="command-honest-empty">
                <h3>No active product is available.</h3>
                <p>Sourcing context begins from a real active product.</p>
              </div>
            )}
          </div>
        </article>

        <article className="command-instrument network-instrument">
          <span className="instrument-icon" aria-hidden="true">
            ⌁
          </span>
          <p className="card-eyebrow">Suppliers</p>
          <h3>
            {selectedSuppliers.length
              ? `${selectedSuppliers.length} linked suppliers`
              : "No suppliers linked"}
          </h3>
          <p>
            {selectedSuppliers[0]
              ? selectedSuppliers.map((item) => item.name).join(" · ")
              : "No supplier selection or price is recorded for the current formula."}
          </p>
          <Link href="/modules/suppliers">Open suppliers</Link>
        </article>

        <article className="command-instrument network-instrument">
          <span className="instrument-icon" aria-hidden="true">
            ⬡
          </span>
          <p className="card-eyebrow">Manufacturer / white-label</p>
          <h3>
            {candidateManufacturers.length
              ? `${candidateManufacturers.length} candidate partners`
              : "No manufacturer selected"}
          </h3>
          <p>
            {candidateManufacturers[0]
              ? candidateManufacturers.map((item) => item.name).join(" · ")
              : "No manufacturer, catalog product, sample, or partner fact is recorded."}
          </p>
          <Link href="/modules/manufacturers">Open manufacturers</Link>
        </article>

        <article className="command-instrument network-instrument">
          <span className="instrument-icon" aria-hidden="true">
            ▣
          </span>
          <p className="card-eyebrow">Packaging</p>
          <h3>{configuration?.name ?? "No finished configuration"}</h3>
          <p>
            {packagingRecords.length
              ? `${packagingRecords.length} packaging components are linked.`
              : configuration
                ? "The configuration is recorded; no packaging components or prices are linked."
                : "Packaging facts have not been entered."}
          </p>
          <Link href="/modules/packaging">Open packaging</Link>
        </article>
      </div>

      <nav className="command-tool-rail" aria-label="Sourcing network tools">
        <span>Network tools</span>
        <Link href="/modules/suppliers">Open Suppliers</Link>
        <Link href="/modules/manufacturers">Open Manufacturers</Link>
        <Link href="/modules/packaging">Open Packaging</Link>
        <Link
          href={
            product?.developmentPath === "white_label"
              ? "/modules/manufacturers"
              : "/modules/suppliers"
          }
        >
          Compare Options
        </Link>
      </nav>
    </section>
  );
}
