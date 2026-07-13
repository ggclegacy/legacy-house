import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await loadDevelopmentSnapshot();
  return Response.json(snapshot, {
    status: snapshot.persistence === "database" ? 200 : 206,
  });
}
