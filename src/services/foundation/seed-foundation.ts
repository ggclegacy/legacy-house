import type { ProductLineRepository } from "@/src/domain/product-lines/product-line";
import { productLineSeedDefinitions } from "@/src/domain/product-lines/product-line-seeds";

export async function seedFoundationData(
  repository: ProductLineRepository,
): Promise<void> {
  await repository.seed(productLineSeedDefinitions);
}
