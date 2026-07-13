import { developmentActionSchema } from "@/src/domain/development/actions";
import { createDatabase } from "@/src/infrastructure/database/client";
import { createDrizzleDevelopmentRepository } from "@/src/infrastructure/repositories/drizzle-development-repository";

export async function POST(request: Request) {
  const parsed = developmentActionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return Response.json(
      {
        error: "Development record validation failed.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  const url = process.env.DATABASE_URL;
  if (!url)
    return Response.json(
      {
        error:
          "PostgreSQL is not configured. No development record was changed.",
      },
      { status: 503 },
    );
  const connection = createDatabase(url);
  try {
    const result = await createDrizzleDevelopmentRepository(
      connection.db,
    ).execute(parsed.data);
    return Response.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed.";
    const conflict = /duplicate|unique|stale|approved|production-ready/i.test(
      message,
    );
    return Response.json({ error: message }, { status: conflict ? 409 : 422 });
  } finally {
    await connection.close();
  }
}
