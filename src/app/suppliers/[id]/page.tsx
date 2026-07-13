import { notFound } from "next/navigation";
import { CommercialRecord } from "@/src/presentation/commercial/commercial-record";
import { loadCommercialSnapshot } from "@/src/services/commercial/load-commercial";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = (await loadCommercialSnapshot()).suppliers.find((x) => x.id === id);
  if (!r) notFound();
  return (
    <CommercialRecord
      eyebrow="Supplier Network"
      title={r.name}
      back="/modules/suppliers"
      fields={[
        ["Type", r.supplierType],
        ["Status", r.status],
        ["Website", r.website],
        ["Location", r.location],
        ["Contact", r.contactName],
        ["Last verified", r.lastVerifiedAt],
        ["Notes", r.notes],
      ]}
    />
  );
}
