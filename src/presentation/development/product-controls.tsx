"use client";

import { useState } from "react";

import {
  labelFor,
  pipelineStatuses,
  productPriorities,
} from "@/src/domain/development/development";
import type { DevelopmentProduct } from "@/src/domain/development/snapshot";

async function post(payload: Record<string, unknown>) {
  const response = await fetch("/api/development/actions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Product update failed.");
}

export function ProductControls({
  product,
  productLines,
  persistence,
}: {
  product: DevelopmentProduct;
  productLines: readonly { id: string; name: string }[];
  persistence: "database" | "unavailable";
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [archiveConfirmation, setArchiveConfirmation] = useState("");
  const enabled = persistence === "database";

  async function update(
    action: "update_product_status" | "update_product_priority",
    value: string,
  ) {
    try {
      await post({
        action,
        productId: product.id,
        ...(action === "update_product_status"
          ? { pipelineStatus: value }
          : { priority: value }),
        expectedUpdatedAt: product.updatedAt ?? undefined,
      });
      window.location.reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Product update failed.",
      );
    }
  }

  async function archive() {
    try {
      await post({ action: "archive_product", productId: product.id });
      window.location.assign("/modules/product-pipeline");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Archive failed.");
    }
  }

  async function editProduct(formData: FormData) {
    try {
      await post({
        action: "update_product",
        productId: product.id,
        productLineId: formData.get("productLineId"),
        data: {
          description: formData.get("description") || null,
          developmentPath: formData.get("developmentPath"),
          targetLaunchDate: formData.get("targetLaunchDate") || null,
          expectedUpdatedAt: product.updatedAt ?? undefined,
        },
      });
      window.location.reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Product edit failed.",
      );
    }
  }

  return (
    <aside className="product-controls" aria-label="Product controls">
      <label>
        <span>Status</span>
        <select
          defaultValue={product.pipelineStatus}
          disabled={!enabled}
          onChange={(event) =>
            update("update_product_status", event.target.value)
          }
        >
          {pipelineStatuses
            .filter((status) => status !== "archived")
            .map((status) => (
              <option value={status} key={status}>
                {labelFor(status)}
              </option>
            ))}
        </select>
      </label>
      <label>
        <span>Priority</span>
        <select
          defaultValue={product.priority}
          disabled={!enabled}
          onChange={(event) =>
            update("update_product_priority", event.target.value)
          }
        >
          {productPriorities.map((priority) => (
            <option value={priority} key={priority}>
              {labelFor(priority)}
            </option>
          ))}
        </select>
      </label>
      <details>
        <summary>Edit product</summary>
        <form action={editProduct} className="form-stack">
          <label>
            <span>Product line</span>
            <select
              name="productLineId"
              defaultValue={product.productLineId}
              disabled={!enabled}
            >
              {productLines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Development path</span>
            <select
              name="developmentPath"
              defaultValue={product.developmentPath}
              disabled={!enabled}
            >
              {[
                "custom_formula",
                "white_label",
                "private_label",
                "manufacturer_custom",
                "curated_resale",
                "undecided",
              ].map((path) => (
                <option key={path} value={path}>
                  {labelFor(path)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Description</span>
            <textarea
              name="description"
              defaultValue={product.description ?? ""}
              disabled={!enabled}
            />
          </label>
          <label>
            <span>Target launch</span>
            <input
              type="date"
              name="targetLaunchDate"
              defaultValue={product.targetLaunchDate ?? ""}
              disabled={!enabled}
            />
          </label>
          <button className="button" disabled={!enabled}>
            Save product
          </button>
        </form>
      </details>
      <details>
        <summary>Archive product</summary>
        <p>
          This preserves the record and removes it from the active pipeline.
        </p>
        <label>
          <span>Type ARCHIVE to confirm</span>
          <input
            value={archiveConfirmation}
            onChange={(event) => setArchiveConfirmation(event.target.value)}
            disabled={!enabled}
          />
        </label>
        <button
          type="button"
          className="button-secondary"
          disabled={!enabled || archiveConfirmation !== "ARCHIVE"}
          onClick={archive}
        >
          Archive
        </button>
      </details>
      {message ? (
        <p className="inline-feedback" role="status">
          {message}
        </p>
      ) : null}
    </aside>
  );
}
