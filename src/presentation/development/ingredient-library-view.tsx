"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  ingredientCategories,
  labelFor,
} from "@/src/domain/development/development";
import type { DevelopmentIngredient } from "@/src/domain/development/snapshot";
import { asRoute } from "@/src/navigation/as-route";

export function IngredientLibraryView({
  ingredients,
  usedIngredientIds,
}: {
  ingredients: readonly DevelopmentIngredient[];
  usedIngredientIds: readonly string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [missingDensity, setMissingDensity] = useState(false);
  const [usage, setUsage] = useState("active");
  const filtered = useMemo(
    () =>
      ingredients.filter(
        (ingredient) =>
          (usage === "archived"
            ? Boolean(ingredient.archivedAt)
            : !ingredient.archivedAt) &&
          (usage !== "used" || usedIngredientIds.includes(ingredient.id)) &&
          (usage !== "unused" || !usedIngredientIds.includes(ingredient.id)) &&
          (category === "all" || ingredient.category === category) &&
          (!missingDensity || !ingredient.densityGramsPerMl) &&
          [ingredient.commonName, ingredient.inciName, ingredient.description]
            .join(" ")
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase()),
      ),
    [category, ingredients, missingDensity, query, usage, usedIngredientIds],
  );
  return (
    <>
      <div className="view-toolbar compact">
        <input
          type="search"
          aria-label="Search common name or INCI"
          placeholder="Search common name or INCI"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label="Filter ingredient category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="all">All categories</option>
          {ingredientCategories.map((value) => (
            <option key={value} value={value}>
              {labelFor(value)}
            </option>
          ))}
        </select>
        <label className="inline-checkbox">
          <input
            type="checkbox"
            checked={missingDensity}
            onChange={(event) => setMissingDensity(event.target.checked)}
          />
          Missing density
        </label>
        <select
          aria-label="Filter ingredient usage"
          value={usage}
          onChange={(event) => setUsage(event.target.value)}
        >
          <option value="active">All active</option>
          <option value="used">Used in formulas</option>
          <option value="unused">Not used in formulas</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div className="ingredient-grid">
        {filtered.map((ingredient) => (
          <article className="ingredient-card" key={ingredient.id}>
            <p className="card-eyebrow">{labelFor(ingredient.category)}</p>
            <h2>
              <Link href={asRoute(`/ingredients/${ingredient.id}`)}>
                {ingredient.commonName}
              </Link>
            </h2>
            <p>{ingredient.description ?? "Not entered"}</p>
            <dl>
              <div>
                <dt>INCI</dt>
                <dd>{ingredient.inciName ?? "Not entered"}</dd>
              </div>
              <div>
                <dt>Density</dt>
                <dd>
                  {ingredient.densityGramsPerMl
                    ? `${ingredient.densityGramsPerMl} g/mL`
                    : "Not entered"}
                </dd>
              </div>
            </dl>
            <Link
              className="text-link"
              href={asRoute(`/ingredients/${ingredient.id}`)}
            >
              Ingredient detail <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
      {!filtered.length ? (
        <div className="record-empty">
          <strong>No ingredients match these filters.</strong>
        </div>
      ) : null}
    </>
  );
}
