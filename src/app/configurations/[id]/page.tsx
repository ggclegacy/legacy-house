import { notFound } from "next/navigation";
import { CommercialRecord } from "@/src/presentation/commercial/commercial-record";
import { loadCommercialSnapshot } from "@/src/services/commercial/load-commercial";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = await loadCommercialSnapshot();
  const r = s.configurations.find((x) => x.id === id);
  if (!r) notFound();
  return (
    <CommercialRecord
      eyebrow="Finished Product Configuration"
      title={r.name}
      back="/modules/costing"
      fields={[
        ["Fill", `${r.fillSize} ${r.fillSizeUnit}`],
        [
          "Source",
          r.formulaVersionId
            ? "Formula version"
            : "Manufacturer catalog product",
        ],
        ["Active", r.active ? "Yes" : "No"],
        ["Retail target", r.targetRetailPrice],
        ["Wholesale target", r.targetWholesalePrice],
        [
          "COGS",
          s.snapshots.some((x) => x.finishedProductConfigurationId === r.id)
            ? "Snapshot available"
            : "Incomplete — no snapshot",
        ],
        ["Notes", r.notes],
      ]}
    />
  );
}
