import { notFound } from "next/navigation";
import { CommercialRecord } from "@/src/presentation/commercial/commercial-record";
import { loadCommercialSnapshot } from "@/src/services/commercial/load-commercial";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = (await loadCommercialSnapshot()).packaging.find((x) => x.id === id);
  if (!r) notFound();
  return (
    <CommercialRecord
      eyebrow="Packaging Library"
      title={r.name}
      back="/modules/packaging"
      fields={[
        ["Type", r.componentType],
        ["SKU", r.sku],
        ["Material", r.material],
        [
          "Capacity",
          r.capacity
            ? `${r.capacity} ${r.capacityUnit ?? "unit unknown"}`
            : null,
        ],
        [
          "Unit cost",
          r.unitCost
            ? `${r.currency ?? "currency unknown"} ${r.unitCost}`
            : null,
        ],
        ["Availability", r.availabilityStatus],
        ["Compatibility notes", r.compatibilityNotes],
      ]}
    />
  );
}
