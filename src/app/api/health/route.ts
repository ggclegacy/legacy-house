export function GET() {
  return Response.json(
    { status: "live", service: "legacy-house" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
