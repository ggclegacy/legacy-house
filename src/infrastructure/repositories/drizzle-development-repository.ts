import { and, asc, count, desc, eq } from "drizzle-orm";

import {
  phaseTwoProductSeeds,
  reserveFormulaSeed,
  reserveIngredientSeeds,
} from "@/src/domain/development/phase-two-seeds";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";
import type { DevelopmentAction } from "@/src/domain/development/actions";
import { formulaTotal } from "@/src/domain/formulas/calculation";
import {
  formulaCanBeEditedInPlace,
  nextFormulaVersion,
} from "@/src/domain/formulas/versioning";
import type { Database } from "@/src/infrastructure/database/client";
import {
  activityEvents,
  experimentObservations,
  experiments,
  formulaFamilies,
  formulaIngredients,
  formulaProductionSteps,
  formulaVersions,
  ingredients,
  productDecisions,
  productBriefs,
  productLines,
  productNotes,
  products,
} from "@/src/infrastructure/database/schema";

export function createDrizzleDevelopmentRepository(database: Database) {
  return {
    async seedApprovedData() {
      await database.transaction(async (tx) => {
        for (const product of phaseTwoProductSeeds) {
          await tx
            .insert(products)
            .values(product)
            .onConflictDoUpdate({
              target: products.slug,
              set: {
                name: product.name,
                description: product.description,
                productLineId: product.productLineId,
                productType: product.productType,
                developmentPath: product.developmentPath,
                pipelineStatus: product.pipelineStatus,
                active: true,
                archivedAt: null,
                updatedAt: new Date(),
              },
            });
        }
        for (const ingredient of reserveIngredientSeeds) {
          await tx
            .insert(ingredients)
            .values({ ...ingredient, functions: [...ingredient.functions] })
            .onConflictDoUpdate({
              target: ingredients.commonName,
              set: {
                category: ingredient.category,
                description: ingredient.description,
                notes: ingredient.notes,
                archivedAt: null,
                updatedAt: new Date(),
              },
            });
        }
        await tx
          .insert(formulaFamilies)
          .values(reserveFormulaSeed.family)
          .onConflictDoNothing();
        await tx
          .insert(formulaVersions)
          .values(reserveFormulaSeed.version)
          .onConflictDoNothing();
        for (const line of reserveFormulaSeed.ingredients) {
          await tx
            .insert(formulaIngredients)
            .values(line)
            .onConflictDoUpdate({
              target: [
                formulaIngredients.formulaVersionId,
                formulaIngredients.ingredientId,
              ],
              set: {
                percentage: line.percentage,
                sortOrder: line.sortOrder,
                formulaRole: line.formulaRole,
                isConcentratedExtract: line.isConcentratedExtract,
                isFragrance: line.isFragrance,
                updatedAt: new Date(),
              },
            });
        }
        await tx
          .update(formulaFamilies)
          .set({ activeVersionId: reserveFormulaSeed.version.id })
          .where(eq(formulaFamilies.id, reserveFormulaSeed.family.id));
      });
    },

    async getSnapshot(): Promise<DevelopmentSnapshot> {
      const productRows = await database
        .select({ product: products, line: productLines })
        .from(products)
        .innerJoin(productLines, eq(products.productLineId, productLines.id))
        .orderBy(desc(products.updatedAt));
      const [ingredientRows, familyRows, versionRows, lineRows, stepRows] =
        await Promise.all([
          database
            .select()
            .from(ingredients)
            .orderBy(asc(ingredients.commonName)),
          database.select().from(formulaFamilies),
          database
            .select()
            .from(formulaVersions)
            .orderBy(desc(formulaVersions.updatedAt)),
          database
            .select({ line: formulaIngredients, ingredient: ingredients })
            .from(formulaIngredients)
            .innerJoin(
              ingredients,
              eq(formulaIngredients.ingredientId, ingredients.id),
            )
            .orderBy(asc(formulaIngredients.sortOrder)),
          database
            .select()
            .from(formulaProductionSteps)
            .orderBy(asc(formulaProductionSteps.stepNumber)),
        ]);
      const [
        briefRows,
        experimentRows,
        observationRows,
        noteRows,
        decisionRows,
        activityRows,
      ] = await Promise.all([
        database.select().from(productBriefs),
        database
          .select()
          .from(experiments)
          .orderBy(desc(experiments.updatedAt)),
        database.select().from(experimentObservations),
        database
          .select()
          .from(productNotes)
          .orderBy(desc(productNotes.createdAt)),
        database
          .select()
          .from(productDecisions)
          .orderBy(desc(productDecisions.decisionDate)),
        database
          .select()
          .from(activityEvents)
          .orderBy(desc(activityEvents.createdAt))
          .limit(50),
      ]);
      const productById = new Map(
        productRows.map((row) => [row.product.id, row]),
      );
      const familyById = new Map(familyRows.map((row) => [row.id, row]));
      const observationCounts = new Map<string, number>();
      for (const observation of observationRows)
        observationCounts.set(
          observation.experimentId,
          (observationCounts.get(observation.experimentId) ?? 0) + 1,
        );
      return {
        persistence: "database",
        products: productRows.map(({ product, line }) => ({
          ...product,
          productLineName: line.name,
          productLineSlug: line.slug,
          updatedAt: product.updatedAt.toISOString(),
        })),
        briefs: briefRows,
        ingredients: ingredientRows.map((ingredient) => ({
          ...ingredient,
          archivedAt: ingredient.archivedAt?.toISOString() ?? null,
        })),
        formulas: versionRows.flatMap((version) => {
          const family = familyById.get(version.formulaFamilyId);
          const productRow = family
            ? productById.get(family.productId)
            : undefined;
          if (!family || !productRow) return [];
          return [
            {
              familyId: family.id,
              productId: family.productId,
              productName: productRow.product.name,
              productSlug: productRow.product.slug,
              productLineName: productRow.line.name,
              familyName: family.name,
              description: family.description,
              activeVersionId: family.activeVersionId,
              versionId: version.id,
              versionName: version.name,
              version: version.version,
              formulaBasis: version.formulaBasis,
              status: version.status,
              defaultBottleSize: version.defaultBottleSize,
              defaultBottleSizeUnit: version.defaultBottleSizeUnit,
              defaultBottleCount: version.defaultBottleCount,
              defaultOveragePercent: version.defaultOveragePercent,
              changeReason: version.changeReason,
              previousVersionId: version.previousVersionId,
              updatedAt: version.updatedAt.toISOString(),
              ingredients: lineRows
                .filter((row) => row.line.formulaVersionId === version.id)
                .map(({ line, ingredient }) => ({
                  ...line,
                  ingredientName: ingredient.commonName,
                  category: ingredient.category,
                  densityGramsPerMl: ingredient.densityGramsPerMl,
                })),
              productionSteps: stepRows.filter(
                (step) => step.formulaVersionId === version.id,
              ),
            },
          ];
        }),
        experiments: experimentRows.map((experiment) => ({
          ...experiment,
          observationCount: observationCounts.get(experiment.id) ?? 0,
        })),
        notes: noteRows.map((note) => ({
          ...note,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
        })),
        decisions: decisionRows,
        activity: activityRows.map((event) => ({
          ...event,
          createdAt: event.createdAt.toISOString(),
        })),
      };
    },

    async execute(action: DevelopmentAction) {
      return database.transaction(async (tx) => {
        const activity = async (
          entityType: string,
          entityId: string,
          eventAction: string,
          title: string,
          description?: string,
        ) => {
          await tx.insert(activityEvents).values({
            entityType,
            entityId,
            action: eventAction,
            title,
            description,
          });
        };

        switch (action.action) {
          case "create_product": {
            const [created] = await tx
              .insert(products)
              .values(action.data)
              .returning();
            if (!created)
              throw new Error("Product creation returned no record.");
            await activity(
              "product",
              created.id,
              "created",
              `Product created: ${created.name}`,
            );
            return created;
          }
          case "update_product": {
            const conditions = [eq(products.id, action.productId)];
            if (action.data.expectedUpdatedAt)
              conditions.push(
                eq(products.updatedAt, new Date(action.data.expectedUpdatedAt)),
              );
            const { expectedUpdatedAt: _expectedUpdatedAt, ...changes } =
              action.data;
            void _expectedUpdatedAt;
            const [updated] = await tx
              .update(products)
              .set({
                ...changes,
                ...(action.productLineId
                  ? { productLineId: action.productLineId }
                  : {}),
                updatedAt: new Date(),
              })
              .where(and(...conditions))
              .returning();
            if (!updated)
              throw new Error("Stale product record. Refresh before editing.");
            await activity(
              "product",
              updated.id,
              "updated",
              `Product details updated: ${updated.name}`,
            );
            return updated;
          }
          case "update_product_status": {
            const conditions = [eq(products.id, action.productId)];
            if (action.expectedUpdatedAt)
              conditions.push(
                eq(products.updatedAt, new Date(action.expectedUpdatedAt)),
              );
            const [updated] = await tx
              .update(products)
              .set({
                pipelineStatus: action.pipelineStatus,
                updatedAt: new Date(),
              })
              .where(and(...conditions))
              .returning();
            if (!updated)
              throw new Error(
                "Stale product record. Refresh before changing status.",
              );
            await activity(
              "product",
              updated.id,
              "status_changed",
              `Status changed: ${updated.name}`,
              action.pipelineStatus,
            );
            return updated;
          }
          case "update_product_priority": {
            const conditions = [eq(products.id, action.productId)];
            if (action.expectedUpdatedAt)
              conditions.push(
                eq(products.updatedAt, new Date(action.expectedUpdatedAt)),
              );
            const [updated] = await tx
              .update(products)
              .set({ priority: action.priority, updatedAt: new Date() })
              .where(and(...conditions))
              .returning();
            if (!updated)
              throw new Error(
                "Stale product record. Refresh before changing priority.",
              );
            await activity(
              "product",
              updated.id,
              "priority_changed",
              `Priority changed: ${updated.name}`,
              action.priority,
            );
            return updated;
          }
          case "archive_product": {
            const [updated] = await tx
              .update(products)
              .set({
                active: false,
                pipelineStatus: "archived",
                archivedAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(products.id, action.productId))
              .returning();
            if (!updated) throw new Error("Product was not found.");
            await activity(
              "product",
              updated.id,
              "archived",
              `Product archived: ${updated.name}`,
            );
            return updated;
          }
          case "save_product_brief": {
            const {
              ingredientsToExplore,
              ingredientsToAvoid,
              competitiveReferences,
              notes,
              ...productFields
            } = action.data;
            const [updated] = await tx
              .update(products)
              .set({ ...productFields, updatedAt: new Date() })
              .where(eq(products.id, action.productId))
              .returning();
            if (!updated) throw new Error("Product was not found.");
            await tx
              .insert(productBriefs)
              .values({
                productId: action.productId,
                ingredientsToExplore,
                ingredientsToAvoid,
                competitiveReferences,
                notes,
              })
              .onConflictDoUpdate({
                target: productBriefs.productId,
                set: {
                  ingredientsToExplore,
                  ingredientsToAvoid,
                  competitiveReferences,
                  notes,
                  updatedAt: new Date(),
                },
              });
            await activity(
              "product",
              updated.id,
              "brief_updated",
              `Product brief updated: ${updated.name}`,
            );
            return updated;
          }
          case "add_product_note": {
            const [created] = await tx
              .insert(productNotes)
              .values(action)
              .returning();
            if (!created)
              throw new Error("Product note creation returned no record.");
            await activity(
              "product",
              action.productId,
              "note_added",
              `Product note added: ${created.title}`,
            );
            return created;
          }
          case "update_product_note": {
            const [updated] = await tx
              .update(productNotes)
              .set({
                noteType: action.noteType,
                title: action.title,
                content: action.content,
                updatedAt: new Date(),
              })
              .where(
                and(
                  eq(productNotes.id, action.noteId),
                  eq(
                    productNotes.updatedAt,
                    new Date(action.expectedUpdatedAt),
                  ),
                ),
              )
              .returning();
            if (!updated)
              throw new Error("Stale product note. Refresh before editing.");
            await activity(
              "product",
              updated.productId,
              "note_edited",
              `Product note edited: ${updated.title}`,
            );
            return updated;
          }
          case "record_product_decision": {
            const { action: _action, ...values } = action;
            void _action;
            const [created] = await tx
              .insert(productDecisions)
              .values(values)
              .returning();
            if (!created)
              throw new Error("Decision creation returned no record.");
            await activity(
              "product",
              action.productId,
              "decision_recorded",
              `Decision recorded: ${created.title}`,
            );
            return created;
          }
          case "review_product_decision": {
            const [updated] = await tx
              .update(productDecisions)
              .set({
                status: action.status,
                actualOutcome: action.actualOutcome,
                updatedAt: new Date(),
              })
              .where(eq(productDecisions.id, action.decisionId))
              .returning();
            if (!updated) throw new Error("Decision was not found.");
            await activity(
              "product",
              updated.productId,
              "decision_reviewed",
              `Decision reviewed: ${updated.title}`,
              action.status,
            );
            return updated;
          }
          case "create_ingredient": {
            const [created] = await tx
              .insert(ingredients)
              .values(action.data)
              .returning();
            if (!created)
              throw new Error("Ingredient creation returned no record.");
            await activity(
              "ingredient",
              created.id,
              "created",
              `Ingredient created: ${created.commonName}`,
            );
            return created;
          }
          case "update_ingredient": {
            const [updated] = await tx
              .update(ingredients)
              .set({ ...action.data, updatedAt: new Date() })
              .where(eq(ingredients.id, action.ingredientId))
              .returning();
            if (!updated) throw new Error("Ingredient was not found.");
            await activity(
              "ingredient",
              updated.id,
              "updated",
              `Ingredient updated: ${updated.commonName}`,
            );
            return updated;
          }
          case "archive_ingredient": {
            const references = await tx
              .select({ value: count() })
              .from(formulaIngredients)
              .where(eq(formulaIngredients.ingredientId, action.ingredientId));
            if (Number(references[0]?.value ?? 0) > 0)
              throw new Error(
                "Archive blocked: this ingredient is used by a formula version.",
              );
            const [updated] = await tx
              .update(ingredients)
              .set({ archivedAt: new Date(), updatedAt: new Date() })
              .where(eq(ingredients.id, action.ingredientId))
              .returning();
            if (!updated) throw new Error("Ingredient was not found.");
            await activity(
              "ingredient",
              updated.id,
              "archived",
              `Ingredient archived: ${updated.commonName}`,
            );
            return updated;
          }
          case "create_formula": {
            const [family] = await tx
              .insert(formulaFamilies)
              .values({
                productId: action.data.productId,
                name: action.data.name,
                description: action.data.description,
              })
              .returning();
            if (!family)
              throw new Error("Formula family creation returned no record.");
            const [version] = await tx
              .insert(formulaVersions)
              .values({
                formulaFamilyId: family.id,
                name: action.data.name,
                version: "1.0",
                formulaBasis: action.data.formulaBasis,
                defaultBottleSize: action.data.defaultBottleSize,
                defaultBottleSizeUnit: action.data.defaultBottleSizeUnit,
                defaultBottleCount: action.data.defaultBottleCount,
                defaultOveragePercent: action.data.defaultOveragePercent,
                changeReason: "Initial formula version.",
              })
              .returning();
            if (!version)
              throw new Error("Formula version creation returned no record.");
            await tx
              .update(formulaFamilies)
              .set({ activeVersionId: version.id })
              .where(eq(formulaFamilies.id, family.id));
            await activity(
              "formula",
              version.id,
              "created",
              `Formula created: ${family.name}`,
            );
            return { family, version };
          }
          case "duplicate_formula_family": {
            const [sourceVersion] = await tx
              .select()
              .from(formulaVersions)
              .where(eq(formulaVersions.id, action.formulaVersionId));
            if (!sourceVersion)
              throw new Error("Formula version was not found.");
            const [sourceFamily] = await tx
              .select()
              .from(formulaFamilies)
              .where(eq(formulaFamilies.id, sourceVersion.formulaFamilyId));
            if (!sourceFamily) throw new Error("Formula family was not found.");
            const sourceLines = await tx
              .select()
              .from(formulaIngredients)
              .where(eq(formulaIngredients.formulaVersionId, sourceVersion.id));
            const sourceSteps = await tx
              .select()
              .from(formulaProductionSteps)
              .where(
                eq(formulaProductionSteps.formulaVersionId, sourceVersion.id),
              );
            const [family] = await tx
              .insert(formulaFamilies)
              .values({
                productId: sourceFamily.productId,
                name: action.name,
                description: sourceFamily.description,
              })
              .returning();
            if (!family)
              throw new Error("Formula duplication returned no family.");
            const [version] = await tx
              .insert(formulaVersions)
              .values({
                formulaFamilyId: family.id,
                name: action.name,
                version: "1.0",
                description: sourceVersion.description,
                formulaBasis: sourceVersion.formulaBasis,
                status: "draft",
                defaultBottleSize: sourceVersion.defaultBottleSize,
                defaultBottleSizeUnit: sourceVersion.defaultBottleSizeUnit,
                defaultBottleCount: sourceVersion.defaultBottleCount,
                defaultOveragePercent: sourceVersion.defaultOveragePercent,
                changeReason: `Duplicated from ${sourceFamily.name} version ${sourceVersion.version}.`,
              })
              .returning();
            if (!version)
              throw new Error("Formula duplication returned no version.");
            if (sourceLines.length)
              await tx.insert(formulaIngredients).values(
                sourceLines.map((line) => ({
                  formulaVersionId: version.id,
                  ingredientId: line.ingredientId,
                  percentage: line.percentage,
                  sortOrder: line.sortOrder,
                  formulaRole: line.formulaRole,
                  processingNotes: line.processingNotes,
                  isConcentratedExtract: line.isConcentratedExtract,
                  isFragrance: line.isFragrance,
                })),
              );
            if (sourceSteps.length)
              await tx.insert(formulaProductionSteps).values(
                sourceSteps.map((step) => ({
                  formulaVersionId: version.id,
                  phase: step.phase,
                  stepNumber: step.stepNumber,
                  instruction: step.instruction,
                  required: step.required,
                  notes: step.notes,
                })),
              );
            await tx
              .update(formulaFamilies)
              .set({ activeVersionId: version.id })
              .where(eq(formulaFamilies.id, family.id));
            await activity(
              "formula",
              version.id,
              "duplicated",
              `Formula family duplicated: ${family.name}`,
            );
            return { family, version };
          }
          case "archive_formula_family": {
            const [family] = await tx
              .update(formulaFamilies)
              .set({ archivedAt: new Date(), updatedAt: new Date() })
              .where(eq(formulaFamilies.id, action.formulaFamilyId))
              .returning();
            if (!family) throw new Error("Formula family was not found.");
            await tx
              .update(formulaVersions)
              .set({
                status: "archived",
                archivedAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(formulaVersions.formulaFamilyId, family.id));
            await activity(
              "formula",
              family.id,
              "archived",
              `Formula family archived: ${family.name}`,
            );
            return family;
          }
          case "save_formula_composition": {
            const [version] = await tx
              .select()
              .from(formulaVersions)
              .where(eq(formulaVersions.id, action.formulaVersionId));
            if (!version) throw new Error("Formula version was not found.");
            if (!formulaCanBeEditedInPlace(version.status))
              throw new Error(
                "Approved and production-ready formulas require a new version.",
              );
            await tx
              .delete(formulaIngredients)
              .where(eq(formulaIngredients.formulaVersionId, version.id));
            await tx.insert(formulaIngredients).values(
              action.lines.map((line) => ({
                ...line,
                formulaVersionId: version.id,
              })),
            );
            await tx
              .update(formulaVersions)
              .set({ updatedAt: new Date() })
              .where(eq(formulaVersions.id, version.id));
            await activity(
              "formula",
              version.id,
              "composition_updated",
              `Formula composition updated: ${version.name}`,
            );
            return {
              total: formulaTotal(action.lines.map((line) => line.percentage)),
            };
          }
          case "submit_formula_review": {
            const lines = await tx
              .select()
              .from(formulaIngredients)
              .where(
                eq(
                  formulaIngredients.formulaVersionId,
                  action.formulaVersionId,
                ),
              );
            if (
              formulaTotal(lines.map((line) => line.percentage)).state !==
              "ready"
            )
              throw new Error(
                "A formula must equal exactly 100% before review.",
              );
            const [updated] = await tx
              .update(formulaVersions)
              .set({ status: "under_review", updatedAt: new Date() })
              .where(eq(formulaVersions.id, action.formulaVersionId))
              .returning();
            if (!updated) throw new Error("Formula version was not found.");
            await activity(
              "formula",
              updated.id,
              "submitted_for_review",
              `Formula submitted for review: ${updated.name}`,
            );
            return updated;
          }
          case "create_formula_version": {
            const [source] = await tx
              .select()
              .from(formulaVersions)
              .where(eq(formulaVersions.id, action.formulaVersionId));
            if (!source)
              throw new Error("Source formula version was not found.");
            const [created] = await tx
              .insert(formulaVersions)
              .values({
                ...source,
                id: undefined,
                version: nextFormulaVersion(source.version),
                status: action.initialStatus,
                previousVersionId: source.id,
                changeReason: action.changeReason,
                approvedAt: null,
                createdAt: undefined,
                updatedAt: undefined,
              })
              .returning();
            if (!created)
              throw new Error("Formula version creation returned no record.");
            const sourceLines = await tx
              .select()
              .from(formulaIngredients)
              .where(eq(formulaIngredients.formulaVersionId, source.id));
            if (sourceLines.length)
              await tx.insert(formulaIngredients).values(
                sourceLines.map((line) => ({
                  formulaVersionId: created.id,
                  ingredientId: line.ingredientId,
                  percentage: line.percentage,
                  sortOrder: line.sortOrder,
                  formulaRole: line.formulaRole,
                  processingNotes: line.processingNotes,
                  isConcentratedExtract: line.isConcentratedExtract,
                  isFragrance: line.isFragrance,
                })),
              );
            const sourceSteps = await tx
              .select()
              .from(formulaProductionSteps)
              .where(eq(formulaProductionSteps.formulaVersionId, source.id));
            if (sourceSteps.length)
              await tx.insert(formulaProductionSteps).values(
                sourceSteps.map((step) => ({
                  formulaVersionId: created.id,
                  phase: step.phase,
                  stepNumber: step.stepNumber,
                  instruction: step.instruction,
                  required: step.required,
                  notes: step.notes,
                })),
              );
            await activity(
              "formula",
              created.id,
              "version_created",
              `Formula version ${created.version} created`,
              action.changeReason,
            );
            return created;
          }
          case "add_production_step": {
            const stepCountRows = await tx
              .select({ value: count() })
              .from(formulaProductionSteps)
              .where(
                eq(
                  formulaProductionSteps.formulaVersionId,
                  action.formulaVersionId,
                ),
              );
            const stepCount = stepCountRows[0]?.value ?? 0;
            const [created] = await tx
              .insert(formulaProductionSteps)
              .values({ ...action, stepNumber: Number(stepCount) + 1 })
              .returning();
            if (!created)
              throw new Error("Production step creation returned no record.");
            await activity(
              "formula",
              action.formulaVersionId,
              "production_step_added",
              `Production step added: ${created.phase}`,
            );
            return created;
          }
          case "save_production_steps": {
            const [version] = await tx
              .select()
              .from(formulaVersions)
              .where(eq(formulaVersions.id, action.formulaVersionId));
            if (!version) throw new Error("Formula version was not found.");
            if (!formulaCanBeEditedInPlace(version.status))
              throw new Error(
                "Controlled formula steps require a new version.",
              );
            await tx
              .delete(formulaProductionSteps)
              .where(eq(formulaProductionSteps.formulaVersionId, version.id));
            if (action.steps.length)
              await tx.insert(formulaProductionSteps).values(
                action.steps.map((step, index) => ({
                  ...step,
                  formulaVersionId: version.id,
                  stepNumber: index + 1,
                })),
              );
            await activity(
              "formula",
              version.id,
              "steps_updated",
              `Production steps updated: ${version.name}`,
            );
            return { count: action.steps.length };
          }
          case "create_experiment": {
            const experimentCountRows = await tx
              .select({ value: count() })
              .from(experiments)
              .where(eq(experiments.productId, action.productId));
            const experimentCount = experimentCountRows[0]?.value ?? 0;
            const experimentNumber = `EXP-${String(Number(experimentCount) + 1).padStart(3, "0")}`;
            const [created] = await tx
              .insert(experiments)
              .values({ ...action, experimentNumber })
              .returning();
            if (!created)
              throw new Error("Experiment creation returned no record.");
            await activity(
              "experiment",
              created.id,
              "created",
              `Experiment created: ${created.experimentNumber} · ${created.name}`,
            );
            return created;
          }
          case "add_observation": {
            const [created] = await tx
              .insert(experimentObservations)
              .values({ ...action, observedAt: new Date(action.observedAt) })
              .returning();
            if (!created)
              throw new Error("Observation creation returned no record.");
            await activity(
              "experiment",
              action.experimentId,
              "observation_recorded",
              `Observation recorded: ${action.observationType}`,
            );
            return created;
          }
          case "update_experiment_status": {
            const [updated] = await tx
              .update(experiments)
              .set({
                status: action.status,
                updatedAt: new Date(),
                ...(action.status === "in_progress"
                  ? { productionDate: new Date().toISOString().slice(0, 10) }
                  : {}),
                ...(action.status === "archived"
                  ? { archivedAt: new Date() }
                  : {}),
              })
              .where(eq(experiments.id, action.experimentId))
              .returning();
            if (!updated) throw new Error("Experiment was not found.");
            await activity(
              "experiment",
              updated.id,
              "status_changed",
              `Experiment status changed: ${action.status}`,
            );
            return updated;
          }
          case "complete_experiment": {
            const observationCountRows = await tx
              .select({ value: count() })
              .from(experimentObservations)
              .where(
                eq(experimentObservations.experimentId, action.experimentId),
              );
            const observationCount = observationCountRows[0]?.value ?? 0;
            if (Number(observationCount) < 1)
              throw new Error(
                "At least one observation is required before completion.",
              );
            const [updated] = await tx
              .update(experiments)
              .set({
                status: "completed",
                result: action.result,
                conclusion: action.conclusion,
                nextChange: action.nextChange,
                updatedAt: new Date(),
              })
              .where(eq(experiments.id, action.experimentId))
              .returning();
            if (!updated) throw new Error("Experiment was not found.");
            await activity(
              "experiment",
              updated.id,
              "completed",
              `Experiment completed: ${updated.experimentNumber}`,
              action.result,
            );
            return updated;
          }
        }
      });
    },
  };
}
