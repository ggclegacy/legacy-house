import { createProductLineInput } from "@/src/domain/product-lines/product-line";
import { productLineSeedDefinitions } from "@/src/domain/product-lines/product-line-seeds";
import {
  createDatabase,
  getRuntimeDatabaseUrl,
} from "@/src/infrastructure/database/client";
import { runtimeMutationDeniedResponse } from "@/src/config/runtime-policy";
import { createDrizzleProductLineRepository } from "@/src/infrastructure/repositories/drizzle-product-line-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = getRuntimeDatabaseUrl();
  if (!url) {
    return Response.json({
      productLines: productLineSeedDefinitions,
      persistence: "unavailable",
    });
  }

  const connection = createDatabase(url);
  try {
    const productLines = await createDrizzleProductLineRepository(
      connection.db,
    ).listActive();
    return Response.json({ productLines, persistence: "database" });
  } catch {
    return Response.json(
      { productLines: productLineSeedDefinitions, persistence: "unavailable" },
      { status: 503 },
    );
  } finally {
    await connection.close();
  }
}

export async function POST(request: Request) {
  const denied = runtimeMutationDeniedResponse();
  if (denied) return denied;
  const parsed = createProductLineInput.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json(
      {
        error: "Product-line validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const url = getRuntimeDatabaseUrl();
  if (!url) {
    return Response.json(
      {
        error:
          "PostgreSQL is not configured. The product line was not created.",
      },
      { status: 503 },
    );
  }

  const connection = createDatabase(url);
  try {
    const productLine = await createDrizzleProductLineRepository(
      connection.db,
    ).create(parsed.data);
    return Response.json({ productLine }, { status: 201 });
  } catch {
    return Response.json(
      {
        error:
          "The product line could not be created. Confirm that its slug is unique.",
      },
      { status: 409 },
    );
  } finally {
    await connection.close();
  }
}
