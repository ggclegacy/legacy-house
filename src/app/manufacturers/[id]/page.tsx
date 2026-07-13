import { notFound } from "next/navigation";
import { CommercialRecord } from "@/src/presentation/commercial/commercial-record";
import { loadCommercialSnapshot } from "@/src/services/commercial/load-commercial";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = (await loadCommercialSnapshot()).manufacturers.find(
    (x) => x.id === id,
  );
  if (!r) notFound();
  return (
    <CommercialRecord
      eyebrow="Manufacturer Directory"
      title={r.name}
      back="/modules/manufacturers"
      fields={[
        ["Type", r.manufacturerType],
        ["Status", r.status],
        ["Website", r.website],
        ["Location", r.location],
        ["Lead time days", r.typicalLeadTimeDays],
        ["Certifications as entered", r.certifications.join(", ") || null],
        ["Notes", r.notes],
      ]}
    />
  );
}
