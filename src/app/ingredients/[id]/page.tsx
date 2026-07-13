import Link from "next/link";
import { notFound } from "next/navigation";

import { labelFor } from "@/src/domain/development/development";
import { asRoute } from "@/src/navigation/as-route";
import { PersistenceBanner } from "@/src/presentation/development/persistence-banner";
import { IngredientControls } from "@/src/presentation/development/ingredient-controls";
import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";

export default async function IngredientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snapshot = await loadDevelopmentSnapshot();
  const ingredient = snapshot.ingredients.find((item) => item.id === id);
  if (!ingredient) notFound();
  const formulas = snapshot.formulas.filter((formula) =>
    formula.ingredients.some((line) => line.ingredientId === id),
  );
  const productIds = new Set(formulas.map((formula) => formula.productId));
  const products = snapshot.products.filter((product) =>
    productIds.has(product.id),
  );
  const facts = [
    ["INCI", ingredient.inciName],
    ["CAS", ingredient.casNumber],
    ["Category", labelFor(ingredient.category)],
    [
      "Density",
      ingredient.densityGramsPerMl
        ? `${ingredient.densityGramsPerMl} g/mL`
        : null,
    ],
    [
      "Functions",
      ingredient.functions.length ? ingredient.functions.join(", ") : null,
    ],
    ["Description", ingredient.description],
    ["Physical form", ingredient.physicalForm],
    ["Natural color", ingredient.naturalColor],
    ["Natural aroma", ingredient.naturalAroma],
    [
      "Usage minimum",
      ingredient.recommendedUsageMinimum
        ? `${ingredient.recommendedUsageMinimum}%`
        : null,
    ],
    [
      "Usage maximum",
      ingredient.recommendedUsageMaximum
        ? `${ingredient.recommendedUsageMaximum}%`
        : null,
    ],
    ["Solubility", ingredient.solubility],
    ["Heat sensitivity", ingredient.heatSensitivity],
    ["Oxidation sensitivity", ingredient.oxidationSensitivity],
    ["Storage", ingredient.storageConditions],
    [
      "Shelf life",
      ingredient.shelfLifeMonths
        ? `${ingredient.shelfLifeMonths} months`
        : null,
    ],
    ["Formulation concerns", ingredient.formulationConcerns],
    ["Notes", ingredient.notes],
  ] as const;
  return (
    <div className="destination-page ingredient-workspace">
      <header className="record-header">
        <div>
          <p className="eyebrow">Ingredient Intelligence · Phase 02</p>
          <h1>{ingredient.commonName}</h1>
          <p>{ingredient.description ?? "Description not entered."}</p>
        </div>
        <div className="record-header-status">
          <span>{labelFor(ingredient.category)}</span>
          <span>
            {ingredient.densityGramsPerMl
              ? "Density entered"
              : "Missing density"}
          </span>
        </div>
      </header>
      <PersistenceBanner persistence={snapshot.persistence} />
      <IngredientControls
        ingredient={ingredient}
        persistence={snapshot.persistence}
        hasFormulaUse={formulas.length > 0}
      />
      <section className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Known facts</p>
          <h2>Unknown values remain explicit.</h2>
          <p>
            Appearance in this library does not imply regulatory approval,
            suitability, safety, or certification.
          </p>
        </div>
        <dl className="fact-list">
          {facts.map(([name, value]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{value ?? "Not entered"}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Formula usage</p>
          <h2>Referenced compositions</h2>
        </div>
        <div className="record-grid">
          {formulas.map((formula) => {
            const line = formula.ingredients.find(
              (item) => item.ingredientId === id,
            )!;
            return (
              <article key={formula.versionId}>
                <p className="card-eyebrow">{formula.productName}</p>
                <h3>
                  <Link href={asRoute(`/formulas/${formula.versionId}`)}>
                    {formula.familyName} · {formula.version}
                  </Link>
                </h3>
                <p>
                  {line.percentage}% · {line.formulaRole ?? "Role not entered"}
                </p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Product usage</p>
          <h2>Connected products</h2>
        </div>
        <div className="record-grid">
          {products.map((product) => (
            <article key={product.id}>
              <h3>
                <Link href={asRoute(`/products/${product.slug}`)}>
                  {product.name}
                </Link>
              </h3>
              <p>{product.productLineName}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="workspace-section phase-boundary">
        <p className="eyebrow">Future supplier area · Phase 03</p>
        <h2>No supplier facts have been added.</h2>
        <p>
          Supplier relationships, specifications, prices, and certifications
          remain protected Phase 03 scope.
        </p>
      </section>
    </div>
  );
}
